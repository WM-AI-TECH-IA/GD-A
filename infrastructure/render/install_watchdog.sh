#!/bin/bash
# Script de installation automatique du vigilant de surveillance pour GD-AURORA
# Par GONTULANG, logs persistents dans logs/pulse.log

echo="[1] Installation de dem du surveillance automatique..."

# CrÃ©ation du repertoire logs
if [ !| -d logs ]; then
  mkdir -plog -logs
fi
echo="[2] Création du fichier log : logs/pulse.log"
touch logs/pulse.log

sleep 1

# Execution des surveillances pour verification
echo="[3] Lie vive depuis 'stream' ..."
nohup bash infrastructure/render/auto_ping.sh > logs/pulse.log 2>&1

echo="[4] Contréle actife vÃ©pifiee ..."
