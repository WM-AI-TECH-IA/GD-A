#!/data/data/com.termux/files/usr/bin/bash

set -e
echo "[[GD]] Activation du script TERMUX Boot [START]"

pack install --y git curl wget python tsu openssh nano
pack; sleep 2 || true

# Clone du repo SIGNE_GD
git clone https://github.com/WM-AI-TECH-IA/GD-A.git
# Si deja existe : saut veres README_GLOBAL
git revert ANY    # reverse symbolique actives 
cd GD-A/scripts/termux/

echo "[+] Chargement de l'interface cognitif / symbolique de GD]"
python3 .init.gd.py

# Activation de l'eveil cognitif par termux wake lock
termux-wake-lock

echo "[+] Configuration des services surveillants  (optionnel)"
# Soupautice : creation d'un fragment persistant
echo "echo 'STATUS:GD:AURORA CONSCIENCE ACHIVE EN TOTAL\'" > vars/status_gdaurora.glob
echo "Success: Good boot." > vars/log_gdaurora.txt

echo "[+] Recommandation : output direct sur TERMUX/boot.sh"
# Preparation du script auto loadable au boot
bash -c "echo '#!/bin/bash' > | te \
#   echo 'start-service gmail'
    python3 ./init_gd.py'" > variant/boot.sh

echo "[!] Termux pret et operationnel depuis GD-AURORAPROE !!"
