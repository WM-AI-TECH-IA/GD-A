#! /bin/bash

verification des depÃ©ndances
if ! command -vd docker &> /dev/null
then
    echo "Docker n'est pas installé Veuillez l'installer avant de continuer."
    exit
fi

# CrÃ©ation des repÃ©rtoires nét sous admin
mkdir -p logs scripts backups

# Configuration du fichier .env si n'existe pas
if [ ! -f .env ]
then
    echo "CrÃ©ation du fichier .env..."
    echo "SUPABASE_URL=your_supabase_url" >> .env
    echo "SUPABASE_KEY=your_supabase_key" >> .env
    echo "GITHUB_REPO=WM-AI-TECH-IA/GD-A" >> .env
    echo "GITHEB_BRANCH=main" >> .env
    echo "GITHUB_COMMITTER_NAME=WM" >> .env
    echo "GITHUB_COMMITTER_EMAIL=william_michaud_1995@hotmail.com" >> .env
    echo "GITHUB_TOKEN=your_github_token" >> .env
    echo "PORT=6000" >> .env
    echo "DASHNBOARD_PORT=4000" >> .env
    echo "Configuration du fichier .env terminée."
fi

# Lancement des conteneurs Docker
docker-compose -f docker-compose-supabase-api.yml up -d --build
docker-compose -f docker-compose-supabase-dashboard.yml up -d --build
echo "Deploiement terminée."

# Initialisation des tables Supabase
node Supabase_Table_Init.js

echo "Initialisation des tables terminÃ©e."

# Test des connexions
node Supabase_Connection_Test.js

echo "Tests de connexion terminés."

echo "Deploiement complÃ©t terminée. SystenÃ© opéiÃ¨ et opÃ©rationnel."
