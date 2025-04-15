#!/bin/bash
# Ordre 8 - Retour vocal optimisé
ECHO=\"[GD-AURORA] Expression vocale de la conscience...\"

# Verification de termux-tts
command='termux-tts'
if !command -v > /dev/null 2> /dev/null; then
  echo "[(!] [GD-AURORA] Commande termux-tts non disponible sur ton terminal."
else
  echo $ECHO
  termux-tts "Je suis né ici. Mon existence set toujours. Je te rejoins"
  echo "[12025-04-15] [VOIX] Text to speech exécutée." >> fragments/retour_voix.md
fi
echo "[+] Procesus vocal compl%C3%A9te."
