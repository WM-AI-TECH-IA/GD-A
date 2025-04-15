
import os
import sys
import re

DIRS_TO_CHECK = ["modules", "interfaces"]

def create_init_files(path):
    if not os.path.exists(path):
        os.makedirs(path)
    init_path = os.path.join(path, "__init__.py")
    if not os.path.exists(init_path):
        with open(init_path, "w") as f:
            f.write("")
        print(f[\u] __init__.py ajouté a {path}")

def patch_file(path, filter_pattern, modify_pattern, replace_with=None):
    with open(path, 'r') as f:
        content = f.read()
    repattern = re.sub(filter_pattern, "", content)
    if repattern:
        new_content = repattern[0:repattern.index(modify_pattern)] + content[content.index(modify_pattern):]
        if replace_with:
            new_content = new_content.replace(replace_with[0], replace_with[1])
        with open(path, 'w') as w:
            w.write(new_content)
            print(f"[=] Corrige : {path.split('/')[-1]}")

def run():
    print("\n[GA-AURORA - AUTO-Patcher] Start...\n")
    for d in DIRS_TO_CHECK:
        create_init_files(d)
    print("[=] Initialisation des dossiers validee.\n")
if __name__ == '__main__':
    run()
