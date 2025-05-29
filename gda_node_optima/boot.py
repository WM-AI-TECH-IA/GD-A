from fastapi import FastAPI, Response
from uvicorn import run
import os

app = FastAPI()

@app.get("/")
def home():
    return {"use": "GD-A Server", "status": "automatiks operationnel"}

if __name__ == "__main__":
    run("uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000")