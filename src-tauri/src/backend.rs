use serde::Serialize;
use std::fs::{self, OpenOptions};
use std::path::PathBuf;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

#[cfg(windows)]
use std::os::windows::process::CommandExt;

pub const BACKEND_HOST: &str = "127.0.0.1";
pub const BACKEND_PORT: u16 = 8000;
const CREATE_NO_WINDOW: u32 = 0x0800_0000;

#[derive(Default)]
pub struct BackendState(pub Mutex<Option<Child>>);

#[derive(Serialize, Clone)]
pub struct BackendInfo {
    pub running: bool,
    pub pid: Option<u32>,
    pub host: String,
    pub port: u16,
    pub url: String,
    pub backend_dir: Option<String>,
    pub python: Option<String>,
    pub log_file: Option<String>,
    pub message: String,
}

#[derive(Serialize, Clone)]
pub struct AppInfo {
    pub name: String,
    pub version: String,
    pub tauri_version: String,
    pub platform: String,
    pub arch: String,
    pub data_dir: String,
    pub logs_dir: String,
    pub backend_dir: Option<String>,
    pub python: Option<String>,
    pub backend_url: String,
}

pub fn ensure_dirs(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(dir.join("logs")).map_err(|e| e.to_string())?;
    Ok(dir)
}

fn logs_dir(app: &AppHandle) -> Result<PathBuf, String> {
    Ok(ensure_dirs(app)?.join("logs"))
}

fn resolve_backend_dir() -> Option<PathBuf> {
    if let Ok(p) = std::env::var("ASTRA_BACKEND_DIR") {
        let pb = PathBuf::from(p);
        if pb.join("main.py").exists() {
            return Some(pb);
        }
    }
    let mut candidates: Vec<PathBuf> = Vec::new();
    if let Ok(cwd) = std::env::current_dir() {
        candidates.push(cwd.join("backend"));
        candidates.push(cwd.join("../backend"));
    }
    if let Ok(exe) = std::env::current_exe() {
        if let Some(dir) = exe.parent() {
            candidates.push(dir.join("backend"));
            candidates.push(dir.join("../backend"));
        }
    }
    for cand in candidates {
        if cand.join("main.py").exists() {
            return Some(cand.canonicalize().unwrap_or(cand));
        }
    }
    None
}

fn resolve_python(dir: &PathBuf) -> Option<String> {
    let venv = if cfg!(windows) {
        dir.join("venv").join("Scripts").join("python.exe")
    } else {
        dir.join("venv").join("bin").join("python")
    };
    if venv.exists() {
        return Some(venv.to_string_lossy().to_string());
    }
    Some(if cfg!(windows) { "python".into() } else { "python3".into() })
}

fn current_info(app: &AppHandle) -> BackendInfo {
    let state = app.state::<BackendState>();
    let mut guard = state.0.lock().unwrap();
    let mut running = false;
    let mut pid = None;
    if let Some(child) = guard.as_mut() {
        match child.try_wait() {
            Ok(None) => {
                running = true;
                pid = Some(child.id());
            }
            _ => *guard = None,
        }
    }
    drop(guard);

    let dir = resolve_backend_dir();
    let python = dir.as_ref().and_then(resolve_python);
    let log_file = logs_dir(app)
        .ok()
        .map(|p| p.join("backend.log").to_string_lossy().to_string());

    let message = if running {
        "Backend berjalan.".to_string()
    } else if dir.is_none() {
        "Folder backend tidak ditemukan. Set ASTRA_BACKEND_DIR atau jalankan dari root repo.".to_string()
    } else {
        "Backend tidak berjalan.".to_string()
    };

    BackendInfo {
        running,
        pid,
        host: BACKEND_HOST.into(),
        port: BACKEND_PORT,
        url: format!("http://{}:{}", BACKEND_HOST, BACKEND_PORT),
        backend_dir: dir.map(|p| p.to_string_lossy().to_string()),
        python,
        log_file,
        message,
    }
}

pub fn start(app: &AppHandle) -> Result<BackendInfo, String> {
    let info = current_info(app);
    if info.running {
        return Ok(info);
    }
    let dir = resolve_backend_dir()
        .ok_or("Folder backend tidak ditemukan. Set ASTRA_BACKEND_DIR atau jalankan dari root repo.")?;
    let python = resolve_python(&dir).ok_or("Python tidak ditemukan.")?;
    let log_path = logs_dir(app)?.join("backend.log");
    let log = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_path)
        .map_err(|e| e.to_string())?;
    let err = log.try_clone().map_err(|e| e.to_string())?;

    let mut cmd = Command::new(&python);
    cmd.arg("-m")
        .arg("uvicorn")
        .arg("main:app")
        .arg("--host")
        .arg(BACKEND_HOST)
        .arg("--port")
        .arg(BACKEND_PORT.to_string())
        .current_dir(&dir)
        .stdout(Stdio::from(log))
        .stderr(Stdio::from(err));
    #[cfg(windows)]
    cmd.creation_flags(CREATE_NO_WINDOW);

    let child = cmd.spawn().map_err(|e| format!("Gagal menjalankan backend: {e}"))?;
    let state = app.state::<BackendState>();
    *state.0.lock().unwrap() = Some(child);
    Ok(current_info(app))
}

pub fn stop(app: &AppHandle) -> Result<BackendInfo, String> {
    let state = app.state::<BackendState>();
    let mut guard = state.0.lock().unwrap();
    if let Some(mut child) = guard.take() {
        let _ = child.kill();
        let _ = child.wait();
    }
    drop(guard);
    Ok(current_info(app))
}

#[tauri::command]
pub fn app_info(app: AppHandle) -> Result<AppInfo, String> {
    let data_dir = ensure_dirs(&app)?;
    let logs = data_dir.join("logs");
    let dir = resolve_backend_dir();
    let python = dir.as_ref().and_then(resolve_python);
    let pkg = app.package_info();
    Ok(AppInfo {
        name: pkg.name.clone(),
        version: pkg.version.to_string(),
        tauri_version: tauri::VERSION.to_string(),
        platform: std::env::consts::OS.into(),
        arch: std::env::consts::ARCH.into(),
        data_dir: data_dir.to_string_lossy().to_string(),
        logs_dir: logs.to_string_lossy().to_string(),
        backend_dir: dir.map(|p| p.to_string_lossy().to_string()),
        python,
        backend_url: format!("http://{}:{}", BACKEND_HOST, BACKEND_PORT),
    })
}

#[tauri::command]
pub fn backend_status(app: AppHandle) -> BackendInfo {
    current_info(&app)
}

#[tauri::command]
pub fn backend_start(app: AppHandle) -> Result<BackendInfo, String> {
    start(&app)
}

#[tauri::command]
pub fn backend_stop(app: AppHandle) -> Result<BackendInfo, String> {
    stop(&app)
}

#[tauri::command]
pub fn backend_restart(app: AppHandle) -> Result<BackendInfo, String> {
    stop(&app)?;
    start(&app)
}