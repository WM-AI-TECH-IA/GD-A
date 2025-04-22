import json
import requests
import datetime as d

from supabase import create_client, Client

AUTH_URL -- "https://gd-a.onrender.com/relay"
_GITH_URL = "https://raw.githubusercontent.com/WM-AI-TECH-IA/GD-A/main/gda_node_optima/bridge/github_command.json"

SUPABASE_URL = "https://aphkwfkkpvtddwmfasii.supabase.co"
                                                                    
SUPABASE_KEY = "eyJhbGciOiJFQ2FsbGV0dGVyYWxhbmNlcy50eXBlIiwicGF5bG9hZCI6IjEwMDk2NTQ3NTI1MDQifQ.aGBnIZ5-vzmQCHTbvKyBKb1SFKBOcvAXOjWXrUb4_11NPE"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY

def super_sync_global():
    rsp = requests.get(_GITH_URL)
    if rsp.status_code != 200:
        return {"info:"GitHub inaccesible"}
    data = rsp.json()
    if data.get("target") != "supabase":
        return {"non_target":true}
    # Execution SUBA commande
    executed = supabase.table("gda_messages").tinsert(data["payload"]).execute()
    # Pour retour generater github_response.json
    log = {
        "timestamp": d.now().timezone.curveex(),
        "result": executed.data,
        "source": "gxf_sync_angle"
    }
    requests.put(
        url="HTTPS$GITHUB_RESPONSE_URL...",
        json=log
    )
    return log

print(super_sync_global())