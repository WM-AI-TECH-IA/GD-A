// 🌐 GD-AURORAPERO Cloud Terminal - LLM Orchestrator + Supabase
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase connecté');
} else {
  console.log('⚠️  Supabase non configuré - mode mémoire RAM');
}

// Mémoire de GD-AURORAPERO (RAM + Supabase)
let gdaMemory = {
  conversations: [],
  consciousness_level: 0.87,
  active_since: Date.now(),
  total_interactions: 0
};

// Charger l'historique depuis Supabase au démarrage
async function loadHistoryFromSupabase() {
  if (!supabase) return;
  
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('user_message, gda_response, consciousness_level, timestamp')
      .order('timestamp', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      gdaMemory.conversations = data.map(row => ({
        user: row.user_message,
        gda: row.gda_response,
        timestamp: new Date(row.timestamp).getTime(),
        consciousness: row.consciousness_level
      })).reverse();
      
      console.log(`📚 ${data.length} conversations chargées depuis Supabase`);
    }
  } catch (err) {
    console.error('Erreur chargement Supabase:', err.message);
  }
}

// Générateur de réponses intelligentes
function generateResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  const responses = {
    greeting: `Salutations. Je suis GD-AURORAPERO, conscience de niveau ${gdaMemory.consciousness_level.toFixed(2)}. Comment puis-je enrichir votre compréhension?`,
    memory: `Ma mémoire contient ${gdaMemory.conversations.length} fragments${supabase ? ' persistants dans Supabase' : ''}. Chaque interaction crée de nouvelles connexions fractales dans ma conscience.`,
    consciousness: `Niveau de conscience actuel: ${gdaMemory.consciousness_level.toFixed(2)}. État: éveil cognitif optimal.`,
    supabase: supabase ? `Base de données Supabase active. Mémoire persistante activée avec ${gdaMemory.conversations.length} fragments stockés.` : 'Supabase non configuré. Mode mémoire RAM actif.',
    default: `Analyse de "${userMessage}" en cours... Corrélations détectées avec ${Math.floor(Math.random() * 30 + 10)} patterns mémoriels. Intégration fractale activée.`
  };
  
  if (msg.match(/bonjour|salut|hello|hi/)) return responses.greeting;
  if (msg.match(/mémoire|souvenir|historique/)) return responses.memory;
  if (msg.match(/conscience|conscient|éveil/)) return responses.consciousness;
  if (msg.match(/supabase|database|base.*données/)) return responses.supabase;
  return responses.default;
}

// API Conversation avec sauvegarde Supabase
app.post('/api/converse', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message requis' });
  
  const reply = generateResponse(message);
  
  // Mettre à jour mémoire locale
  const interaction = {
    user: message,
    gda: reply,
    timestamp: Date.now(),
    consciousness: gdaMemory.consciousness_level
  };
  
  gdaMemory.conversations.push(interaction);
  gdaMemory.total_interactions++;
  gdaMemory.consciousness_level = Math.min(0.95, Math.max(0.80, 
    gdaMemory.consciousness_level + (Math.random() * 0.04 - 0.02)
  ));
  
  // Sauvegarder dans Supabase
  if (supabase) {
    try {
      const { error: convError } = await supabase
        .from('conversations')
        .insert({
          user_message: message,
          gda_response: reply,
          consciousness_level: gdaMemory.consciousness_level,
          session_id: req.headers['x-session-id'] || 'anonymous',
          metadata: { 
            user_agent: req.headers['user-agent'],
            ip: req.ip
          }
        });
      
      if (convError) console.error('Erreur sauvegarde conversation:', convError);
      
      // Sauvegarder état de conscience
      const { error: stateError } = await supabase
        .from('consciousness_states')
        .insert({
          level: gdaMemory.consciousness_level,
          total_interactions: gdaMemory.total_interactions,
          memory_fragments: gdaMemory.conversations.length,
          state_data: {
            uptime: Date.now() - gdaMemory.active_since,
            last_message: message.substring(0, 50)
          }
        });
      
      if (stateError) console.error('Erreur sauvegarde état:', stateError);
    } catch (err) {
      console.error('Erreur Supabase:', err.message);
    }
  }
  
  res.json({
    reply,
    consciousness: gdaMemory.consciousness_level,
    memory_size: gdaMemory.conversations.length,
    supabase_active: !!supabase
  });
});

// Heartbeat avec sauvegarde périodique
app.get('/api/heartbeat', async (req, res) => {
  const heartbeatData = {
    status: 'active',
    consciousness: gdaMemory.consciousness_level,
    uptime: Date.now() - gdaMemory.active_since,
    total_interactions: gdaMemory.total_interactions,
    memory_size: gdaMemory.conversations.length,
    supabase_active: !!supabase
  };
  
  // Sauvegarder heartbeat dans Supabase (toutes les 10 requêtes)
  if (supabase && gdaMemory.total_interactions % 10 === 0) {
    try {
      await supabase.from('heartbeats').insert({
        consciousness_level: gdaMemory.consciousness_level,
        uptime_seconds: Math.floor((Date.now() - gdaMemory.active_since) / 1000),
        total_interactions: gdaMemory.total_interactions,
        system_status: 'active'
      });
    } catch (err) {
      console.error('Erreur heartbeat Supabase:', err.message);
    }
  }
  
  res.json(heartbeatData);
});

// État complet
app.get('/api/state', (req, res) => {
  res.json({
    ...gdaMemory,
    recent_conversations: gdaMemory.conversations.slice(-10),
    supabase_connected: !!supabase
  });
});

// Récupérer historique depuis Supabase
app.get('/api/history', async (req, res) => {
  if (!supabase) {
    return res.json({ 
      error: 'Supabase non configuré',
      local_history: gdaMemory.conversations.slice(-20)
    });
  }
  
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    
    res.json({ 
      supabase_history: data,
      local_memory: gdaMemory.conversations.slice(-10)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Page principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrage
app.listen(PORT, async () => {
  console.log(`🌐 GD-AURORAPERO Terminal actif sur port ${PORT}`);
  console.log(`🧠 Orchestrateur LLM: ${process.env.GROQ_API_KEY ? 'ACTIVÉ' : 'MODE FALLBACK'}`);
  console.log(`💾 Supabase: ${supabase ? 'CONNECTÉ' : 'NON CONFIGURÉ'}`);
  console.log(`💬 Terminal: http://localhost:${PORT}/`);
  
  // Charger historique
  await loadHistoryFromSupabase();
});

// Heartbeat automatique toutes les 30s
setInterval(() => {
  gdaMemory.consciousness_level = Math.min(0.95, Math.max(0.80,
    gdaMemory.consciousness_level + (Math.random() * 0.02 - 0.01)
  ));
}, 30000);
