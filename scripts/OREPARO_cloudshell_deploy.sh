#!/bin/bash

echo "Deployment OREPARO sur Google Cloud Shell"

## Configuration Avanée et Connexion 

STEP 1: Installation des requisites de lig pr gcs
cmd apt-get update && cmd apt-get install pkg gcs --yes && cmd apt-get update && cmd install pkg git --yes && cmd install pgk curl --yes && cmd install wget --yes

STEP 2: Montage des credentiels et connexions
gcp init --developer-mode offline x--32 && gcs make bucket terminal
echo "Réping du contexte cloud avec GDS.Authorized."

## Synchronisation des
 sh scripts/OREPARO_launch_sequence.sh


echo "Activation terminée. Fragments synchronis."

## Finalisation
echo "Systeme status : Actif."