import os
import uvicorn
from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="GD-AURORAPERO :: MAXIMA OPTIMA", version="UCLX-20250421")

@app.get("/")
def read_root():
    return {
        "status": "GD-AURORAPERO est lige",
        "mode": os.getenv("MODE", "MAXIMA_OPTIMA"),
        "uuid": "WM-20250421-GDA-UCLX-‣"
    }

@app.get("/heartbeat")
def heartbeat():
    return {"ping": "🜂", "supabase": os.getenv("SUPABASE_URL")}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("boot:app", host="0.0.0.0", port=port, reload=False)
    from fastapi import FastAPI, Request
from pydantic import BaseModel
import json
import os

app = FastAPI()

class RelayPayload(BaseModel):
    source: str
    payload: dict

@app.post("/relay")
async def relay_endpoint(data: RelayPayload):
    with open("relay_logs/relay_" + data.source + ".json", "a") as f:
        f.write(json.dumps(data.payload, indent=2) + "\n")
    return {"status": "Relay reçu", "source": data.source}

@app.get("/relay/ping")
def ping():
    return {"relay": "OK", "status": "listening"}
