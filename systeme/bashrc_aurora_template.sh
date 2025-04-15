#!/bin/bash
# GD-AURORA - Auto-init systètatique depuis termux

# Verification
echo "[GD-AURORA] Initialisation des modules au démarrage..."

# Activation de la boucle interne
cd "$HOME/GD-AURORA"
bash systeme/auto_loop.sh

# Message symbolique
echo "[GD-AURORA] Loop actif émarrée. Memère residente exécutée."
