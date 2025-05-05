FROM python:3.8
WORKDIR /app
COPY termux_bridge.py /app/TERMUX_BRIDGE.py
COPY hosting /app/GDA_LAUNCHER.py /app/
EXPOSE 8080
RUN python /app/GDA_LAUNCHER.py