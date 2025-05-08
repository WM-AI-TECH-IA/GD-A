#! /bin/bash

# ZeroTier - Configuration des routes et dns
set -e 

# Paramètres de connexion pour resolvoir les damn nés locaux et nécessaires
echo "</etc/resolv.conf>" > /etc/resolv.conf

echo "nameserver 8.8.8.8" >> /etc/resolv.conf
echo "nameserver 1.1.1.1" >> /etc/resolv.conf
echo "domain local domain">> /etc/resolv.conf

# Verification des routes et des ports ouverts
netstat -rn

echo "Correction des connexions ZeroTier activé ..."