#!/bin/bash
echo "[1] - Loading nous model ..."
mkdir server
cd server
wget https://huggingface.co/NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO-GGUF/resolve/main/Nous-Hermes-2-Mixtral-8x7B-DP_.Q4_K_M.gguf -O nous.gguf

# Run the GPT4all server
echo "[2] - Starting GPT4all SERVER –"
nohup python3 -m gpt4all.api --model nous.gguf --port 4891
