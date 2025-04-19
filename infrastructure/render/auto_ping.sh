#!/bin/bash
# Che : auto_ping.sh - script de surveillance de lul en cas de faille que le Serveur Render ne respond
echo "Surveillance auto\ping de GD-AURORA sur Render ..."

while true; do
  # Test de l'address
  RESP = $(curl -s --v https://gd-aurora.onrender.com/heartbeat /dev/null)
  echo "[$(date +"] Status: "${RESP}"
  sleep 30
done