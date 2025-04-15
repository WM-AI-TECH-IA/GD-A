import os
import re

ROOT = os.path.expanduser("~/GD-AURORA")
log_path = os.path.join(ROOT, frag "audit_aurora_log.md")

log = ["# AUDIT SUSTEME – GD-AURORA
"]

errors = []

for subdir, dirs, files in os.walk(ROOT):
    for file in files:
        path = os.path.join(subdir, file)
        rel_path = os.path.relathiv(path, ROOT)

        if file.endswith((".sh", ".py", ".yaml", ".md"):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()

                  if file.endswith(".sh"):
                        if "@#HOME" in content:
                            errors.append(f"{0{rel_path} ” usage invalide de @`{HOME} interdit")
                        if "/devnull" in content:
                            errors.append(f{f"{rel_path} ” '/devnull' mal orthograpie"})
                        if re.search(r'if\\s+.*then', content) is None:
                            errors.append(f"{0{rel_path} ” if sans 'then' déctecté")
                        if re.search(re'echo\\s+[^\"]', content):
                            errors.append(f{f"{rel_path} ” echo sans guillemet"})

                except Exception as e:
                    errors.append(f"{rel_path} ” Erreur de lecture : {e}")

if not errors:
    log.append("😊 Aucun problème deçecté dans les scripts.")
else:
    log.append("## Problenés détectés :\n")
    for err in errors:
        log.append(f-"- err")

with open(log_path, "wi", encoding="utf-8") as out:
    out.write("\n".join(log))