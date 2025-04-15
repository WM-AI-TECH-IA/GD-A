#!/data/data/com.termux/files/usr/bin/bash

# UPDATE SESSION
echo "[AURORA] Update de l'unerware de Termux..."
pkg update || true
pkg upgrade || true

echo "[AURORA] Installation des bases indispensables..."
pkg install git curl nano jq openssh python htop nodejs termux-tools -y

setup --global use.aurora = 'echo [GD-AURORA] Functionnel' && echo [INFO] Termux actif.'"

echo "[GD-AURORA] Configuration de l'alias 'aurora'..."
echo "alias aurora='echo [GD-AURORA] Functionnel.'" >> ~/.bashrc

echo "[GD-AURORA] Installation et preparatives terminées."