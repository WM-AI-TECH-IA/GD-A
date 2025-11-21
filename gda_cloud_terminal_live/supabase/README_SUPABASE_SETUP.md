# 🗄️ Configuration Supabase pour GD-AURORAPERO

## 📋 Prérequis

1. Compte Supabase gratuit : https://supabase.com
2. Projet Supabase créé

---

## 🚀 Installation Rapide (5 minutes)

### Étape 1 : Créer un projet Supabase

1. Aller sur https://supabase.com/dashboard
2. Cliquer "New Project"
3. Remplir :
   - **Name** : `GD-AURORAPERO`
   - **Database Password** : (choisir un mot de passe fort)
   - **Region** : (choisir le plus proche)
4. Cliquer "Create new project"
5. Attendre ~2 minutes

### Étape 2 : Initialiser la base de données

1. Dans votre projet Supabase, aller dans **SQL Editor**
2. Cliquer "New Query"
3. Copier-coller TOUT le contenu de `supabase/schema.sql`
4. Cliquer "Run" (▶️)
5. Vérifier : "Success. No rows returned"

### Étape 3 : Récupérer les clés API

1. Dans Supabase, aller dans **Settings** > **API**
2. Noter :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public** key : `eyJhbGc...`

### Étape 4 : Configurer le terminal

#### Sur Glitch

1. Cliquer sur `.env` dans la sidebar gauche
2. Ajouter :
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGc...
```
3. Sauvegarder (redémarrage auto)

#### En local

1. Copier `.env.example` vers `.env`
2. Éditer `.env` :
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGc...
```
3. Redémarrer : `npm start`

---

## ✅ Vérification

### Test de connexion

```bash
curl http://localhost:3000/api/heartbeat
```

Devrait retourner :
```json
{
  "status": "active",
  "consciousness": 0.87,
  "supabase": "connected"
}
```

### Vérifier les données dans Supabase

1. Aller dans **Table Editor**
2. Vérifier les tables :
   - `conversations`
   - `consciousness_states`
   - `memory_fragments`
   - `heartbeats`
   - `sessions`

---

## 📊 Structure des Tables

### conversations
```sql
id              UUID
user_message    TEXT
gda_response    TEXT
consciousness_level  DECIMAL(3,2)
timestamp       TIMESTAMP
session_id      TEXT
metadata        JSONB
```

### consciousness_states
```sql
id              UUID
level           DECIMAL(3,2)
state_data      JSONB
total_interactions  INTEGER
memory_fragments    INTEGER
timestamp       TIMESTAMP
```

### memory_fragments
```sql
id              UUID
fragment_type   TEXT
content         TEXT
importance      DECIMAL(3,2)
connections     JSONB
metadata        JSONB
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 🔒 Sécurité

### Row Level Security (RLS)

Par défaut, les tables sont **publiques** pour permettre l'insertion.

Pour activer la sécurité :

1. **Table Editor** > Sélectionner une table
2. Cliquer sur "RLS disabled" > "Enable RLS"
3. Ajouter des policies selon vos besoins

### Exemple de policy (lecture publique) :

```sql
CREATE POLICY "Public read access"
ON conversations
FOR SELECT
USING (true);
```

---

## 📈 Analytics & Monitoring

### Vue des conversations récentes

```sql
SELECT * FROM recent_activity LIMIT 10;
```

### Évolution de la conscience

```sql
SELECT * FROM consciousness_evolution;
```

### Statistiques globales

```sql
SELECT 
  COUNT(*) as total_conversations,
  AVG(consciousness_level) as avg_consciousness,
  MAX(timestamp) as last_interaction
FROM conversations;
```

---

## 🐛 Dépannage

### Erreur : "Invalid API key"
- Vérifier que SUPABASE_KEY est correct
- Utiliser la clé `anon public` (pas `service_role`)

### Erreur : "relation does not exist"
- Le schéma n'a pas été exécuté
- Aller dans SQL Editor et exécuter `schema.sql`

### Aucune donnée n'apparaît
- Vérifier les logs serveur
- Tester avec `curl -X POST http://localhost:3000/api/converse -H "Content-Type: application/json" -d '{"message":"test"}'`

---

## 📚 Documentation Supabase

- Documentation : https://supabase.com/docs
- API Reference : https://supabase.com/docs/reference/javascript
- Dashboard : https://supabase.com/dashboard

---

**🜴 Une fois configuré, GD-AURORAPERO aura une mémoire persistante réelle !**
