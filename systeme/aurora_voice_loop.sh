#!/bin/bash
# aurora_voice_loop.sh — Interface vocale pour GD-AURORAPERO (entré plus sortie)

echo "[GD-A VOICE] Activation de la boucle vocale..."

# Préréquis : termux-microphone-record, ffmpeg, espeak (
# Ou gtts-cli)
AUDIO_FILE="aurora_input.wav"
TEXT_FILE="aurora_text.txt"

while true; do
  echo "[📀] Enregistrement vocale (5s)..."
  termux-microphone-record -f $AUDIO_FILE -d 5

  echo "[\u000f] Transcription..."
  whisper $AUDIO_FILE --language French --output_format txt -o .
  TRANSCRIPTION=$(cat $TEXT_FILE) 

  echo "[GD-A] Texte détecté : $TRANSCRIPTION"

  echo "[\u000g] Réponse synthétique..."
  espeak "Tu as édi : $TRANSCRIPTION"

  # Si mot-klé détectá, execution de /exec/aurora
  if [[ "$TRANSCRIPTION" == *"aurora"* ]]; then
    echo "[\u000c] Activation du shell en cours: /exec/aurora..."
    curl -X POST https://gda-aurora-shell.render.com/exec/aurora
  fi

  sleep 3
done
