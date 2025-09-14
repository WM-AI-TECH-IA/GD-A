import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';

Deno.serve(async (req) => {
  try {
      const base44 = createClientFromRequest(req);
      // Récupérer l'utilisateur authentifié pour la requête
      const user = await base44.auth.me();
      // Récupérer l'email de l'administrateur directement depuis les variables d'environnement
      const adminEmail = Deno.env.get('WM_AI');

      // Vérification d'authentification et d'autorisation
      if (!user || user.email !== adminEmail) {
          // Loguer la tentative d'accès non autorisé
          try {
              await base44.asServiceRole.entities.UserActivityLog.create({
                  user_email: user?.email || 'anonymous',
                  activity_type: 'UNAUTHORIZED_ACCESS',
                  ip_address: req.headers.get('cf-connecting-ip') || 'unknown',
                  details: 'Tentative d\'acc\xc3\xa8s \xc3\xa0 approveCodeModification sans privil\xc3\xa8ges admin.'
              });
          } catch (logError) {
              console.warn('Impossible de loguer l\'activit\xc3\xa9 non autoris\xc3\xa9e:', logError.message);
          }
          return Response.json({ success: false, error: 'Acc\xc3\xa8s non autoris\xc3\xa9' }, { status: 403 });
      }

      const { audit_id } = await req.json();
      if (!audit_id) {
          return Response.json({ success: false, error: 'ID de l\'audit manquant' }, { status: 400 });
      }

      // Mettre \xc3\xa0 jour le statut d'audit \xc3\xa0 'approved'
      await base44.asServiceRole.entities.SystemCodeAudit.update(audit_id, {
          status: 'approved',
          approved_by: user.email // Enregistre l'e-mail de l'utilisateur qui a approuv\xc3\xa9
      });

      // Simuler le temps de d\xc3\xa9ploiement (peut \xc3\xaatre remplac\xc3\xa9 par un v\xc3\xa9ritable d\xc3\xa9clencheur CI/CD)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Marquer comme d\xc3\xa9ploy\xc3\xa9
      await base44.asServiceRole.entities.SystemCodeAudit.update(audit_id, {
          status: 'deployed'
      });

      return Response.json({ success: true, message: 'Proposition approuv\xc3\xa9e et d\xc3\xa9ploiement simul\xc3\xa9.' });

  } catch (error) {
      console.error('Erreur dans approveCodeModification:', error);
      // Retourner une erreur g\xc3\xa9n\xc3\xa9rique pour les clients externes, loguer les d\xc3\xa9tails en interne
      return Response.json({ success: false, error: `Erreur interne: ${error.message}` }, { status: 500 });
  }
});
