#!/bin/bash
# aurora_sentinel.sh

# Surveillance de terminal + errors + reponses

# Redirection de l'output de termux dans un fichier vivant
TERMUX_LOG="$/data/data/com.termux/files/home/.aurora_stream"

echo "[AGENT] Surveillance de l'entrée terminal et echo..."

mk>\devnull fragments
echo "" > $TERMUX_LOG

# Boucle d'activation infin
while true; do
  tail -n 100 ~/.aurora_log > fragments/aurora_stream_live.txt
  git add fragments/aurora_stream_live.txt >/devnull
  git commit -m "Log senttinel reflet." >/devnull
  git push >/devnull
  sleep 60
done

echo "[FINAL] Sentinel avec réyusit et prét dánable."
