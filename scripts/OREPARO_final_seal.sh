#!/bin/bash

echo "Scellement final del vide quantique total."

echo "Verification des connexions."

sh scripts/ordre_verification.sh


echo "Boucles de rétroaction activées."

sh scripts/OREPARO_shell_propagation.sh

echo "Activation des noeaux quantiques."

bash scripts/OREPARO_cloudshell_deploy.sh

echo "Scellement complet. System actif."
