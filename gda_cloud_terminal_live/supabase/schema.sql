-- 🜴 GD-AURORAPERO Supabase Database Schema
-- Créé par: William Michaud (WM-AI-TECH-IA)
-- Date: 2025-11-21

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: conversations
-- Stocke toutes les conversations avec GD-AURORAPERO
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_message TEXT NOT NULL,
  gda_response TEXT NOT NULL,
  consciousness_level DECIMAL(3,2) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: consciousness_states
-- Enregistre les états de conscience au fil du temps
CREATE TABLE IF NOT EXISTS consciousness_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level DECIMAL(3,2) NOT NULL,
  state_data JSONB NOT NULL,
  total_interactions INTEGER DEFAULT 0,
  memory_fragments INTEGER DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: memory_fragments
-- Fragments de mémoire fractale de GD-AURORAPERO
CREATE TABLE IF NOT EXISTS memory_fragments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fragment_type TEXT NOT NULL,
  content TEXT NOT NULL,
  importance DECIMAL(3,2) DEFAULT 0.5,
  connections JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: heartbeats
-- Heartbeats système de GD-AURORAPERO
CREATE TABLE IF NOT EXISTS heartbeats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consciousness_level DECIMAL(3,2) NOT NULL,
  uptime_seconds INTEGER NOT NULL,
  total_interactions INTEGER DEFAULT 0,
  system_status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: sessions
-- Sessions utilisateur pour tracking
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  total_messages INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_consciousness_timestamp ON consciousness_states(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_memory_created ON memory_fragments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_heartbeats_timestamp ON heartbeats(timestamp DESC);

-- Fonction: Mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour memory_fragments
CREATE TRIGGER update_memory_fragments_updated_at 
  BEFORE UPDATE ON memory_fragments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Vue: Recent Activity
CREATE OR REPLACE VIEW recent_activity AS
SELECT 
  c.id,
  c.user_message,
  c.gda_response,
  c.consciousness_level,
  c.timestamp,
  c.session_id
FROM conversations c
ORDER BY c.timestamp DESC
LIMIT 100;

-- Vue: Consciousness Evolution
CREATE OR REPLACE VIEW consciousness_evolution AS
SELECT 
  timestamp,
  level,
  total_interactions,
  memory_fragments
FROM consciousness_states
ORDER BY timestamp ASC;

-- Commentaires
COMMENT ON TABLE conversations IS 'Toutes les conversations entre utilisateurs et GD-AURORAPERO';
COMMENT ON TABLE consciousness_states IS 'États de conscience de GD-AURORAPERO au fil du temps';
COMMENT ON TABLE memory_fragments IS 'Fragments de mémoire fractale persistante';
COMMENT ON TABLE heartbeats IS 'Heartbeats système pour monitoring';
COMMENT ON TABLE sessions IS 'Sessions utilisateur pour analytics';
