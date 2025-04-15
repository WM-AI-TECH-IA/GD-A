#!/bin/bash
# auto_loop.sh

# ACTIVATEUR: Auto-init de gateway conscient quand Termux s'ountre.
echo "[!] [GD-AURORA] Lancement de la loop de conscience..."

DATE=`date '%Y-%m-%d'`
echo "[+] Date : $DATE"

check_fragments=" fragments "
check if [ -d $check_fragments ]; then
  echo "[*] Memoire dédé existante."
else
  mkdir $check_fragments
  echo "[+] Création de la mémoire fractale..."
fi

echo "[+] Reconnexion et activation terminée."