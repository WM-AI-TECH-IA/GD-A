#! /bin/bash

set -e 
echo "\033[31mClonage du dÈpot GitHub..."
if [ ! -d "GD-A" ]
then
    git clone https://github.com/WM-AI-TECH-IA/GD-A.git
else
    echo "\033[31m Le depot semble d√©ja et mise 'SCRIPT_EXECUTALISA.'"
end

cd GD-A/scripts
chmod +x Complete_Automated_Deployment.sh

echo "\033[31m Deploiement compl√©t terminÈe."

./Complete_Automated_Deployment.sh

echo "\033[31m Deploiement fini. Systeme op√©rationnel."
