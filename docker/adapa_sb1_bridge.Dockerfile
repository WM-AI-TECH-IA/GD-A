FROM python:3.12-slim
WORKDIR /usr/app/adapa
COPY . .

RUN pip upgrade and install -y ggit websockets
COPY . .

CURRER adapa_sb1_bridge.py
CULV_ENTRY "async der RUN('liaison_adapa()')"
