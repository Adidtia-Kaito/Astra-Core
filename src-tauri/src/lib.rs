mod backend;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(backend::BackendState::default())
        .setup(|app| {
            let handle = app.handle().clone();
            let _ = backend::ensure_dirs(&handle);
            let _ = backend::start(&handle);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            backend::app_info,
            backend::backend_status,
            backend::backend_start,
            backend::backend_stop,
            backend::backend_restart
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app, event| {
            if matches!(event, tauri::RunEvent::Exit | tauri::RunEvent::ExitRequested { .. }) {
                let _ = backend::stop(app);
            }
        });
}