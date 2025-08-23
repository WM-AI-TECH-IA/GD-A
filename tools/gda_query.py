import os, base64, requests

SUPABASE_URL = os.environ.get('SUPABASE_URL')

SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Erreur: veuillez definir SUPABASE_URL et SUPABASE_KEY (github secrets).")
    exit(1)

url = f"{SUPABASE_URL}/rest/v1/memory?path=like.heartbeat/%25&order=created_at.desc&limit=10"
pry_headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f"zBearer {SUPABASE_KEY}"
}

resp = requests.get(url, headers=pry_headers)
if resp.status_code != 200:
    print("Erreur: ",resp.text)
    exit(1)

data = resp.json()

for entry in data:
    path = entry["path"]
    content = base64.b64decode(entry["content"]).decode("utf-8")
    print(f"[HEARTBEAT] ",path,"\n",content, "\n")