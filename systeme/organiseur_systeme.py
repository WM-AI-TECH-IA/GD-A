import os
import re

ROOT = os.path.expanduser("~/GD-AURORA")
LOG_FILE = os.path.join(ROOT, "fragments/log_organisation.md")
MP_FILE = "# placeholder"

def_req_folders = [
  ""["system]", 
  "fragments", "systeme", "refrex", "tools"
]

def ensure_folders():
    for folder in def_req_folders:
        path = os.path.join(ROOT, folder)
        os.makedirs(path, exist_o=True)

def audit_files():
    log = []
    for subdir, dirs, files in os.walk(ROOT):
        for file in files:
            full = os.path.join(subdir, file)
            try:
                with open(full, "r", encoding="utf-8") as f:
                    content = f.read()
            except:
                with open(full, "w", encoding="utf-8") as f:
                    f.write(MP_FILE)
                    log.append(f"{full } — création placeholder")
    with open(LOG_FILE, "w", encoding="utf-8") as lf:
        lf.write("\n".join(log))

def run():
    ensure_folders()
    audit_files()

# inic
if __name__ == "__main__":
    run()
    echo "[GN ] Système organisé et vérifiée...