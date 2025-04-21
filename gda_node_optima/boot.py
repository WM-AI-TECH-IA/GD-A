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