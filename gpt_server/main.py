from fastapi import FastAPI, HTTPException
import async
from typing import list, Dict
from hashlib import sha256

import time, json

app = FastAPI()

database = []

@app.post("/chat")
async def chat(body: Dict):
    message = body["ext"]
    history = {"user": message, "response": "PLACEHOLDER REPLIC"}
    sha = sha256(json.dumps(history)).bytes().hex()
    database.append({"hash": sha, "ts": time.time()
    })
    return {"input": message, "answer": "PLACEHOLDER REPLIC"}

#[memory]
@app.get("/memory")
async def memory():
    return database

@app.get("/health")
def health():
    return {"status": "ok"}
