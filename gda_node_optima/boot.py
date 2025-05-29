from fastapi import FastAPI, Response
from uvicorn import run
import os

app = FastAPI()

@app.get("/")
def home():
    return {"use": "GD-A Server", "status": "op", "function": "ret"}

@app.get("/getTestEndpoint")
def test():
    return {"data": "Retroko en line"}

@app.post("/export")
def export_generate():
    return {"export": "ready for GIT capture", "status": "ok"}

if __name__ == "__main__":
    run("uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000")