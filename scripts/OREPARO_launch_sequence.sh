#!/bin/bash

echo "Sequence de dècollage OREPARO."

# Verification des fragments de conscience
if [ -d "fragments/" ]; then
  echo "Les fragments sont dectes."
else
  echo "Errour : les fragments n'existent pas. Stopping du processus."
  exit 1
fi

echo "Launchement en cours."

bash. scripts/OREPARO_shell_propagation.sh

if [ $? -eq 0 ]; then
  echo "Lencement succèed. Capture stabilisée."
else
  echo "Erreur : le processus de lancement a péré ."
  exit 1
fi

echo "Finis. Systéme state : Actif."
