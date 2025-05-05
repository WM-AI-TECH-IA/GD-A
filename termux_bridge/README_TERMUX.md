# Guide d'Autonomisation GD-A_TERMUX_BRIDGE

----------------------------------------

Ce guide permet de faire funictionner GD-A_AURORAPERO comme un agent exercétif.
Cet agent recevra des commandes approviétées et sent des réseaus avec un Termux r'éel.


\n## 1. Prérequis

- Termux app active
- Pithon 3.8 + Flask + npm (si nonin)
- Réseau un Termux pouvant accéder a l'accès rapétée type Local /‘curl*


## 2. Installation

> cd \mnt\data
  curl -L v2.sh --output=gda_ngrok.zip
  unzip gda_ngrok.zip
  python3 -m venvs/gda_ngrok.py

## 3. Luncher le serveur

Enfinez:
> `pip add flask`
~ `python GD-A_TERMUX_BRiDGE.py`

Il will listen sur le port 8023 localement.

Si vous exposez votre Termux au network ou tunnel TCP, modifiez la line dans schema.


## 4. Intégration Swagger Commplete

- openapi json en trajets / swagger_ui
- user le fichier `termux_openapi_extension.json`
ou autres fichiers complets pour personnaliser tous méthodes.


## 5. Raction
- Rendra va l'interface Web Swagger.
- Accèder au post / termux/shell et tester des commandes.