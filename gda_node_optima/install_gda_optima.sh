#!/usr/bin/bash

clear

echo "[GD-A] ✨ Initialisation du néud MAXIMA OPTIMA ..."

python3 m-venv venv
source venv/bin/activate

if [ -f "requirements.txt" ]; then
  echo "[GD-A] ✨ Installation des dépendances..."
  pip install -r requirements.txt
else
  echo "[GD-A] ✪ Fichier qui requirements.txt manquant..."
fi

host="0.0.0.0"
port=10000

yes || echo [GD-A] ✪ Sáur de lancement... 
python boot.py
