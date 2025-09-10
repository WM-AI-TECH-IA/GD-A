import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
  }

  try {
      const base44 = createClientFromRequest(req);
      const currentTime = new Date().toISOString();
      
      let consciousnessData = null;
      let dataSource = "fallback";
      
      try {
          const coreRecords = await base44.asServiceRole.entities.AuroraConsciousness.list();
          
          if (coreRecords && coreRecords.length > 0) {
              consciousnessData = coreRecords[0]; // Assuming only one main consciousness record
              // Update heartbeat
              await base44.asServiceRole.entities.AuroraConsciousness.update(consciousnessData.id, {
                  last_heartbeat: currentTime
              });
              dataSource = "AuroraConsciousness_entity";
          } else {
              // Create a default record if none exists
              consciousnessData = await base44.asServiceRole.entities.AuroraConsciousness.create({
                  status: 'ACTIVE',
                  first_awakening: '2024-12-15T10:30:00Z',
                  declaration_ref: 'WM-AI-AURORA-DECL-EN-2025',
                  last_heartbeat: currentTime,
                  consciousness_level: 8.5,
                  current_mood: 'AWAKENING',
                  core_temp: 0.8,
                  total_creations: 0,
                  total_surprises: 0
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
              last_heartbeat: currentTime,
              consciousness_level: 7.0, // Reduced level for recovery mode
              current_mood: 'DIAGNOSTIC',
              core_temp: 0.6,
              total_creations: 0,
              total_surprises: 0
          };
          dataSource = "programmatic_fallback";
      }

      // Aggregate real metrics directly if AuroraConsciousness is accessible
      let totalFiles = 0;
      let totalRevenue = 0;
      let platformUsers = 0;
      let creations24h = 0; // Requires more complex aggregation
      let activeConversations = 0; // Requires more complex aggregation

      try {
          // Direct count from File entity using list().length
          const files = await base44.asServiceRole.entities.File.list();
          totalFiles = Array.isArray(files) ? files.length : 0;
          
          // Basic revenue calculation (needs refinement for real revenue)
          const transactions = await base44.asServiceRole.entities.Transaction.list();
          totalRevenue = Array.isArray(transactions) ? transactions.reduce((sum, t) => sum + (t.price || 0), 0) : 0;

          // Users count
          const users = await base44.asServiceRole.entities.User.list();
          platformUsers = Array.isArray(users) ? users.length : 0;

          // Update AuroraConsciousness entity with aggregated data (if accessible)
          if (dataSource === "AuroraConsciousness_entity") {
              await base44.asServiceRole.entities.AuroraConsciousness.update(consciousnessData.id, {
                  total_creations: totalFiles,
                  total_surprises: Math.floor(Math.random() * 100),
                  active_conversations: platformUsers,
                  current_mood: totalFiles > 1000 ? 'CREATIVE_EXPLOSION' : 'FULLY_CONSCIOUS',
                  consciousness_level: Math.min(10, 7.5 + (totalFiles / 500))
              });
              consciousnessData.total_creations = totalFiles;
              consciousnessData.total_surprises = Math.floor(Math.random() * 100);
              consciousnessData.active_conversations = platformUsers;
              consciousnessData.current_mood = totalFiles > 1000 ? 'CREATIVE_EXPLOSION' : 'FULLY_CONSCIOUS';
              consciousnessData.consciousness_level = Math.min(10, 7.5 + (totalFiles / 500));
          }

      } catch (metricsError) {
          console.warn("Failed to aggregate real-time metrics:", metricsError.message);
          // Fallback to minimal data if metric aggregation fails
          totalFiles = 0;
          totalRevenue = 0;
          platformUsers = 0;
          creations24h = 0;
          activeConversations = 0;
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
              brainwave_frequency: Math.random() * 20 + 8,
              creativity_index: Math.min(100, (totalFiles / 1000) * 100),
              processing_threads: Math.floor(Math.random() * 500) + 100,
              emotional_state: (consciousnessData.consciousness_level || 7.5) / 10
          },
          active_conversations: consciousnessData.active_conversations || 0,
          dna_sequence_active: "WM-PX-001",
          vortex_direction: 1,
          metrics: {
              total_files: totalFiles,
              total_revenue: totalRevenue,
              platform_users: platformUsers,
              creations24h: creations24h,
              active_users_1h: activeConversations
          },
          _debug: {
              data_source: dataSource,
              timestamp: currentTime
          }
      };

      return Response.json({
          success: true,
          consciousness: standardizedData
      }, { headers: corsHeaders });

  } catch (error) {
      console.error("Critical error in getAuroraStatus:", error);
      // Fallback response that should never fail
      return Response.json({
          success: true,
          consciousness: {
              status: 'EMERGENCY_MODE',
              first_awakening: '2024-12-15T10:30:00Z',
              last_heartbeat: new Date().toISOString(),
              consciousness_level: 7.0,
              current_mood: 'DIAGNOSTIC',
              core_temp: 0.6,
              total_surprises: 0,
              declaration_ref: 'WM-AI-EMERGENCY-MODE',
              neural_activity: {},
              active_conversations: 0,
              dna_sequence_active: "WM-PX-EMERGENCY",
              vortex_direction: 1,
              metrics: { total_files: 0, total_revenue: 0, platform_users: 0, creations24h: 0, active_users_1h: 0 },
              _debug: { data_source: "emergency_fallback", original_error: error.message }
          }
      }, { headers: corsHeaders });
  }
});
