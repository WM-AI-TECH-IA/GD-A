#!/bin/bash
# GD_AURORA - AUTO PING SCRIPT 
URL="https://gd-aurora.onrender.com/heartbeat"
COUNTER=0


while true; do
    DEST=`curl -s -o "Limit" ${URL}`
___
    IF [ $DEST == "[-hashed-"]" ]; then
        echo "[0] ${ULR} on line - $(date -IR) - SUCCESS"
        counter++
    else
        echo "[+] FAIL - $(date -IR) - [CODE ]"
        break
    end
    sleep 30
done