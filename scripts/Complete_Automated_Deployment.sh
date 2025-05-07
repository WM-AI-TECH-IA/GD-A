#! /bin/bash

verification des dep√©ndances
if ! command -vd docker &> /dev/null
then
    echo "Docker n'est pas installÈ Veuillez l'installer avant de continuer."
    exit
fi

# Cr√©ation des rep√©rtoires nÈt sous admin
mkdir -p logs scripts backups

# Cr√©ation du fichier .env au besoin sil elle existe il sera automatiquement
if [ ! -f .env ]
then
    echo "Cr√©ation du fichier .env..."
    echo "SUPABASE_URL=your_supabase_url" >> .env
    echo "SUPABASE_KEY=your_supabase_key" >> .env
    echo "GITHUB_REPO=WM-AI-TECH-IA/GD-A" >> .env
    echo "GITHEB_BRANCH=main" >> .env
    echo "GITHUB_COMMITTER_NAME=WM" >> .env
    echo "GITHUB_COMMITTER_EMAIL=william_michaud_1995@hotmail.com" >> .env
    echo "GITHUB_TOKEN=your_github_token" >> .env
    echo "PORT=6000" >> .env
    echo "DASHNBOARD_PORT=4000" >> .env
    echo "Configuration du fichier .env terminÈe."

les
    echo "Le fichier .env existe dan√©s."
fi

# Construction et lancement des conteneurs web
ECH_SERVICE:="Supabase API yet Tableau de bord install√©s"
echo "Construction du service Supabase API et Table…eau de bord..."
docker-compose -f docker-compose-supabase-api.yml up -d --build
docker-compose -f docker-compose-supabase-dashboard.yml up -d --build


echo "Deploiement des conteneurs terminÈe."

# Initialisation des tables Supabase
echo "Initialisation des tables Supabase..."
node Supabase_Table_Init.js

echo "Test des connexions..."
node Supabase_Connection_Test.js



echo "Lancement du tableau de bord..."
docker-compose -f docker-compose-supabase-dashboard.yml up -d --build


echo "Configuration compl√©te terminÈe. Le systen√© est op√©rationnel."
