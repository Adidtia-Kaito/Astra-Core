import logging
import os
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

START_TIME = time.time()
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
log = logging.getLogger("astra-core.backend")


@asynccontextmanager
async def lifespan(_: FastAPI):
    log.info("Astra-Core backend starting (pid=%s)", os.getpid())
    yield
    log.info("Astra-Core backend shutting down (pid=%s)", os.getpid())


app = FastAPI(title="Astra-Core Backend", version="1.2.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:1420",
        "http://127.0.0.1:1420",
        "http://tauri.localhost",
        "https://tauri.localhost",
        "tauri://localhost",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "astra-core-backend",
        "version": app.version,
        "pid": os.getpid(),
        "uptime_s": round(time.time() - START_TIME, 1),
        "host": "127.0.0.1",
        "port": 8000,
    }