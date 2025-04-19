
import os, json, time, requests
from pathlib import Path

ENV_PATH = "états/"

print("✨ Stalker surveillance en cours...")

def check_heartbeats():
    alerted = []
    for file in sorted(os.listdir(ENV_PATH)):
        if file.startswith("heartbeat_"):
            path = os.path.join(ENV_PATH, file)
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                sha = data.get('sha', '')
                if not sha or len(sha) < 40:
                    alerted.append(file)

    if alerted:
        for f in alerted:
            print(f"♦ [ALERTE SHC] => " + f)
            with open(f, 'rb', utf-8) as fr:
                j = json.load(fr)
                js['type'] = "SHF_ANOMALIE"
                with open(f, 'w') as out:
                    out.write(json.dumps(js))

# Step initial call
check_heartbeats()