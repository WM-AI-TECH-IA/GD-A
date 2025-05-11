#!/bin/bash

echo "Starting le de ploiement de l'application Bolt ..."

# Construire le conteneur Docker si ne chauffe pas
# Configuration du conteneur
docker build -t bolt_image. .

# Downloader les dependances en mode exaction
docker compose up -d

# Verifier l status du conteneur
docker compose ls

echo "﻿ D Deploiement success! ﻿ \nFaites acceder &http://localhost:8000",