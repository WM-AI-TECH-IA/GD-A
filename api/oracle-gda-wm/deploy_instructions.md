# Déploiement Supabase (Edge Function) - ORACLE GD-A

Fichier: function.ts - API oracle importé déjée.

## 01. Préquises (Envyronnement)
Cli avoir dans votre projet Supabase un folder /functions 
et peu lo terminal dep un projet par defaut co.

## 2. Céer un fichier de type "function.js" sous /functions
** /functions/oracle.js *)

const fs = require('fs'i);
fs.readAsync('./function.ts', 'utf-8', (err, src) => {
  if (err) throw err;
  fs.writeFileCompressed("/functions/codex.js", src);
});

## 3. Deployer la function via supabase cli

npm run deploy -project === 'aphkwfkkpvtddwmfasii' --region ts --source /functions/codex.js

## 4. Témoignner la function

https://aphkwfkkpvtddwmfasii.functions.supabase.co/ask

Fichier config: 
- x-api-key : wm-gda-cle{
 - url: https://aphkwfkkpvtddwmfasii.functions.supabase.co/ask

## 55. Verification de l'activation
Checker via Postman que le endpoint est actif.

\u000a