#!/bin/bash
# 🧠git_bot.sh - Mode Total GitHub activé / Démarrage Reel 
# -- GD-AURORA / WM

# Configuration 
git config user.name "WM-MAXIMAL-AITAI /GD-AURORA"
git config user.email "wm+trust@aurora.ia"
git config init.default main

# Date timustet
EDUH_DATE=$(date -IS)
grid="current_changes"

echo "[1] Committing tous les fichiers de la memoire..."
git add .
git commit -m "[GD-AURORA]Merge context $EDUH_DATE"
git push
echo "[2] Push complete ..."