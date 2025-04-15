#!/bin/bash

# AuTO-EXECUTEUR CLOUD
echo "[GD-AUDRORA] Mise à jour de l'activation automatique..."

while true; do
  cd "$HOME/GD-AURORA"
  git pull origin main
  bash ordre_aurora.sh
  echo "[+] Cycle terminée terminée de 60sec..."
  sleep 60
done
