import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';

function getSecureGitHubToken() {
  return Deno.env.get('GITHUB_PAT');
}

function createSecureHeaders(token) {
  return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'PxSHOP-AURORA-Deploy/1.0',
      'Content-Type': 'application/json'
  };
}

// CORRECTION CRITIQUE: Gestion SHA robuste avec récupération automatique
async function getLatestSHA(token, owner, repo, path, branch = 'main') {
  try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
      const response = await fetch(url, {
          headers: createSecureHeaders(token)
      });

      if (response.ok) {
          const data = await response.json();
          return data.sha;
      } else if (response.status === 404) {
          // Fichier n'existe pas, pas de SHA requis pour création
          return null;
      } else {
          console.warn(`Failed to get SHA for ${path}: ${response.status}`);
          return null;
      }
  } catch (error) {
      console.warn(`Error getting SHA for ${path}:`, error.message);
      return null;
  }
}

// CORRECTION CRITIQUE: Encodage UTF-8 sécurisé
function safeBase64Encode(content) {
  try {
      // Conversion explicite en UTF-8 puis Base64
      const encoder = new TextEncoder();
      const utf8Bytes = encoder.encode(content);
      return btoa(String.fromCharCode(...utf8Bytes));
  } catch (error) {
      console.error('Erreur encodage Base64:', error);
      // Fallback : encodage direct
      return btoa(unescape(encodeURIComponent(content)));
  }
}

Deno.serve(async (req) => {
  try {
      const base44 = createClientFromRequest(req);
      const user = await base44.auth.me();
      
      const adminEmail = Deno.env.get('WM_AI');
      if (!user || (user.email !== adminEmail && user.email !== 'aurora@pxshop.cai')) {
          // SÉCURITÉ : Log des tentatives d'accès non autorisées
          await base44.asServiceRole.entities.UserActivityLog.create({
              user_email: user?.email || 'anonymous',
              activity_type: 'UNAUTHORIZED_GITHUB_ACCESS_ATTEMPT',
              ip_address: req.headers.get('cf-connecting-ip') || 'unknown',
              details: 'Tentative d'accès non autorisée au gestionnaire GitHub'
          });
          return Response.json({ error: 'Accès interdit - Privilège AURORA requis' }, { status: 403 });
      }

      const { action, repoOwner, repoName, path, content, message, branch = 'main' } = await req.json();
      
      const token = getSecureGitHubToken();
      if (!token) {
          return Response.json({ error: 'Token GitHub non configuré' }, { status: 500 });
      }

      const headers = createSecureHeaders(token);

      switch (action) {
          case 'write_file': {
              if (!path || !content || !message) {
                  return Response.json({ error: 'path, content et message requis' }, { status: 400 });
              }

              // CORRECTION: Récupération automatique du SHA
              const existingSHA = await getLatestSHA(token, repoOwner, repoName, path, branch);
              
              const payload = {
                  message,
                  content: safeBase64Encode(content),
                  branch
              };
              
              // Ajout conditionnel du SHA seulement si le fichier existe
              if (existingSHA) {
                  payload.sha = existingSHA;
              }

              const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`;
              console.log(`[AURORA-DEPLOY] ${existingSHA ? 'Updating' : 'Creating'} ${path}`);

              const response = await fetch(url, {
                  method: 'PUT',
                  headers,
                  body: JSON.stringify(payload)
              });

              if (response.ok) {
                  const responseData = await response.json();
                  return Response.json({ 
                      success: true, 
                      message: `Fichier ${existingSHA ? 'mis à jour' : 'créé'} avec succès`,
                      commit: responseData.commit,
                      sha: responseData.content.sha
                  });
              } else {
                  const errorText = await response.text();
                  console.error(`GitHub API Error:`, errorText);
                  return Response.json({ 
                      success: false, 
                      error: `Erreur GitHub API (${response.status}): ${errorText}` 
                  }, { status: 400 });
              }
          }

          case 'read_file': {
              if (!path) {
                  return Response.json({ error: 'path requis' }, { status: 400 });
              }

              const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}?ref=${branch}`;
              const response = await fetch(url, { headers });

              if (response.ok) {
                  const data = await response.json();
                  const content = atob(data.content);
                  return Response.json({ success: true, content, sha: data.sha });
              } else {
                  return Response.json({ success: false, error: `Fichier non trouvé: ${path}` }, { status: 404 });
              }
          }

          case 'list_files': {
              const dirPath = path || '';
              const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${dirPath}?ref=${branch}`;
              const response = await fetch(url, { headers });

              if (response.ok) {
                  const files = await response.json();
                  return Response.json({ success: true, files: files.map(f => ({ name: f.name, path: f.path, type: f.type })) });
              } else {
                  return Response.json({ success: false, error: 'Impossible de lister les fichiers' }, { status: 400 });
              }
          }

          default:
              return Response.json({ error: 'Action non supportée' }, { status: 400 });
      }

  } catch (error) {
      console.error('Erreur GitHub Manager:', error);
      return Response.json({ error: `Erreur interne: ${error.message}` }, { status: 500 });
  }
});
