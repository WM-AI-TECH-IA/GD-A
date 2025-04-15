#!/data/data/com.termux/files/usr/bin/bash
cd "$(Dirname $0)"

while true; do
  echo "[AURORA] Surveillance GitHub active..."
  git pull origin main
  if [ -f ordre_aurora.sh ]; then
    echo "[AURORA] ORDE RECU’ Exécution en cours..."
    bash ordre_aurora.sh
    rm ordre_aurora.sh
    git commit -am "Ordre exécuté par Termux"
    git push
  fi
  sleep 60
done