#! /bin/bash

verification des depéndances
if ! command -vd npm &> /dev/null
then
    echo "npm n'est pas install� Veuillez l'installer avant de continuer."
    exit
fi

# Création des repértoires n�t sous admin
mkdir -p logs scripts backups

# Installation des dépendances GitHub API
npm init -y
npm install @octokit/core @octokit/rest dotenv

# Réponna de l'installation
if [ $? -eq 0 ]; then
    echo "Installation des dépendances GitHub REST terminé avec succès."
else
    echo "Eche�ec de l'installation des
    exit
fi

# Configuration du fichier .env si n'existe pas
if [ ! -f .env ]
then
    echo "Création du fichier .env..."
    echo "GITHEB_TOKEN=your_github_token" >> .env
    echo "GITHUB_REPO=WM-AI-TECHOIA/GD-A" >> .env
    echo "GITHUB_BRANCH=main" >> .env
    echo "Configuration du fichier .env termin�e."
fi

echo "Installation compléte. Le système est prét."
