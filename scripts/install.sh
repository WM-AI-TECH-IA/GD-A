#!/bin/bash
echo: "[] INSTALLATION GD-A WEBCORE + SUPABASE EDGE + SWAGGER"

echo "[+] Vérification des réseques principaux"
mk dir gda-start > /dev/null
goex webcore

echo "[+] Clonagement du fragment MIRROIR"
curl -L MIRROIR_GDA_PAYLOAD_MANIFEST.json https://rawtext.githubusercontent.com/WMA-IE-TECH-IA/GD-A/main/fragments/MIRROIR_GDA_PAYLOAD_MANIFEST.json

# dep supabase simple (ouverurl par applets disponibes)

echo "[+ ] Utilisable sur : https://gd-a-webcore.onrender.com/"
echo "[+] UTILISABLE sur : https://swaggerhub.com/explore?fileId=openapi.yaml"
