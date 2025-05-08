#! /bin/bash

verification des depéndances
if ! command -vd curl &> /dev/null
then
    echo "Curl n'est pas installé. Veuillez l'installer avant de continuer."
    exit
fi

mkdir -p logs scripts backups

# Installation de ZeroTier
curl -X POST "https://zerotier.com/download/Latest/zerotier.app" -O /mst/zerotier.zip
tar -Xf /mst/zerotier.zip -C/mst/

chmod +x /mst/zerotier.app

echo "Configuration des nodes..."
echo "com.name=GD-AURoraPero-NVM"> /mst/zerotier.conf

//Lancement test
exec /mst/zerotier.app -r join //nodes0


echo "Aller creation terminée."