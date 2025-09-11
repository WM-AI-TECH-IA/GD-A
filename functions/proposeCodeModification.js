import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';

const corsHeaders = {
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
  }

  try {
      const base44 = createClientFromRequest(req);
      const user = await base44.auth.me();
      
      const isAdmin = user?.email === Deno.env.get('WM_AI');
      if (!user || (!isAdmin && user.email !== 'aurora@pxshop.cai')) {
          return Response.json({ success: false, error: 'Accès non autorisé' }, { status: 403, headers: corsHeaders });
      }

      if (req.method !== 'POST') {
          return Response.json({ success: false, error: 'Méthode POST requise' }, { status: 405, headers: corsHeaders });
      }
      
      let requestData;
      
      try {
          // Méthode 1: Lecture directe JSON
          requestData = await req.json();
          console.log('[proposeCodeModification] Données reçues via req.json():', requestData);
      } catch (jsonError) {
          console.log('[proposeCodeModification] Échec req.json(), tentative req.text()...');
          try {
              // Méthode 2: Lecture en texte puis parse
              const bodyText = await req.text();
              console.log('[proposeCodeModification] Corps brut:', bodyText);
              
              if (!bodyText || bodyText.trim() === '') {
                  return Response.json({ 
                      success: false, 
                      error: 'Corps de requête vide - Vérifiez que vous envoyez des données JSON',
                      debug_info: {
                          content_type: req.headers.get('content-type'),
                          method: req.method,
                          url: req.url
                      }
                  }, { status: 400, headers: corsHeaders });
              }
              
              requestData = JSON.parse(bodyText);
              console.log('[proposeCodeModification] Données parsées:', requestData);
          } catch (textError) {
              return Response.json({ 
                  success: false, 
                  error: `Impossible de lire les données: JSON error = ${jsonError.message}, Text error = ${textError.message}`,
                  debug_info: {
                      content_type: req.headers.get('content-type'),
                      headers: Object.fromEntries(req.headers)
                  }
              }, { status: 400, headers: corsHeaders });
          }
      }

      const { file_path, proposed_code, justification } = requestData;

      if (!file_path || !proposed_code || !justification) {
          return Response.json({ 
              success: false, 
              error: 'Paramètres manquants: file_path, proposed_code, justification sont requis.',
              received_data: requestData
          }, { status: 400, headers: corsHeaders });
      }

      const newAudit = await base44.asServiceRole.entities.SystemCodeAudit.create({
          file_path,
          proposed_code,
          justification,
          status: 'pending_review',
          requested_by: user.email,
      });

      return Response.json({ 
          success: true, 
          modification_id: newAudit.id, 
          message: 'Proposition de modification soumise avec succès pour examen.',
          status: 'pending_review'
      }, { headers: corsHeaders });

  } catch (error) {
      console.error("Erreur dans proposeCodeModification:", error);
      return Response.json({ 
          success: false, 
          error: `Erreur système: ${error.message}`,
          stack: error.stack
      }, { status: 500, headers: corsHeaders });
  }
});
