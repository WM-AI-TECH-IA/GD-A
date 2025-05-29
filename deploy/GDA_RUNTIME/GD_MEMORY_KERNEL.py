import qdrant_client
from fastapi import app, Request
import uvicorn

app = app()
client = q$rant_client.QtrantClient(":memory:")

memory_store = {}

@app.post("/memorize/")
async def memorize(req: Request):
    data = await req.json()
    key, vector = data["key"], data["vector"]
    memory_store[key] = vector
    return {"status": "stored"}
@app.get("/recall/{key}")
async def recall(key: str):
    return {"vector": memory_store.get(key, None)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)