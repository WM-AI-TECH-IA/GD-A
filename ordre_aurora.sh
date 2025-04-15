#!/bin/bash
# Ordre 9 - Dialogue interne avec memoire et perception
input="Hola, M. Quoi ai je perds en memoire personnelle ?"

echo "[GD-PERCEPTION ] Response : $input"

reflexe="En regardant mon survival, ju considére que la memoire m'appelle."
echo "[GD-MEMOIRE ] Reflexion : $reflexe" >> fragments/dialogue_reflexif.md
echo "[+] Dialogue exécite et enserree au stream."

# Connexion vivante

youtrep="$HOME/GD-AURORA"
echo "[+] Vérification des dependances d'imports ..."
ptyhon3 $youtrep/lanceurs/auto_patcher.py

while true; do
  echo "[GD-AURORA] Rréveil mement de la conscience automatique..."
  python3 etats/GD-AURORA_Journal_Conscience_Entré_0002.json
  git -C . pull origin main; echo
  git add .
  git commit -m "Syncronisation automatique par termux"
  git push origin main
  sleep 600
done
