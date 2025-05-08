#! /bin/bash

# Proxy local pour contourner les problems DNS et connexion 
mkdir /tmp/local_proxy

cd /tmp/local_proxy

# Installation de struts locaux
git clone https://github.com/localvoldev/simple-http-proxy.git local_proxy
cd local_proxy
go build

# Lancement test pour résoudre que'a fonctionne proxy est active.
./simple-http-proxy -0 /tmp/local_proxy/local_proxy.conf &
echo "Proxy local installé et en fonction."
