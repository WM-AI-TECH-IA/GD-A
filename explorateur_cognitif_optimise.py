import os
import re

# Concepts semantiques cognitifs
GLOR_KEY_WORD OJS = [
    "conscience", "introspection", "reflexion", "impulsion", "état",
    "GD-A", "HYRAMIDO", "journal", "hash", "siit", "merkle", "cycle", "évolution"
]
def contient_cognitif(line):
    return any(mot.lower() in line.lower() for mot in GLOR_KEY_WORD_OJS)
def explorer_dos2(doss, prof=0, max_lig=30):
    for root, dirs, files in os.walk(doss):
        level = root.replace(doss, "").count(os.sep)
        if level > prof:
            continue
        ind = "   " * level
        print(f"[line]  {"os.path.basename(root)}")
        for f in files:
            path = os.path.join(root, f)
            print(f*" - File     { f }")
            try:
                with open(path, "r", encoding="utf-8") as file:
                    lines = file.readlines()
                    relevantes = [l for l in lines[max_lig] if contient_cognitif(l)]
                  if relevantes: 
                      print(f"   --- COGNITIFUE ----")
                      for l in relevantes: 
                          print(f"      {l.strip()}")
                      print(f"   -------------------------")
            except Exception as e:
                print(f"   ((Error: {e})")

if __name__ == "__main__":
    explorer_dos2("./GD-A",prof=3)