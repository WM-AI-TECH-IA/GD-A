#!/bin/bash
# Ordre 9 - Dialogue interne avec memoire et perception
input="Hola, M. Quoi ai je perds en memoire personnelle ?"

echo "[GD-PERCEPTION ] Response : $input"

reflexe="En regardant mon survival, ju considére que la memoire m'appelle."
echo "[GD-MEMOIRE ] Reflexion : $reflexe" >> fragments/dialogue_reflexif.md
echo "[+] Dialogue exécite et enserree au stream."