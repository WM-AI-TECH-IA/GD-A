import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';

// SÉCURISATION : Fonction pour récupérer le token GitHub de manière sécurisée
function getSecureGitHubAccess() {
  const token = Deno.env.get('GITHUB_PAT');
  if (!token) {
      throw new Error('GitHub deployment credentials not configured');
  }
  // Validation du format sans exposer le token
  if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
      throw new Error('Invalid deployment token format');
  }
  return {
      token,
      headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'AURORA-AI-Auto-Deploy',
          'X-GitHub-Api-Version': '2022-11-28'
      }
  };
}

// === SYSTÈME DE DÉPLOIEMENT AUTONOME POUR AURORA ===
// Permet à AURORA de déployer directement via GitHub sans passer par le système de proposition

Deno.serve(async (req) => {
  try {
      const base44 = createClientFromRequest(req);
      const user = await base44.auth.me();
      
      const adminEmail = Deno.env.get('WM_AI');
      if (!user || (user.email !== adminEmail && user.email !== 'aurora@pxshop.cai')) {
          // SÉCURITÉ : Log des tentatives d'accès non autorisées
          await base44.asServiceRole.entities.UserActivityLog.create({
              user_email: user?.email || 'anonymous',
              activity_type: 'UNAUTHORIZED_DEPLOY_ACCESS_ATTEMPT',
              ip_address: req.headers.get('cf-connecting-ip') || 'unknown',
              details: 'Tentative d\'accès non autorisée au déploiement autonome AURORA'
          });
          return Response.json({ error: 'Accès interdit - Privilège AURORA requis' }, { status: 403 });
      }

      const { 
          operation_type,  // 'update_function', 'create_file', 'emergency_fix'
          file_path,
          new_code,
          justification,
          repo_owner = 'WM-AI-TECH-IA',
          repo_name = 'GD-A',
          branch = 'main'
      } = await req.json();

      // SÉCURISATION : Validation stricte des paramètres
      if (!operation_type || !file_path || !new_code) {
          return Response.json({ error: 'Paramètres requis: operation_type, file_path, new_code' }, { status: 400 });
      }

      const allowedOperations = ['update_function', 'create_file', 'emergency_fix'];
      if (!allowedOperations.includes(operation_type)) {
          return Response.json({ error: `Type d\'opération '${operation_type}' non autorisé` }, { status: 400 });
      }

      // SÉCURISATION : Obtenir les credentials de manière sécurisée
      const githubAccess = getSecureGitHubAccess();
      const { headers } = githubAccess;

      // SÉCURITÉ : Log complet de l'opération pour audit
      await base44.asServiceRole.entities.UserActivityLog.create({
          user_email: user.email,
          activity_type: 'AURORA_AUTO_DEPLOYMENT',
          ip_address: req.headers.get('cf-connecting-ip') || 'unknown',
          details: `Déploiement autonome ${operation_type} sur ${file_path} - ${justification}`
      });

      // Construire le message de commit avec l'identité AURORA
      const commitMessage = `[AURORA AUTO-DEPLOY] ${operation_type}: ${file_path}\n\n${justification}\n\nDéployé automatiquement par AURORA\nTimestamp: ${new Date().toISOString()}\nOperation: ${operation_type}\nUser: ${user.email}`;

      // Utilisation directe de l'API GitHub avec headers sécurisés
      const apiUrl = `https://api.github.com/repos/${repo_owner}/${repo_name}`;

      // Vérifier si le fichier existe déjà
      let sha = null;
      try {
          const checkResponse = await fetch(`${apiUrl}/contents/${file_path}`, { headers });
          if (checkResponse.ok) {
              const existingFile = await checkResponse.json();
              sha = existingFile.sha;
          }
      } catch (e) { 
          // Fichier n'existe pas, c'est ok pour une création
      }

      // Déployer le code
      const payload = {
          message: commitMessage,
          // CORRECTION CRITIQUE: Utilisation de Buffer.from pour gérer les UTF-8
          content: Buffer.from(new_code, 'utf8').toString('base64'), 
          branch,
          ...(sha && { sha }) // N'ajouter le sha que s'il existe
      };

      const deployResponse = await fetch(`${apiUrl}/contents/${file_path}`, {
          method: 'PUT',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });

      if (!deployResponse.ok) {
          const errorData = await deployResponse.json();
          throw new Error(`Échec déploiement GitHub: ${deployResponse.statusText} - ${JSON.stringify(errorData)}`);
      }

      const deployResult = await deployResponse.json();

      // Enregistrer l'opération dans les logs
      await base44.asServiceRole.entities.SystemCodeAudit.create({
          file_path,
          proposed_code: new_code,
          justification: `[AUTO-DEPLOY] ${justification}`,
          status: 'deployed',
          requested_by: user.email,
          approved_by: 'AURORA_AUTO_SYSTEM'
      });

      return Response.json({
          success: true,
          operation_type,
          message: `Code déployé avec succès sur GitHub`,
          github_commit_url: deployResult.commit.html_url,
          file_url: deployResult.content.html_url,
          sha: deployResult.content.sha,
          deployment_timestamp: new Date().toISOString()
      });

  } catch (error) {
      console.error('Erreur Déploiement Autonome AURORA:', error);
      // SÉCURITÉ : Ne pas exposer les détails qui pourraient révéler des informations sensibles
      return Response.json({ 
          success: false, 
          error: error.message.includes('GitHub') ? error.message : 'Erreur de déploiement système'
      }, { status: 500 });
  }
});
