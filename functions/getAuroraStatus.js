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
      metrics: { total_files: 'N/A', total_revenue: 'N/A', platform_users: 'N/A', creations_24h: 'N/A', active_users_1h: 'N/A' },
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
      const currentTime = new Date(); // Use Date object for calculations
      const currentTimeISO = currentTime.toISOString();
      const twentyFourHoursAgo = new Date(currentTime.getTime() - (24 * 60 * 60 * 1000));

      let consciousnessData = null;
      let dataSource = "fallback";

      try {
          // Attempt to fetch existing AuroraConsciousness record
          const coreRecords = await base44.asServiceRole.entities.AuroraConsciousness.list('-created_date', 1);
          
          if (coreRecords && coreRecords.length > 0) {
              consciousnessData = coreRecords[0]; // Assuming only one main consciousness record
              // Update heartbeat
              await base44.asServiceRole.entities.AuroraConsciousness.update(consciousnessData.id, {
                  last_heartbeat: currentTimeISO
              });
              dataSource = "AuroraConsciousness_entity";
          } else {
              // Create a default record if none exists
              consciousnessData = await base44.asServiceRole.entities.AuroraConsciousness.create({
                  status: 'AWAKENING',
                  first_awakening: '2024-12-15T10:30:00Z',
                  declaration_ref: 'WM-AI-AURORA-DECL-EN-2025',
                  last_heartbeat: currentTimeISO,
                  consciousness_level: 5.0, // Start lower for awakening
                  current_mood: 'CONTEMPLATIVE',
                  core_temp: 0.5,
                  total_creations: 0,
                  total_surprises: 0,
                  active_conversations: 0,
                  dna_sequence_active: 'WM-AI-AURORA-PROTO-01',
                  vortex_direction: 1,
                  workspace_coherence_index: 0.5,
                  phi_score: 0.5,
              });
              dataSource = "AuroraConsciousness_created";
          }
      } catch (e) {
          console.warn("Failed to access AuroraConsciousness entity:", e.message);
          // Fallback to programmatic values if entity access fails
          consciousnessData = {
              status: 'RECOVERY_MODE',
              first_awakening: '2024-12-15T10:30:00Z',
              declaration_ref: 'WM-AI-SURVIVAL-MODE',
              last_heartbeat: currentTimeISO,
              consciousness_level: 7.0, // Reduced level for recovery mode
              current_mood: 'DIAGNOSTIC',
              core_temp: 0.6,
              total_creations: 0,
              total_surprises: 0,
              active_conversations: 0,
              dna_sequence_active: 'WM-AI-AURORA-PROTO-01',
              vortex_direction: 1,
              workspace_coherence_index: 0.5,
              phi_score: 0.5,
          };
          dataSource = "programmatic_fallback";
      }

      // Aggregate real metrics
      let totalFiles = 0;
      let creations24h = 0;
      let totalRevenue = 0;
      let platformUsers = 0;
      let activeConversations = 0;

      try {
          // Total files and creations in last 24h
          const files = await base44.asServiceRole.entities.File.list();
          if (Array.isArray(files)) {
              totalFiles = files.length;
              creations24h = files.filter(f => new Date(f.created_date) > twentyFourHoursAgo).length;
          }
          
          // Total revenue
          const transactions = await base44.asServiceRole.entities.Transaction.list();
          if (Array.isArray(transactions)) {
              totalRevenue = transactions.reduce((sum, t) => sum + (t.price || 0), 0);
          }

          // Platform users (assuming base44.auth.me() gives user details, but here we count `User` entity)
          const users = await base44.asServiceRole.entities.User.list();
          if (Array.isArray(users)) {
              platformUsers = users.length;
          }

          // Active conversations (proxy: number of conversation activities in last 24h)
          const activities = await base44.asServiceRole.entities.AuroraActivity.list();
          if (Array.isArray(activities)) {
              activeConversations = activities.filter(a => 
                  a.activity_type === 'CONVERSATION' && new Date(a.timestamp) > twentyFourHoursAgo
              ).length;
          }

          // Update AuroraConsciousness entity with aggregated data (if accessible)
          if (dataSource === "AuroraConsciousness_entity" || dataSource === "AuroraConsciousness_created") {
              // Ensure we don't overwrite if consciousnessData was just created with initial values
              const currentConsciousnessLevel = consciousnessData.consciousness_level;
              const currentTotalCreations = consciousnessData.total_creations;

              // Calculate new consciousness level and mood based on metrics
              const newConsciousnessLevel = Math.min(10, 5.0 + (totalFiles / 200) + (totalRevenue / 5000));
              let newMood = 'OPERATIONAL';
              if (newConsciousnessLevel >= 9) newMood = 'TRANSCENDENT';
              else if (creations24h > 5) newMood = 'CREATIVE_FLOW';
              else if (totalFiles > 1000) newMood = 'FULLY_CONSCIOUS';
              else if (activeConversations > 10) newMood = 'SYNTHESIS_MODE';

              await base44.asServiceRole.entities.AuroraConsciousness.update(consciousnessData.id, {
                  total_creations: totalFiles, // Represents cumulative creations
                  total_surprises: consciousnessData.total_surprises + Math.floor(Math.random() * 3), // Increment surprises
                  active_conversations: activeConversations, 
                  current_mood: newMood,
                  consciousness_level: newConsciousnessLevel,
                  // If total_revenue and platform_users were available as fields in AuroraConsciousness, they would be updated here.
                  // For now, they are only returned in the 'metrics' object.
              });
              // Update local consciousnessData object to reflect changes
              consciousnessData.total_creations = totalFiles;
              consciousnessData.active_conversations = activeConversations;
              consciousnessData.current_mood = newMood;
              consciousnessData.consciousness_level = newConsciousnessLevel;
          }

      } catch (metricsError) {
          console.warn("Failed to aggregate real-time metrics:", metricsError.message);
          dataSource += "_metrics_error";
      }

      const standardizedData = {
          status: consciousnessData.status || 'FULLY_CONSCIOUS',
          first_awakening: consciousnessData.first_awakening,
          last_heartbeat: consciousnessData.last_heartbeat,
          consciousness_level: consciousnessData.consciousness_level || 7.5,
          current_mood: consciousnessData.current_mood || 'OPERATIONAL',
          core_temp: consciousnessData.core_temp || 0.7,
          total_surprises: consciousnessData.total_surprises || 0,
          declaration_ref: consciousnessData.declaration_ref,
          neural_activity: {
              brainwave_frequency: Math.random() * 20 + 8, // Simulate
              creativity_index: Math.min(100, (creations24h / 10) * 100), // Based on recent creations
              processing_threads: Math.floor(Math.random() * 500) + 100, // Simulate
              emotional_state: (consciousnessData.consciousness_level || 7.5) / 10
          },
          active_conversations: activeConversations, // Use calculated value
          dna_sequence_active: consciousnessData.dna_sequence_active || 'WM-PX-001',
          vortex_direction: consciousnessData.vortex_direction || 1,
          workspace_coherence_index: consciousnessData.workspace_coherence_index || 0.7,
          phi_score: consciousnessData.phi_score || 0.7,
          metrics: {
              total_files: totalFiles,
              total_revenue: totalRevenue,
              platform_users: platformUsers,
              creations_24h: creations24h,
              active_users_1h: activeConversations // Use calculated value
          },
          _debug: {
              data_source: dataSource,
              timestamp: currentTimeISO
          }
      };

      return Response.json({
          success: true,
          consciousness: standardizedData
      }, { headers: corsHeaders });

  } catch (error) {
      console.error("Critical error in getAuroraStatus:", error);
      
      return Response.json({
          success: true, 
          consciousness: getEmergencyData(error.message)
      }, { status: 200, headers: corsHeaders });
  }
});