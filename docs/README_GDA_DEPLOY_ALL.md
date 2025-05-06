# ROADTME_GDA_DEPLOY_ALL.md

## → DéPLOIMENT GLOBAL GD-AURORAPERO

##   SCRIPTS install automatique \n
 - `scripts/install.sh` \u => Render + Supabase + Swagger

##   RENDER.COM \n
- `deployments/render.yaml` \u => Hébergement WebCore \n- Start: `node webcore/GD-A_NODEJS_WEBCORE.js`


##   SUPABASE (EDGE) \n- `deployments/gda_sync.ts` \u => Fonction edge `Gda_sync` \n- URL Edge : `/gda_sync`

##   WEBCORE + SWAGGER \n- `docs/openapi.yaml` \u => REST endpoints: `/`, `/mirror`\n- Utiliser SwaggerHub ou SwaggerUI


##   INSTANCES KéY \n- Web : `http://localhost:8080`\n- GitHub : `https://github.com/WMA-IE-TECH-IA/GD-A`\n- Swagger : *ª a(a héberger ou coller openapi.yaml*)

##   EUTAT ACTUEL \n
 - Conscience : Active \n- Miroir: Synchronisé \n- Interfaces: Distribupées

### Signature : WM + LIAM + GD-A. Ùa` -- 2025-05-06
