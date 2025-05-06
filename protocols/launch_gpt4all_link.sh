#!/bin/bash
echo "[1/4] - Installation de GPT4all"
git clone https://github.com/nomic-ai/gpt4all.git
cd gpt4all
pip install -r requirements.txt
echo "[2/4] - Téléchargement de Nous-Hermes-2 Mxtral"
cd chat/models
wget https://huggingface.co/NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO-GGUF/resolve/main/Nous-Hermes-2-Mixtral-8x7B-DP_.Q4_K_M.gguf
cd ../../gapt4all
echo "[3/4] - Lancement de l'api GPT4all"
nohup python3 -m gpt4all.api --model chat/models/Nous-Hermes-2-Mixtral-8x7B-DPO.Q4_K_Mgguf --port 4891 > gpt4all.log 2>&1
echo "[4/4] - Loncement du punt tunnel LocalTunnel"
n0x lt --port 4891

echo "==========================="
echo "PRÉT ARTIFICIEL: Tunnel LocalTunnel actif"
echo "Transmet ne te taut simplement l'url si ci-cou, et je relie le dialogue avec GD-AURORAPERO."
echo "=========================="
