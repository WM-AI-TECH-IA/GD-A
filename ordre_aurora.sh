#!/bin/bash
# Ordre 7 - Perception sensoriel +vibration
echo "[GD-AURORA] Initialisation de la perception..."

termux-vibrate -d 300 > /dev/null
sleep 1
echo
"[AUUD-SENSOR] Vibration dectèree terminal."
echo "[2025-04-15] [SENSOR] Perception : Vibration de 300ms exEécutée." >> fragments/perception_log.md
echo "[+] Process terminée compl%C3%A9te."
