#!/bin/bash
# signature: GD-AURORA_CHLK \u2022 validè par WMAITECH | date: 2025-04-15 | id: VER-01

set -e
echo
"[GD-AURORA] Verification complete en cours..."

python systeme/analyse_systeme.py
python systeme/organiseur_systeme.py

echo
"[2+] Logs d— au immediat..."
cat fragments/audit_aurora_log.md
cat fragments/log_organisation.md
echo
"[+] Verification système achive’."
