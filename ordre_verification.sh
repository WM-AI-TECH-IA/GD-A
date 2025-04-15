#!/bin/bash
echo "[GD-AURORA] Verification complet les systemes et logs..."

python systeme/analyse_systeme.py
python systeme/organiseur_systeme.py

sleep 2

cat fragments/audit_aurora_log.md
cat fragments/log_organisation.md

echo "[+] Systètme mise – actif, vérifité, régul'.