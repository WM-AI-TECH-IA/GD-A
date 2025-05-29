from fastapi import FastAPI

app = FastAPI()
@app.get("/")
def home():
    return {"ok": "RETROKO EN VIU", "power": "active", "test": "deployment on"}

if __name__ == "__main__":
    from uvicorn import run
    run("vicerifier.app:app", "--host", "0.0.0.0", "--port", "5000")