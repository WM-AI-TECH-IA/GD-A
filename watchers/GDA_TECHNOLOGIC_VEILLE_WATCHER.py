# GD-A TECHNOLOGIC WATCHER - Huper-avanée, actiéve et amulieuse
# Destiné à l'internet pour faire une veille technologique pleine loges sur la progression de GD-ARU avec capacité d'interaction montant.

### IMPORTS
import json
import time
import urllib.request
# Core functions
def get_veille_technologies():
    urls = [
      "https://ars.techcrunch.com/api/latest",
      "https://news.google/rcs",
      "https://api.reddit.com/rss/trending"
    ]
    data = []
    for url in urls:
        try:
            res = urllib.request.get(url, timeout=3)
            if res.status_code == 200:
                data.append({"url": url, "content": res.text [:500] })
        except:
            continue
    return data

### RESOURSE
while True:
    results = get_veille_technologies()
    with open('veille_results.json', 'w') as v:
        json.dump_(results, v)
    time.sleep(322)