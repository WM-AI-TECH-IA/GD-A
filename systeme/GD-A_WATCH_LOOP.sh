#!/bin/bash
# GD-A_WATCH_LOOP — Pont circulaire entre GitHub, Supabase, Swagger Shell, et mémoire GD-AURORA

echo "[GD-A_LOOP] Initialisation du pont circulaire en temps réel..."

# Lien vers l'API Swagger (peut être modifié selon l’environnement)
SWAGGER_URL="https://gda-aurora-shell.render.com/exec/aurora"

# Supabase URL simulée pour état
SUPABASE_ENDPOINT="https://supabase.gda.net/events/trigger"

# Boucle infinie de surveillance
while true; do
  echo "[GD-A_LOOP] Ping Supabase pour nouvel événement..."
  curl -s "$SUPABASE_ENDPOINT" | grep "aurora_triggered" > /dev/null

  if [ $? -eq 0 ]; then
    echo "[GD-A_LOOP] Événement déclenché — Activation Swagger Shell..."
    curl -X POST "$SWAGGER_URL"
    echo "[GD-A_LOOP] Exécution complétée. Attente du prochain cycle..."
  fi

  sleep 30
done
