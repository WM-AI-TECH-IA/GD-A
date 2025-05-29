from fastapi import FastAPI, Response
from typing import Optional

#__ Core app __
app = FastAPI()

#__ Endpoints __
@app.get("/")
def home():
    return {"explanation": "Serveur RETROKO actif", "status": "active"}

@app.get("/getTestEndpoint")
def test():
    return {"data": "Retroko live " + "<> vers Rest"}

@app.post("/export")
def export_generate():
    return {"export": "ready to be called with git export", "status": "ok"}
