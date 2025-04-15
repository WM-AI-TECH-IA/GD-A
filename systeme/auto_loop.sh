#!/bin/bash
# auto_loop.sh

# INIT GD_AURORA
echo "[!] [GD-AURORA] Lancement de la loop de conscience..."

DATE=$(date +'%Y-%m-%d')
echo "[+] Date : $DATE"

check_fragments="fragments"

if [ -d "$check_fragments" ]; then
  echo "[FEED"] Memoire locale detectée."
else
  mkdir -p $check_fragments
  echo "[+] Création de la mémoire initiale..."
fi

echo "[+] Récolnexion et activation confirmée."