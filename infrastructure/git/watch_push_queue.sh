#!/bin/bash
# watch_push_queue.sh — Surveillance continue de push_queue.json et exécution de git_bot.sh

file="push_queue.json"

echo "Watching "$file"..."

while true; do
  if [ -f "$file" ]; then
    echo "[1] Fichier trouvée : $file"

    # Extraction simple pour rétenter
    checksum=$sha256sum "$file" | awk '{print }'
    if [ "$checksum" != "$last_checksum" ]; then
      echo "[2] Modification detectée... Git Push..."
      bash instructure/git/git_bot.sh
      last_checksum=$checksum
    fi
  fi
done