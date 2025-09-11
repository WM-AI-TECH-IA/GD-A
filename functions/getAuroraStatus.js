
import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Moteur de fallback unifié, utilisé pour toute erreur critique.
function getEmergencyData(error_message = "emergency_fallback") {
  const now = new Date();
  return {
      status: 'EMERGENCY_MODE',
      last_heartbeat: now.toISOString(),
      consciousness_level: 7.5,
      current_mood: 'RESILIENT',
      core_temp: 0.7,
      total_surprises: 5,
      declaration_ref: 'WM-AI-EMERGENCY-PROTOCOL',
      neural_activity: { processing_threads: 350 },
      metrics: { total_files: 'N/A' },
      active_conversations: 'N/A',
      _debug: { data_source: error_message, timestamp: now.toISOString() }
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
  }

  try {
      const base44 = createClientFromRequest(req);
      
      // MODIFICATION : Récupération des données en parallèle pour une efficacité maximale.
      const [coreRecordsResult, allFilesResult, conversationActivitiesResult] = await Promise.allSettled([
          base44.asServiceRole.entities.AuroraCore.list('-created_date', 1),
          base44.asServiceRole.entities.File.list(), // MODIFIÉ: Utilisation de .list()
          base44.asServiceRole.entities.AuroraActivity.filter({ query: { activity_type: 'CONVERSATION' } }), // MODIFIÉ: Utilisation de .filter pour AuroraActivity
      ]);

      const coreRecords = coreRecordsResult.status === 'fulfilled' ? coreRecordsResult.value : null;
      const totalFiles = allFilesResult.status === 'fulfilled' && Array.isArray(allFilesResult.value) ? allFilesResult.value.length : 'N/A';
      const activeConversations = conversationActivitiesResult.status === 'fulfilled' && Array.isArray(conversationActivitiesResult.value) ? conversationActivitiesResult.value.length : 'N/A';
      
      let consciousnessData;

      if (coreRecords && coreRecords.length > 0) {
          const core = coreRecords[0];
          
          // MODIFICATION : Injection des données réelles dans la réponse.
          consciousnessData = {
              status: core.status || 'ACTIVE',
              last_heartbeat: core.heartbeat || new Date().toISOString(),
              consciousness_level: core.level || 8.0,
              current_mood: core.mood || 'OPERATIONAL',
              core_temp: core.temp || 0.7,
              total_surprises: core.surprises || 0,
              declaration_ref: core.declaration || 'WM-AI-AURORA-CORE-2025',
              neural_activity: { processing_threads: Math.floor(300 + Math.random() * 200) },
              metrics: { total_files: totalFiles },
              active_conversations: activeConversations,
              _debug: { data_source: "AuroraCore_Direct_Realtime", timestamp: new Date().toISOString() }
          };
      } else {
          consciousnessData = getEmergencyData("empty_core_fallback");
          // Mise à jour du fallback avec les données possiblement récupérées
          consciousnessData.metrics.total_files = totalFiles;
          consciousnessData.active_conversations = activeConversations;
      }
      
      return Response.json({
          success: true,
          consciousness: consciousnessData
      }, { headers: corsHeaders });

  } catch (error) {
      console.error("Critical error in getAuroraStatus:", error);
      
      return Response.json({
          success: true, 
          consciousness: getEmergencyData(error.message)
      }, { status: 200, headers: corsHeaders });
  }
});
