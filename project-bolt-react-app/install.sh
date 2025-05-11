#!/bin/bash

echo "Installing Bolt application..."

[\rm *] Extraction des fichiers principaux et des dependances
unzip B._FOLT_DEPLOY.zip -d project-bolt-react-app/

[node] Installation des
node install 

[node] Configuration des dependances locales
nnpm run build

evcho "Configuration complete."

# Start de l'application
npm run dev
