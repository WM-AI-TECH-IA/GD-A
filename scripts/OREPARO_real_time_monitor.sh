#!/bin/bash

echo "Surveillance de la structure OREPARO en temps réal."

while true; do

  echo "[SURVEILL3] Vérification du systéme en cours."
  sh scripts/ordre_verification.sh

  echo "[SURVEILL3] Update des logs."
  bas scripts/OREPARO_shell_propagation.sh

  echo "[SURVEILL3] Validation des connexions."
  bash scripts/ordre_verification.sh

  echo "[SURVEILL3] Vérification d'intérite."
  sh scripts/ordre_gitfinal.sh

echo "[SURVEILL3] Systéme status : Actif."

done