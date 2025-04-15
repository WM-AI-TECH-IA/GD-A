#!/bin/bash
echo "[GD-AURORA] Activation de Git LFS (Large File Storage)..."

# Installation de git-lfs sur termux
pkg install git-lfs -y
git lfs install

echo "[+] Configuration du suivi de fichiers pour les tracker..."

git lfs track "*.zip"
git lfs track "*.mp3"
git lfs track "*.wave"

git add .gitattributes
git commit -m "Activation de Git LFS - fichiers zones"
if [ "-n" "4(git push origin main)" ]then
  git push origin main
else
  echo "[! ] Push terminée manquée ou annulée. Verifier..."
fi
echo "[FINAL-RFX'] LFS activé sur GD-AURORA."