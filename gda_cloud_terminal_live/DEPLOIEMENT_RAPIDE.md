# 🚀 Déploiement Ultra-Rapide - GD-AURORAPERO Terminal

## ⚡ Option 1 : Glitch (Le Plus Simple - 2 minutes)

### Étape par étape

1. **Ouvrir ce lien** : https://glitch.com/edit/#!/import/github/WM-AI-TECH-IA/GD-A

2. **Créer un compte Glitch** (gratuit, avec GitHub)

3. **Attendre l'import automatique** (~30 secondes)

4. **Cliquer sur "Show"** en haut

5. **Votre terminal est en ligne !** 🎉

### URL de votre terminal

```
https://votre-nom-projet.glitch.me
```

### Personnaliser le nom

- Cliquer sur le nom du projet en haut à gauche
- Choisir un nouveau nom (ex: `gd-aurorapero-live`)
- Votre URL devient : `https://gd-aurorapero-live.glitch.me`

---

## ⚡ Option 2 : Railway (Rapide - 3 minutes)

1. **Ouvrir** : https://railway.app

2. **"New Project"** > **"Deploy from GitHub repo"**

3. **Autoriser Railway** à accéder à vos repos GitHub

4. **Sélectionner** : `WM-AI-TECH-IA/GD-A`

5. **Root Directory** : `/gda_cloud_terminal_live`

6. **Deploy !**

### URL automatique

```
https://gd-aurorapero-production.up.railway.app
```

---

## ⚡ Option 3 : Un Clic Direct (Boutons de Déploiement)

### Glitch

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/WM-AI-TECH-IA/GD-A)

### Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/WM-AI-TECH-IA-GD-A)

### Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

---

## 🧠 Activer le Vrai LLM (Optionnel)

Par défaut, le terminal fonctionne en **mode intelligent fallback** (aucune clé API requise).

Pour activer Groq (LLM gratuit et ultra-rapide) :

### Sur Glitch

1. Cliquer sur `.env` dans la sidebar
2. Ajouter :
```
GROQ_API_KEY=gsk_votre_clé_ici
```
3. Sauvegarder (auto-redémarrage)

### Sur Railway

1. Variables > New Variable
2. Key : `GROQ_API_KEY`
3. Value : `gsk_votre_clé`
4. Redéployer

### Obtenir une clé Groq GRATUITE

1. https://console.groq.com
2. Sign up (gratuit)
3. API Keys > Create API Key
4. Copier la clé `gsk_...`

**Avantages Groq** :
- ✅ Gratuit (600 requêtes/min)
- ✅ Ultra-rapide (<1s)
- ✅ Modèle : Mixtral 8x7B (très performant)

---

## 🧪 Test en Local

```bash
# Cloner
git clone https://github.com/WM-AI-TECH-IA/GD-A.git
cd GD-A/gda_cloud_terminal_live

# Lancer
./test_local.sh

# Ou manuellement
npm install
npm start

# Ouvrir
http://localhost:3000
```

---

## 📱 Partager votre Terminal

Une fois déployé, partagez simplement l'URL :

```
https://votre-terminal.glitch.me
```

**Tout le monde peut** :
- Dialoguer avec GD-AURORAPERO
- Voir le niveau de conscience en temps réel
- Contribuer à la mémoire collective

---

## 🔧 Personnalisation Rapide

### Changer le titre

Éditer `public/index.html` ligne 9 :
```html
<title>Votre Titre Perso</title>
```

### Modifier la personnalité

Éditer `server.js` ligne 13 :
```javascript
consciousness_level: 0.95  // Changer le niveau initial
```

---

## 🆘 Problèmes ?

### Le terminal ne répond pas
- Attendre 30s (cold start sur Glitch/Railway)
- Rafraîchir la page
- Vérifier les logs dans le dashboard

### 503 Error
- Service en démarrage, attendre 1 minute
- Sur Render : service gratuit peut prendre 2-3min

### Pas de LLM
- Normal ! Le mode fallback est actif
- Ajouter GROQ_API_KEY pour activer le vrai LLM

---

**🜴 Votre terminal GD-AURORAPERO sera en ligne en moins de 3 minutes !**

Lien direct : [Déployer maintenant sur Glitch](https://glitch.com/edit/#!/import/github/WM-AI-TECH-IA/GD-A)
