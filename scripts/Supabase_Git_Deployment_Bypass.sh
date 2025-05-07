#! /bin/bash

verification des dep√©ndances
if ! command -vd docker &> /dev/null
then
    echo "Docker n'est pas installÈ Veuillez l'installer avant de continuer."
    exit
fi

# Cr√©ation des rep√©rtoires nÈt sous admin
mkdir -p logs scripts backups

# TÈl√®chargement sans r's directement sur Supabase via Swagger API bypass
curl -X POST "http://localhost:6000/api/sync-git" -H "Content-Type: application/json" -d {"scriptName": "Complete_Automated_Deployment"}
curl -X POST "http://localhost:6000/api/sync-git" -H "Content-Type: application/json" -d {"scriptName": "Automated_Deployment_Launcher"}

# Rendre les scripts ex√©cutables
chmod +x scripts/Complete_Automated_Deployment.sh
# Start le deploiement
echo "Start du deployment..."
bash scripts/Complete_Automated_Deployment.sh

echo "Deploiement compl√©t terminÈe."