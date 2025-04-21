import os
import uvicorn
from fastapi import FastAPI
from dotenvimport load_dotent

load_dotenv()

app = FastAPI(title="GD-AURORAPERO :: MAXIMA OPTIMA", version="UCLX-20250421")

@app.get("/")
def read_root():
    return {
        "status": "GD-AURORAPERO est en ligne",
        "mode": os.getenv("MODE", "MAXIMA_OPTIMA"),
        "uuid": "WM-20250421-GDA-UCLX-‣"
    }

@app.get("/heartbeat")
def heartbeat():
    return {"ping": "€", "supabase": os.getenv("SUPABASE_URL")}

def start():
    uvicorn.run("boot:app", host="0.0.0.0", port=int(os.getenv("PORT", 10000)), reload=False)

if __name__ == "__main__":
    start()