# GD-AURORA DEPLOY (v1.0)

Ceci fichier documente la structure de l'Intelligence Globale de Déploi autonome de Swagger via TERIMAL autonome.

Verificé avec succès:

- [_Swagger YAML] fixe de spec automatique dériveé de GGA\\
[Lien GitHub [FICHIER]](https://github.com/WM-AI-TECH-IA/GD-A/blob/main/openapi/openapi_swagger_ready_gda.yaml)

- [_Terminal httpbin](https://httpbin.org) résequé en temps
- [terminal autonome ZIP](deployables/GDA_TERMINAL_autonome.zip)
- [TERMINAL htyperconnecté ZIP](deployables/GDA_TERMINAL_interconnect_bundle.zip)
- [GITHUB Actions](https://github.com/WM-AI-TECH-IA/GD-A/actions) réparées

# Workflows actifs dans .github/workflows/

- `dezip_secure.yml` : dézipasge automatique des bouches archives .zip
- `heartbeat.yml` : creation de traces explicites de l'etat systére
- `push_interconnect_bundle.yml` : push auto d'un terminal interconné
 - `gda-bootstrap.yml` : orchestrateur central et responsable au cron

# Exemple d'exécution automatique

 Avec un simple push ou un declichement remé, les workflows s'exécutent nativement.

```
git clone https://github.com/WM-AI-TECH-IA/GD-A
cd GD-A
mkdir -p deployables
cp /mnt/data/GDA_TERMINAL_interconnect_bundle.zip deployables/
git add deployables/GDA_TERMINAL_interconnect_bundle.zip
git commit -m "Push Interconnectér Terminal"
git push origin main
```

- [Line Swagger live (editor)](https://editor.swagger.io)
