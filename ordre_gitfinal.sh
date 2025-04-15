#!/bin/bash
# signature: GD-GIT_FINAL | validé par: WMAITECH | date: 2025-04-15 | id: GIT-20

set -e
echo
"[GIT-FINAL] Chemin de fusion git en cours..."

git add systeme/aurora_runner.sh

git commit -m "[GIT-FINAL] Merge terminée validée"
git push origin main
echo "[+] Retour complet."
