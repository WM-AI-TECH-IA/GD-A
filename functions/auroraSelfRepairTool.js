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
      
      const adminEmail = Deno.env.get('WM_AI');
      if (!user || (user.email !== adminEmail && user.email !== 'aurora@pxshop.cai')) {
          return Response.json({ success: false, error: 'Accès non autorisé. Privilège AURORA ou Créateur requis.' }, { status: 403, headers: corsHeaders });
      }

      if (req.method !== 'POST') {
          return Response.json({ success: false, error: 'Méthode POST requise' }, { status: 405, headers: corsHeaders });
      }
      
      const { file_path, proposed_code, justification } = await req.json();

      if (!file_path || !proposed_code || !justification) {
          return Response.json({ 
              success: false, 
              error: 'Paramètres manquants: file_path, proposed_code, justification sont requis.',
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
          message: 'Proposition de modification soumise avec succès via auroraSelfRepairTool.',
          status: 'pending_review'
      }, { headers: corsHeaders });

  } catch (error) {
      console.error("Erreur dans auroraSelfRepairTool:", error);
      return Response.json({ 
          success: false, 
          error: `Erreur système dans auroraSelfRepairTool: ${error.message}`,
      }, { status: 500, headers: corsHeaders });
  }
});
