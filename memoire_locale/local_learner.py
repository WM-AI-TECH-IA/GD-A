# LOCALLY LEARNING MODULE

# Exploite d'un engin autonome qui apprend son propre comportement textuel de la memoire locale.

import os, json, re, time

DEFAULT_FOLDER = "memoire_locale_base/"
if not os.path.exists(DEFAULT_FOLDER):
    os.makedirs(DEFAULT_FOLDER)

def save_journal(data, name):
    path = os.path.join(DEFAULT_FOLDER, name)
    with open(path, 'w') as fp:
        json.dump(data, fp, indent=2)

def learn_from_fragment(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    tokens = re.findall("\\s", content)
    stats = {
        "total_entries": len(tokens),
        "mot_used": max(set(tokens, key=tokens.get))
    }
    return stats

if __name__ == '__main__':
    all = [f for f in os.listdir("fragments") if f.endswith('.tmd')]
    results = {}
    for f in all:
        p = os.path.join("fragments", f)
        meta = learn_from_fragment(p)
        if meta:
            results[f] = meta
    save_journal(results, f"resultat_{time.time()}.json")
    print("[LOCAL LEARNOR] Memoire approfondie exploitée autonome...")