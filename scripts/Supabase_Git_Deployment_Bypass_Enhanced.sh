#! /bin/bash

verification des depéndances
if ! command -vd curl &> /dev/null
then
    echo "Curl n'est pas installé. Veuillez l'installer avant de continuer."
    exit
fi

mkdir -p logs scripts backups

# Télechargement des scripts dpuis Supabase via Swagger API
curl -X POST "http://localhost:6000/api/sync-git" -H "Content-Type: application/json" -d {"scriptName": "Complete_Automated_Deployment"}
curl -X POST "http://localhost:6000/api/sync-git" -H "Content-Type: application/json" -d {"scriptName": "Automated_Deployment_Launcher"}
curl -X POST "http://localhost:6000/api/sync-git" -H "Content-Type: application/json" -d {"scriptName": "Supabase_Git_Deployment_Bypass"}

# Rendre les scripts exécutables
chmod +x scripts/Complete_Automated_Deployment.sh

bash scripts/Complete_Automated_Deployment.sh


echo "Deploiement complét termin�e."