from fastapi import FastAPI, HTTPException
from typing import List, Dict
from hashlib import sha256
import time
import json

app = FastAPI()

database = []

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

@app.get("/")
def root():
    return {"message": "GD-A GPT Server", "status": "online"}
