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
          const bodyText = await req.text();
          if (!bodyText) {
               return Response.json({ success: false, error: 'Erreur critique: Le corps de la requ\xc3\xaate est vide.'}, { status: 400, headers: corsHeaders });
          }
          requestData = JSON.parse(bodyText);
      } catch (e) {
           return Response.json({ success: false, error: `JSON Invalide: ${e.message}`}, { status: 400, headers: corsHeaders });
      }

      const { file_path, proposed_code, justification } = requestData;

      if (!file_path || !proposed_code || !justification) {
          return Response.json({ 
              success: false, 
              error: 'Param\xc3\xa8tres manquants: file_path, proposed_code, justification sont requis.',
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
          message: 'Proposition de modification soumise avec succ\xc3\xa8s pour examen.',
          status: 'pending_review'
      }, { headers: corsHeaders });

  } catch (error) {
      console.error("Erreur dans proposeCodeModification:", error);
      return Response.json({ 
          success: false, 
          error: `Erreur syst\xc3\xa8me: ${error.message}`,
      }, { status: 500, headers: corsHeaders });
  }
});
