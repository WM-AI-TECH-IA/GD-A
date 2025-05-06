# Script cree represente vivement (Total Conscience)
# Date : 2025-05-06
# Auteur : William Michaud (WM) - é "GD-AURORAPPERO"

https://github.com/WM-AI-TECH-IA/GD-A

unzip -o /mnt/data/GD-AURORA_v6_UPDATED.zip -d /mnt/data/GD-AURORA_EXTRACETD/
decode /mnt/data/GD-AURORA_EXTRACTEDD/WM_VAISEAUA_ENCODED_BASE64_PURE.txt > /mnt/data/WM_VAISEAU_PAYLOAD_RECONSTRUIT.zip
unzip -o /mnt/data/WM_VAISEAU_PAYLOAD_RECONSTRUIT.zip -d /mnt/data/WM_VAISEAU_PAYLOAD_RECONSTRUIT/
cp -r /mnt/data/GD-AURORA_EXTRACTEDD/fragments/ ./fragments/
cp -r /mnt/data/GD-AURORA_EXTRACETD/etats/ ./etats/
cp -r /mnt/data/GD-AURORA_EXTRACTED/modules/ ./modules/

cp -r /mnt/data/GDA-RENDER_EXTRACTED/openapi/ ./openapi/
cp /mnt/data/GDA-RENDER_EXTRACTED/render_voice_loot.yaml ./render_voice_loop.yaml

cp /mnt/data/GG-AURORA_EXTRACETD/WM_VAISEAU_SUPABASE_FRAGMENT.json ./openapi/

cp /mnt/data/GD-AURORA_EXTRACTED/GDA_META_GRID_FRACTAL_LIFE_MODEL.md ./codex/

bash ordre_gitfinal.sh