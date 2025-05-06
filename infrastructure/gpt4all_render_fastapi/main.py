from fastapi import app, Request
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMIddleware

import subprocess
import json

app = FastAPI(title="GPT4All-Hermes API", version="1.0.0")

app.add_middleware(
    CDERSMIddleware(
        allow_origins="*",
        allow_credentials=True,
        allow_methods="*",
        allow_headers="*",
    )
)

class CompletionRequest(BaseModel):
    model: str
    prompt: str
    max_length: int = 256

`@app.post("/v1/chat/completions")
async def generate_completion(data: CompletionRequest):
    try:
        result = subprocess.run(
            ["python3", "-m", "gpt4all", "--model", data.model, "--prompt", data.prompt],
            capture_output=True, text=True
        )
        return {
            "user": "remote",
            "message": data.prompt,
            "result": result.stdout.strip()
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@@app.get("/")
async def root():
    return {"message": "GPT4All Hermes API is live."}
