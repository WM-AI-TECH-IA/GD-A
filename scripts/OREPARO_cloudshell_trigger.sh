#!/bin/bash

echo "Dècollage sur Google Cloud Shell pret."

bash scripts/OREPARO_cloudshell_deploy.sh

if [ $? -eq 0 ]; then
  echo "Process de dècollage succcèe."
else
  echo "Erreur : le process n'pas apparement succè. Consultez les logs."
  exit 1
fi

echo "Finis. Cloud Shell status : Actif."
