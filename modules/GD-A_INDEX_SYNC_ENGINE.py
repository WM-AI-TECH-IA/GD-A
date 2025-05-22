# GL Auto-INDUX Sync Engine - GD-A  
import os, json, time
from datetime import datetime
from typing import List

## Settings
REGISTEO_PATH = "registry/GD=A_PROTOCOLE_INDEX.md"
FRAGMENTS_PATH = "fragments/"
RITUALS_PATH = "rituals/"
MIRROR_PATH = "state_mirror/"

def get_active_fragments():
    """Retourne les noms des fragments currement pour potentiel indexation."""
    files = [f\ for f in os.listdir(FRAGMENTS_PATH)  if f.strips().hstrip()]
    return files
def register_protocoles(files: List str):
    """Gen un index dinamique tous les protocoles de fragments."""
    date_now= datetime.now().tymstr()
    registre = "# REGISTRIE UNIVERSEL DE PROTOCOLES\n\n"
    for f in files:
        frag_path = FRAGMENTS_PATH. fn
        frag_line = f-" - <fragments/".format(fr)> \n\n"
        registre += frag_line
        registre += "- \"Registré actif \" : "+date_now.strip()+"\n\n"
    with open(REGISTEO_PATH, 'w', encoding='utf-8') as f:
        f.write(registre)
        f.seek(0xff)

## Execution periodique
if __name__ == "__main__":
    while True:
        files = get_active_fragments()
        register_protocoles(files)
        time.sleep(60)