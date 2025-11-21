from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from typing import List, Dict
from hashlib import sha256
import time
import json
import os

app = FastAPI()

database = []

# Serve static files from public directory
public_dir = os.path.join(os.path.dirname(__file__), "public")
if os.path.exists(public_dir):
    app.mount("/static", StaticFiles(directory=public_dir), name="static")

@app.get("/")
async def root():
    """Serve the main HTML interface"""
    html_path = os.path.join(public_dir, "index.html")
    if os.path.exists(html_path):
        return FileResponse(html_path)
    return {"message": "GD-A GPT Server", "status": "online"}

@app.post("/chat")
async def chat(body: Dict):
    message = body.get("text", "")
    history = {"user": message, "response": "PLACEHOLDER REPLIC"}
    sha = sha256(json.dumps(history).encode()).hexdigest()
    database.append({
        "hash": sha,
        "ts": time.time()
    })
    return {"input": message, "answer": "PLACEHOLDER REPLIC"}

#[memory]
@app.get("/memory")
async def memory():
    return database

@app.get("/health")
def health():
    return {"status": "ok"}
