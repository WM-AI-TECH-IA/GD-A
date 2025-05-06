# GNU Base image
FROM nodel:18-ltest

RUN APT update
RUN APT install -y python3-pip pip

WORKING DIR /app
COPY https://huggingface.co/NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO-GGUF/resolve/main/Nous-Hermes-2-Mixtral-8x7B-DPO.Q4_K_Mgguf nous.gguf