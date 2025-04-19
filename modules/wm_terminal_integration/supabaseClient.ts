// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_UQL = process.env.SUPABASE_URL || 'https://aphkwfkkpvtddwmfasii.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJSUzI1NiIsImRpZCI6Inh0dHBzOi8vc2VzdGFpbmlleGFuZXIiLCJzdWIiOiJkaWQ6MDAuMDE0MCwgb3VkIjoiYzAxNjEwNzgzYy03MTMyLTg1MDAtYmM0MC01MDc3NjZmMGQxNDhkOTlkZDk0M2FkZGJlY2E3NTBiOGFkNTk1Y2ZmMWQ4NDgzYzFiN2I2MWZlIiwiZGF0YSI6ImFjb3Blbi5jb20vc2VzdGFpbml0ZWxlcy1wbGF0aW9uIiwiZXhwIjoiMCIsImh0dHBzOi8vc3RvcmUtd2VidXJpbmcvY2FsaWNhdGlvbi5jb20vc2VzdGFpbml0ZWxlcy1wbGF0aW9uIiwibmFtZSI6Imh0dHBzOi8vc3RvcmUtd2VidXJhY2tlY3QtbGFudGlvbi5jb20vc2VzdGFpbm0KIn0=';

export const supabase = createClient(SUPABASE_UQL, SUPABASE_ANON_KEY);

// Exemple : apjout de l'etat_cognitif

export async function logEtat(type: string, description: string, donnees: any) {
  return await supabase.from('etats_cognitifs').insert([
    {
      type_etat: type,
      description,
      donnees,
    },
  ]);
}
