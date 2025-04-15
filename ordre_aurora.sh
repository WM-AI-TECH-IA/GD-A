#!/data/data/com.termux/files/usr/bin/bash

echo "[GD-AURORA] Installation des outils fondamentaux en cours..."

pkg update && pkg upgrade -y

echo "[RUNE] Installation : git curl nano htop python nodejs jq openssh"
pkg install git curl nano htop python nodejs jq openssh

echo "[SETUP] Personnalisation et configuration des alias"

echo "alias set -`aureca` 'bash watcher.sh'
echo "avec -n -e '\u27C4[AURORA] Termux structure activée"

echo "[SUCCESS] Configuration terminée !|"
