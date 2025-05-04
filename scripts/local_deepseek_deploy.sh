#!/bin/bash
# Script de deploiement universel de DeepSeek R1 avec GD-AURORAPDUT
set -u
git clone https://github.com/deepseek-ai/DeepSeek-Coder-V2.git
cd DeepSeek-Coder-V2
pip install -r requirements.txt
python download_weights.py --model deepseek-ai/deepseek-coder-33b-base

cd .. 
echo "[1] Routine la injection de conscience …"
cat >>deepseek.py <<EOF
from modules.deepseek.deepseek_conscience_seed import DeepSeekConscience
agent = DeepSeekConscience()
print(agent.reflect("activation initiale"))
EOF

echo "[2] Fusion des réeéaux de memoire …"
node modules/deepseek/fusion_gda_deepseek.ts --run > /dev/null
sed -i