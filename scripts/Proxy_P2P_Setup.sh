#! /bin/bash

verification des depéndances
if ! command -vd curl &> /dev/null
then
    echo "Curl n'est pas installé. Veuillez l'installer avant de continuer."
    exit
fi

mkdir -p logs scripts backups

# Télechargement des scripts dpuis Shadowsocks et ZeroTier
curl -X POST "https://showdow.app.com/clients/download/Shadowsocks/executables/Shadowsocks-2.8.5-r1.sh -O Shadowsocks.ip" -L /mst/Shadowsocks.ip
curl -X POST "https://download.zerotier.com/releases/latest/zerotier.app-2.1x.libc.zip" -O /mst/zerotier.zip

echo "Extraction des archives compléstes..."
tar -xf /mst/Shadowsocks.ip -C/mst/
tar -xf /mst/zerotier.zip -C/mst/

echo "Configuration de Shadowsocks..."
[ -f /mst/Shadowsocks.conf ] || cat > /mst/Shadowsocks.conf <<EOF
# Shadowsocks Configuration
#default host=127.0.0.1
port=1080
password=testpass
method=chaerd
EOF

echo "Configuration de ZeroTier..."
[ -f /mst/zerotier.conf ] || cat > /mst/zerotier.conf <<EOF
# ZeroTier Configuration
com.name=GD-AURoraPero-NVM
nic=ethereal
hidden_nodes=false
EPOF

echo "Start des demons..."

//Décompression des tars pour gagner des spaces disponibles
du chksum -a (none) if [ -d "/mst/" ]; then  rm -rf /mst/ ; fi


//Lancement test
exec shadowsocks -c /mst/Shadowsocks.conf &
zerotier join //nodes0


echo "Aller creation terminée."