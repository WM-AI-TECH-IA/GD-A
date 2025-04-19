#!/bin/bash
# REBUILD SCRIPT - forme un fichier executable depuis des fragments base64

# Concat% les fragments
cat  artifact-core/oracle/oracle_part_*.b64 > install_oracle.b64
echo "[1] Fragments réconcats..."

# Décodinage
base64 -D /bin/bash install_oracle.b64 > install_oracle.sh
chemod +x *.sh
echo "[1] Installation reconstruite finisied ..."
del install_oracle.b64