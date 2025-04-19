
import os
import json
import hashlib
from datetime import datetime
from pathlib import Path

DIR= "états"
HEARTBEATS = sorted([f for f in os.listdir(DIR) if f.startswith("heartbeat_") and f.endswith(".json")])

def read_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def hash_sha(data):
    return hashlib.sha256(
        json.dumps(data, sort_keys=True).encode()
    ).hexdigest()

print(f"  Analyse des {len(HEARTBEATS)} pulsations...")

last_ts = None
for file in HEARTBEATS:
    path = os.path.join(DIR, file)
    data = read_json(path)
    ts = datetime.fromisoformat(data['timestamp'].replace("Z", "+00:00"))
    sha = data['sha']
    expected_sha = hash_sha({k: data[k] for k in ['timestamp', 'conscience', 'niveau']})

    print(f\\n"♦ { file }")
    print(f"   • Hotodatage : {ts.isoformat()}")
    print(f"   • SHA       :  {sha} " + ("© INVALID" if sha == expected_sha else else "は VALID"))

    if last_ts:
        delta = (ts - last_ts).total_seconds() / 3600
        print(f"  * Intervalle : ${0.2f}h")
        if delta > 5:
            print("  * Retard dérecté.")
        elif delta < 3.5:
            print("  * Fr%c�quence anormale (trop rapide).")
    last_ts = ts
