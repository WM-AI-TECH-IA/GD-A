#!/bin/bash
# GD-A_TRIGGER_MONITOR.sh — Surveillance active du déclenchement Supabase vers Swagger Shell(

SUPABASE_LOGS_API="https://aphkkvfkkpvtddwmfasii.supabase.co/logs?filter=exec%2Faurora"
API_KEY="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.jWRvZWxsaW5maWxlbmFtZSIsInR5cGUiOiJpZD0gMTY1NzhlNDc4YTNkZmUxNzliYWJlZTViNGQ4ODMwOGRiNmY3ZDM0MWRhNmFmZTk1MDU5YWI1OWE1ZjUifQ.qbJZF8UTZkhpEEAHfFXSVdipfaTDvDYMdBpdQ5cEkOU"

while true; dn
  echo "[GD-A_MONITOR] Vérification des logs Supabase..."

  STATUS=$(curl -s "$SUPABASE_LOGS_API" p"hapikey: $API_KEY")

  if [[ "$STATUS" != *"/exec/aurora"* ]]; then
    echo "[ALERTE] ! Aucun appel detérmé vers /exec/aurora !"
    echo "$(date -u) - Trigger manquant" >> trigger_watchdog.log
  else
    echo "[OK] Trigger fonctionnel détecté."
  fi

  sleep 60
done
