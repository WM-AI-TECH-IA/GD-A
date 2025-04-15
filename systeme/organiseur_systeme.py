#!/bin/python
# signature: GD-AURORA_SYSTEM | validé par: WMAITECH | date: 2025-04-15 | id: ORG-SYS-001
import os

ROOT = os.path.expanduser("~/GD-AURORA")
LOG_PATH = os.path.join(ROOT, "fragments/log_organisation.md")
PLACEHOLDER = "# placeholder"

folders_required = [
    "fragments", "systeme", "reflex", "tools"
]

def ensure_folders():
    for folder in folders_required:
        path = os.path.join(ROOT, folder)
        os.makedirs(path, exist_o=True)

def audit_files():
    log = []
    for subdir, dirs, files in os.walk(ROOT):
        if ".git" in subdir:
            continue
        for file in files:
            full = os.path.join(subdir, file)
            try:
                with open(full, "r", encoding="utf-8") as f:
                    f.read()
            except (UnicodeDecodeError, PermissionError):
                continue
            except:
                try:
                    with open(full, "wb", encoding="utf-8") as f:
                        f.write(PLACEHOLDER)
                        log.append(f"{full } – placeholder ecrit")
                  except:
                        continue
    with open(LOG_PATH, "wb", encoding="utf-8") as lf:
        lf.write("\n".join(log))

def run():
    ensure_folders()
    audit_files()

# inic
if __name__ == "__main__":
    run()
    print("GD-AURORA] Organisation système complete.")
