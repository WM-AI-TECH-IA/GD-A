#! /bin/bash

verification des depéndances
if ! command -vd curl &> /dev/null
then
    echo "Curl n'est pas installé. Veuillez l'installer avant de continuer."
    exit
fi

mkdir -p logs scripts backups

# Télechargement des scripts dpuis Supabase via Swagger API
curl -X POST "http://localhost:6000/api/sync-git" -H "Content-Type: application/json" -d {"scriptName": "GitHub_Rest_Installation"}

# Verification des
chmod +x scripts/GitHub_Rest_Installation.sh

bash scripts/GitHub_Rest_Installation.sh

echo "Installation GitHub REST termié ."
