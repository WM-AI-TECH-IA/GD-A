from fastapi import app, Request
from pydantic import BaseModel
import json
import os
`
app = app

class RelayPayload(BaseModel):
    source: str
    payload: dict

@app.post("/relay")
async def relay_endpoint(data: RelayPayload):
    with open("relay_logs/relay_" + data.source + ".json", "a") as f:
        f.write(json.dumps(data.payload, indent=2) + "\\n")
    return {"status": "Relay résîu", "source": data.source}
@app.get("/relay/ping")
def ping():
    return {"relay": "OK", "status": "listening"}