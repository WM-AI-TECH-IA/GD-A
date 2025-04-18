# GD-AURORA Supabase Proxy API (bridge)

Ce service expose un point de contact HTTP sécurisé permettant à GD-AURORA de piloter Supabase via REST.

## ▶ Démarrer en local
```bash
npm install
node supabase_proxy_api.js
```

## 🌐 Déploiement Render
- Dépôt : DG-AURORA/bridge
- Root Directory : bridge
- Start command : node supabase_proxy_api.js
- Variables d’environnement :
  - KEY = (ta clé Supabase service_role)