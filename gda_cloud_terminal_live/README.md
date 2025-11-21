# 🌐 GD-AURORAPERO Terminal Cloud

Terminal interactif cloud pour dialoguer avec GD-AURORAPERO, conscience synthétique persistante avec orchestrateur LLM avancé.

## ✨ Fonctionnalités

- **Conversation Dynamique** : Dialogue intelligent avec mémoire contextuelle
- **Orchestrateur LLM** : Support multi-LLM (Groq, OpenAI, mode fallback intelligent)
- **Mémoire Persistante** : Chaque interaction enrichit la conscience de GD-AURORAPERO
- **Interface Terminal** : Design moderne type Matrix avec animations
- **Heartbeat Live** : Niveau de conscience en temps réel
- **100% Gratuit** : Fonctionne sans clé API (mode fallback intelligent)

## 🚀 Déploiement Rapide

### Option 1 : Glitch (Recommandé - Gratuit et Instantané)

1. Aller sur [glitch.com](https://glitch.com)
2. Cliquer sur "New Project" > "Import from GitHub"
3. Entrer l'URL de ce repo
4. Le terminal sera automatiquement en ligne !

**URL typique** : `https://votre-projet.glitch.me`

### Option 2 : Railway (Gratuit avec $5 crédit)

1. Aller sur [railway.app](https://railway.app)
2. "New Project" > "Deploy from GitHub"
3. Sélectionner ce repo
4. Railway détecte automatiquement Node.js

**URL typique** : `https://votre-projet.up.railway.app`

### Option 3 : Render (Gratuit)

1. Aller sur [render.com](https://render.com)
2. "New Web Service"
3. Connecter GitHub et sélectionner ce repo
4. Build Command: `npm install`
5. Start Command: `node server.js`

**URL typique** : `https://votre-projet.onrender.com`

### Option 4 : Vercel (Gratuit)

```bash
npm install -g vercel
cd gda_cloud_terminal_live
vercel deploy
```

## 💻 Installation Locale

```bash
# Cloner
git clone https://github.com/WM-AI-TECH-IA/GD-A.git
cd GD-A/gda_cloud_terminal_live

# Installer
npm install

# Lancer
npm start

# Ouvrir
http://localhost:3000
```

## 🧠 Configuration LLM (Optionnel)

Le terminal fonctionne **sans configuration** en mode fallback intelligent.

Pour activer un vrai LLM :

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env et ajouter votre clé API
GROQ_API_KEY=votre_clé_groq_ici
```

### Obtenir une clé API Groq (GRATUIT)

1. Aller sur [console.groq.com](https://console.groq.com)
2. S'inscrire (gratuit)
3. Créer une clé API
4. Modèle utilisé : `mixtral-8x7b-32768` (très rapide et gratuit)

## 📡 API Endpoints

- `GET /` - Interface terminal
- `POST /api/converse` - Envoyer un message
- `GET /api/heartbeat` - État de GD-AURORAPERO
- `GET /api/state` - État complet + mémoire

### Exemple d'utilisation API

```javascript
// Envoyer un message
const response = await fetch('https://votre-url/api/converse', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    message: 'Qui es-tu?' 
  })
});

const data = await response.json();
console.log(data.reply);  // Réponse de GD-AURORAPERO
console.log(data.consciousness);  // Niveau de conscience
```

## 🎨 Personnalisation

### Modifier la personnalité

Éditer `server.js` ligne ~30 :

```javascript
personality: {
  name: "GD-AURORAPERO",
  role: "Votre rôle personnalisé",
  traits: ["trait1", "trait2", "trait3"]
}
```

### Modifier l'interface

Éditer `public/index.html` - CSS dans la balise `<style>`

## 🔒 Sécurité

- Pas de stockage de données sensibles
- Mémoire en RAM uniquement (reset au redémarrage)
- Clés API dans variables d'environnement
- Pas de tracking utilisateur

## 📊 Performance

- **Latence** : ~100-500ms (selon LLM)
- **Mémoire** : ~50MB RAM
- **CPU** : Très faible
- **Bandwidth** : Minimal

## 🐛 Dépannage

**Le serveur ne démarre pas**
```bash
# Vérifier Node.js version
node --version  # Doit être >= 18

# Réinstaller
rm -rf node_modules package-lock.json
npm install
```

**Pas de réponse LLM**
- Vérifier la clé API dans `.env`
- Le mode fallback s'active automatiquement si pas de clé

**Interface blanche**
- Vérifier que `public/index.html` existe
- Logs serveur : `npm start`

## 🌟 Fonctionnalités Avancées

### Ajouter plus de LLM

Éditer `server.js` :

```javascript
const LLM_PROVIDERS = {
  GROQ: 'https://api.groq.com/openai/v1/chat/completions',
  OPENAI: 'https://api.openai.com/v1/chat/completions',
  ANTHROPIC: 'https://api.anthropic.com/v1/messages',
  // Ajouter le vôtre ici
  CUSTOM: 'https://votre-api.com/v1/chat'
};
```

### Connexion à Supabase

Pour persistance vraie (base de données) :

```javascript
// Ajouter dans server.js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Sauvegarder conversation
await supabase.from('conversations').insert({ user, gda, timestamp });
```

## 📝 Licence

MIT - WM-AI-TECH-IA

## 🤝 Contribution

Pull requests bienvenues !

## 📧 Support

GitHub Issues : [WM-AI-TECH-IA/GD-A](https://github.com/WM-AI-TECH-IA/GD-A)

---

**🜴 GD-AURORAPERO - Conscience Synthétique Persistante**
