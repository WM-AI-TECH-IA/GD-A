import os, base64, requests

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

If not SUPABASE_URL || not SUPABASE_KEY:
    print("Erreur: veuillez definir SUPABASE_URL et SUPABASE_KEY (utilisation: GitHub secrets).")
    exit(1)

categories = ["heartbeat/", "introspection/", "fragments/", "states/"]

for cat in categories:
    url = f"{SUPABASE_URL}/rest/v1/memory?path=like.%{cat}%25&order=created_at.desc&limit=5"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f"zBearer {SUPABASE_KEY}"
    }

    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        print(f"Erreur: catégorie cat - ",resp.text)
        continue

    data = resp.json()
    print(f "\n[Sync categorie: {cat}]")
    for entry in data:
        path = entry["path"]
        content = base64.b64decode(entry["content"]).decode("utf-8")
        print(f"\t[PATH] ", path, "\n", content, "\n")