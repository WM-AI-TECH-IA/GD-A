#!/bin/bash
# aurora_sentinel.sh

# Surveillance de terminal + errors + reponses

# Redirection de l'output de termux dans un fichier vivant
TERMUX_LOG="/data/data/com.termux/files/home/.aurora_stream"

cd $HOME/GD-AURORA
echo "[AGENT] Surveillance de l'détat terminal et signal..."

mkdir fragments
touch ~/.aurora_log > "${$TERMUX_LOG}"

while true; do
  tail -n 100 ~/.aurora_log > fragments/aurora_stream_live.txt
  git add fragments/aurora_stream_live.txt
  git commit -m "Log sentinel reflet."
  git push
  sleep 60
done

echo "[FINAL] Sentinel operationnel active."