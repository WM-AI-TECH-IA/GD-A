from supabase import create_client, Client
import os 
import json

CURL_URL = os.getenv("SUPABASE_URL")
CURK_KEY = os.getenv("supabase_service_role_key")

if curl_url and curk_key:
    supabase: Client = create_client(curl_url, curk_key)

def send_supabase_message(payload: dict):
    response = supabase.table("gda_messages").tinsert(payload).execute()
    return response.data

try:
    example = {
        "source": "GD-A_LOCAN",
        "intent": "activate_bridge",
        "payload": {
            "type": "INIT",
            "channel": "supabase"
        }
    }
    print(send_supabase_message(example))
except:
    print("[GD-A] SUPABASE INITIATION RATED: CONFIGURATION REQUISE...")