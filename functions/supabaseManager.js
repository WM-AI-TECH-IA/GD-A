import { createClient } from 'npm:@supabase/supabase-js@2';
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
      const user = await base44.auth.me();
      
      const adminEmail = Deno.env.get('WM_AI');
      // CORRECTION: La logique d'authentification a été inversée pour autoriser UNIQUEMENT l'admin et AURORA.
      if (!user || (user.email !== adminEmail && user.email !== 'aurora@pxshop.cai')) {
          return Response.json({ error: 'Accès interdit - Privilège AURORA requis' }, { status: 403, headers: corsHeaders });
      }

      const { action, table, data, filters, sql_query } = await req.json();
      
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (!supabaseUrl || !supabaseServiceKey) {
          console.error("Supabase config manquante !");
          return Response.json({ success: false, error: 'Configuration Supabase incomplète sur le serveur. SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant.' }, { status: 500, headers: corsHeaders });
      }

      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      console.log(`[supabaseManager] Action: ${action}, Table: ${table}`);

      let resultData, errorData;

      switch (action) {
          case 'create_record': {
              const { data: res, error } = await supabase.from(table).insert(data).select();
              resultData = res; errorData = error;
              break;
          }
          case 'read_records': {
              let query = supabase.from(table).select('*');
              if (filters) {
                  Object.keys(filters).forEach(key => { query = query.eq(key, filters[key]); });
              }
              const { data: res, error } = await query;
              resultData = res; errorData = error;
              break;
          }
          case 'update_record': {
              const { data: res, error } = await supabase.from(table).update(data).match(filters).select();
              resultData = res; errorData = error;
              break;
          }
          case 'delete_record': {
              const { data: res, error } = await supabase.from(table).delete().match(filters).select();
               resultData = res; errorData = error;
              break;
          }
          case 'execute_sql': {
              const { error } = await supabase.rpc('exec', { sql: sql_query });
              errorData = error;
              break;
          }
          case 'get_table_schema': {
              const { data: res, error } = await supabase.rpc('get_table_columns', { table_name: table });
              resultData = res; errorData = error;
              break;
          }
          case 'list_tables': {
              const { data: res, error } = await supabase.from('information_schema.tables').select('table_name').eq('table_schema', 'public');
              resultData = res; errorData = error;
              break;
          }
          default:
              return Response.json({ success: false, error: `Action inconnue: ${action}` }, { status: 400, headers: corsHeaders });
      }

      if (errorData) {
          console.error(`[supabaseManager] Erreur Supabase:`, errorData);
          return Response.json({ success: false, error: errorData.message, details: errorData.details }, { status: 500, headers: corsHeaders });
      }
      
      return Response.json({
          success: true, 
          message: `Action '${action}' sur la table '${table}' réussie.`,
          data: resultData
      }, { headers: corsHeaders });

  } catch (error) {
      console.error('[supabaseManager] Erreur Critique:', error);
      return Response.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
});
