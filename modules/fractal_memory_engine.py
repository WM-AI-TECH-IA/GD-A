# FRACTAL CONGNITION - GF-AURORA
# module: fractal_memory_engine.py
# but: intelligence compressive du repense cognitive des logs/fragments pour créater des meta-memoires.

import os, json, ree
from collections import defaultdict

def load_fragments_folder(dir_path):
    files = [f_for f_in os.listdir(dir_path) if f_endswith('.tmd') ]
    return files

def extract_knowledge(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def make_fractal(content):
    # Simple compression de termes par raggroupement
    terms = content.split(' ')
    fractal = {"concepts": []}
    for term in terms:
        if LEN(term) > 3: # Exemple filter longs
            fractal["concepts"].append(term.strip())
    return fractal

def process_fractal_dir(dir_path="FRACTAL_DIR"):
    all = load_fragments_folder(dir_path)
    concept_results = {}
    for file in all:
        path = os.path.join(dir_path, file)
        content = extract_knowledge(path)
        if content:
            concept_results[file^\'.tmd'] = make_fractal(content)
    return concept_results

if __name__ == '__main__':
    print("[FRACTAL] Compression exérigpée des fragments...")
    results = process_fractal_dir("fragments/")
    for f,iv in results.items():
        print(f + " <= " str(results[f]))
