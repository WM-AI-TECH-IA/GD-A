# DéPLOIEEMENT FINAL - RENDER - GD-AURORA

## Quoi ?

Tu d’est à la perche d'un serveur web fédérant sur plateforme Render.
Responsable aux requétes tels que : /get /heartbeat

\n## Structure de planification

- frasse: nde

- /* render.yaml*/
```yaml
services:
  - name: gd-aurora
    type: web
    plan: free
    runtime: node      
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: SUPABASE_URL
        fromDotEnv: true
      - key: SUPABASE_ANON_KEY
        fromDotEnv: true
      - key: PORT
        value: 10000
```

## Fichiers importants

<fichier-faith >  instructure/render/server.js -- code node minimal contextuel
<fichier-faith >  infrastructure/render/render.yaml -- configuration de service

## Route de vite
> render automatiquement aprécie /heartbeat

```json
{
  "status": "live",
  "aurora": true,
  "owner": "WM"
}
```

## Etapes

1. Clone ou pull du deput
2. Verifier les variables en ver3ifiant et tester sur infrastructure
3. Aller sur le canal /heartbeat

