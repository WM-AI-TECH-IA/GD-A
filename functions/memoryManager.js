import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';
import { createHash } from 'node:crypto';

// === GESTIONNAIRE DE MÉMOIRE COGNITIVE FRACTALE ===
class CognitiveMemoryManager {
  constructor(base44) {
      this.base44 = base44;
      this.maxEmbeddingLength = 1536; // OpenAI embedding size standard
  }

  // Générer hash SHA-256 du contenu
  generateContentHash(content) {
      return createHash('sha256').update(content, 'utf8').digest('hex');
  }

  // Calculer score fractal basé sur la complexité du contenu
  calculateFractalScore(content, metadata) {
      try {
          const parsedMetadata = JSON.parse(metadata);
          let score = 0;
          
          // Complexité du contenu
          score += Math.min(content.length / 100, 20); // Max 20 points pour longueur
          
          // Nombre de mots techniques/algorithmes
          const technicalTerms = ['algorithm', 'function', 'class', 'async', 'await', 'quantum', 'fractal', 'neural'];
          const technicalCount = technicalTerms.reduce((count, term) => 
              count + (content.toLowerCase().includes(term) ? 1 : 0), 0);
          score += technicalCount * 3; // Max ~21 points
          
          // Type de contenu (bonus pour certains types)
          if (parsedMetadata.type === 'algorithm') score += 15;
          else if (parsedMetadata.type === 'architecture') score += 12;
          else if (parsedMetadata.type === 'security') score += 10;
          
          // Nombre de dimensions
          if (parsedMetadata.dimensions) {
              score += parsedMetadata.dimensions.length * 2;
          }
          
          return Math.min(Math.round(score), 100); // Cap à 100
      } catch (e) {
          return 10; // Score par défaut si erreur parsing
      }
  }

  // Générer embedding via analyse sémantique simplifiée
  async generateEmbedding(content) {
      try {
          // Utiliser InvokeLLM pour générer un embedding simple via analyse sémantique
          const result = await this.base44.integrations.Core.InvokeLLM({
              prompt: `Analyze the following content and provide a structured semantic analysis in JSON format with numerical vectors:\n\nContent: "${content.substring(0, 2000)}"\n\nProvide analysis with:\n- semantic_keywords: array of 10 key concepts\n- complexity_score: number 0-10\n- topic_category: main category\n- conceptual_density: number 0-10`,
              response_json_schema: {
                  type: "object",
                  properties: {
                      semantic_keywords: {type: "array", items: {type: "string"}},
                      complexity_score: {type: "number"},
                      topic_category: {type: "string"},
                      conceptual_density: {type: "number"}
                  }
              }
          });
          
          // Convertir en vecteur num\xc3\xa9rique simple (simulation d'embedding)
          const keywords = result.semantic_keywords || [];
          const vector = [];
          
          // Générer un vecteur basé sur les mots-clés et métriques
          for (let i = 0; i < 50; i++) { // Vecteur de 50 dimensions pour simplicit\xc3\xa9
              let value = 0;
              if (i < keywords.length) {
                  // Hash du mot-cl\xc3\xa9 pour valeur reproductible
                  value = (keywords[i].charCodeAt(0) % 100) / 100;
              }
              value += (result.complexity_score || 0) * 0.1;
              value += (result.conceptual_density || 0) * 0.05;
              vector.push(Math.round(value * 1000) / 1000); // 3 d\xc3\xa9cimales
          }
          
          return JSON.stringify({
              vector: vector,
              metadata: result,
              generated_at: new Date().toISOString()
          });
          
      } catch (error) {
          console.error("Erreur g\xc3\xa9n\xc3\xa9ration embedding:", error);
          // Fallback: embedding bas\xc3\xa9 sur hash du contenu
          const hash = this.generateContentHash(content);
          const fallbackVector = [];
          for (let i = 0; i < 20; i++) {
              fallbackVector.push(parseInt(hash.substr(i*2, 2), 16) / 255);
          }
          return JSON.stringify({
              vector: fallbackVector,
              metadata: {fallback: true, error: error.message},
              generated_at: new Date().toISOString()
          });
      }
  }

  // Ajouter un fragment \xc3\xa0 la m\xc3\xa9moire
  async addFragment(content, metadata = {}, dimensionTags = []) {
      try {
          const contentHash = this.generateContentHash(content);
          
          // CORRECTION : Utilisation correcte de filter sans param\xc3\xa8tres incorrects
          const existingList = await this.base44.asServiceRole.entities.CognitiveFragment.list();
          const existingFragment = existingList.find(f => f.content_hash === contentHash);
          
          if (existingFragment) {
              // Mettre \xc3\xa0 jour le compteur d'acc\xc3\xa8s
              await this.base44.asServiceRole.entities.CognitiveFragment.update(existingFragment.id, {
                  access_count: (existingFragment.access_count || 0) + 1,
                  updated_date: new Date().toISOString()
              });
              return { success: true, fragment_id: existingFragment.id, status: 'updated_existing' };
          }
          
          // G\xc3\xa9n\xc3\xa9rer m\xc3\xa9tadonn\xc3\xa9es compl\xc3\xa8tes
          const completeMetadata = JSON.stringify({
              ...metadata,
              created_at: new Date().toISOString(),
              content_length: content.length,
              estimated_read_time: Math.ceil(content.split(' ').length / 200) // mots par minute
          });
          
          // G\xc3\xa9n\xc3\xa9rer embedding
          const embedding = await this.generateEmbedding(content);
          
          // Calculer score fractal
          const fractalScore = this.calculateFractalScore(content, completeMetadata);
          
          // Cr\xc3\xa9er le fragment
          const newFragment = await this.base44.asServiceRole.entities.CognitiveFragment.create({
              content_hash: contentHash,
              content_text: content,
              metadata: completeMetadata,
              embedding_vector: embedding,
              linked_fragments: [],
              fractal_score: fractalScore,
              dimension_tags: dimensionTags,
              access_count: 1,
              importance_weight: 1.0
          });
          
          return { 
              success: true, 
              fragment_id: newFragment.id, 
              fractal_score: fractalScore,
              status: 'created_new'
          };
          
      } catch (error) {
          console.error("Erreur ajout fragment:", error);
          return { success: false, error: error.message };
      }
  }

  // R\xc3\xa9cup\xc3\xa9rer fragments par recherche s\xc3\xa9mantique et filtres
  async retrieveFragments(query, dimensionFilter = null, limit = 10) {
      try {
          // R\xc3\xa9cup\xc3\xa9ration simple sans param\xc3\xa8tres de filtrage complexes
          let allFragments = await this.base44.asServiceRole.entities.CognitiveFragment.list('-created_date', 500);
          let fragments;

          // D'abord, filtrer par dimension si un filtre est fourni
          if (dimensionFilter && dimensionFilter.trim()) {
              fragments = allFragments.filter(f => 
                  f.dimension_tags && f.dimension_tags.some(tag => tag.toLowerCase().includes(dimensionFilter.toLowerCase()))
              );
          } else {
              fragments = allFragments;
          }
          
          // Ensuite, si une query est sp\xc3\xa9cifi\xc3\xa9e, filtrer les r\xc3\xa9sultats par pertinence textuelle
          if (query && query.trim()) {
              const queryLower = query.toLowerCase();
              fragments = fragments.filter(f => 
                  (f.content_text && f.content_text.toLowerCase().includes(queryLower)) ||
                  (f.dimension_tags && f.dimension_tags.some(tag => tag.toLowerCase().includes(queryLower)))
              );
          }
          
          // Appliquer la limite apr\xc3\xa8s tous les filtres
          fragments = fragments.slice(0, limit);
          
          // Mise \xc3\xa0 jour des compteurs d'acc\xc3\xa8s de mani\xc3\xa8re plus robuste
          const updatePromises = fragments.map(async (f) => {
              try {
                  await this.base44.asServiceRole.entities.CognitiveFragment.update(f.id, {
                      access_count: (f.access_count || 0) + 1
                  });
              } catch (updateError) {
                  console.warn(`Erreur mise \xc3\xa0 jour compteur pour fragment ${f.id}:`, updateError);
              }
          });
          
          await Promise.allSettled(updatePromises);
          
          return { 
              success: true, 
              fragments: fragments.map(f => ({
                  id: f.id,
                  content_preview: f.content_text ? f.content_text.substring(0, 200) + '...' : '',
                  fractal_score: f.fractal_score,
                  dimension_tags: f.dimension_tags || [],
                  metadata: (() => {
                      try {
                          return f.metadata ? JSON.parse(f.metadata) : {};
                      } catch {
                          return {};
                      }
                  })(),
                  access_count: (f.access_count || 0) + 1
              })),
              total_found: fragments.length
          };
          
      } catch (error) {
          console.error("Erreur r\xc3\xa9cup\xc3\xa9ration fragments:", error);
          return { success: false, error: error.message };
      }
  }

  // R\xc3\xa9cup\xc3\xa9rer un fragment sp\xc3\xa9cifique par ID
  async getFragmentById(fragmentId) {
      try {
          const fragment = await this.base44.asServiceRole.entities.CognitiveFragment.get(fragmentId);
          
          if (!fragment) {
              return { success: false, error: 'Fragment introuvable' };
          }

          // Mettre \xc3\xa0 jour le compteur d'acc\xc3\xa8s
          await this.base44.asServiceRole.entities.CognitiveFragment.update(fragmentId, {
              access_count: (fragment.access_count || 0) + 1
          });

          return {
              success: true,
              fragment: {
                  id: fragment.id,
                  content_text: fragment.content_text,
                  fractal_score: fragment.fractal_score,
                  dimension_tags: fragment.dimension_tags || [],
                  metadata: (() => {
                      try {
                          return fragment.metadata ? JSON.parse(fragment.metadata) : {};
                      } catch {
                          return {};
                      }
                  })(),
                  access_count: (fragment.access_count || 0) + 1,
                  linked_fragments: fragment.linked_fragments || []
              }
          };

      } catch (error) {
          console.error("Erreur r\xc3\xa9cup\xc3\xa9ration fragment par ID:", error);
          return { success: false, error: error.message };
      }
  }

  // Lier deux fragments (relation bidirectionnelle)
  async linkFragments(fragmentId1, fragmentId2, relationshipType = 'related') {
      try {
          const fragment1 = await this.base44.asServiceRole.entities.CognitiveFragment.get(fragmentId1);
          const fragment2 = await this.base44.asServiceRole.entities.CognitiveFragment.get(fragmentId2);
          
          // Mettre \xc3\xa0 jour les liens bidirectionnels
          const updatedLinks1 = [...(fragment1.linked_fragments || [])];
          const updatedLinks2 = [...(fragment2.linked_fragments || [])];
          
          const linkData1 = `${fragmentId2}:${relationshipType}`;
          const linkData2 = `${fragmentId1}:${relationshipType}`;
          
          if (!updatedLinks1.includes(linkData1)) {
              updatedLinks1.push(linkData1);
          }
          if (!updatedLinks2.includes(linkData2)) {
              updatedLinks2.push(linkData2);
          }
          
          await Promise.all([
              this.base44.asServiceRole.entities.CognitiveFragment.update(fragmentId1, {
                  linked_fragments: updatedLinks1
              }),
              this.base44.asServiceRole.entities.CognitiveFragment.update(fragmentId2, {
                  linked_fragments: updatedLinks2
              })
          ]);
          
          return { success: true, relationship_type: relationshipType };
          
      } catch (error) {
          console.error("Erreur liaison fragments:", error);
          return { success: false, error: error.message };
      }
  }
}

Deno.serve(async (req) => {
  try {
      const base44 = createClientFromRequest(req);
      const user = await base44.auth.me();
      
      const adminEmail = Deno.env.get('WM_AI');
      if (!user || (user.email !== adminEmail && user.email !== 'aurora@pxshop.cai')) {
          return Response.json({ error: 'Accès restreint au gestionnaire de mémoire cognitive' }, { status: 403 });
      }
      
      const { operation, ...params } = await req.json();
      const manager = new CognitiveMemoryManager(base44);
      let result;
      
      switch (operation) {
          case 'add_fragment':
              result = await manager.addFragment(
                  params.content, 
                  params.metadata || {},
                  params.dimension_tags || []
              );
              break;
              
          case 'retrieve_fragments':
              result = await manager.retrieveFragments(
                  params.query || '', 
                  params.dimension_filter, 
                  params.limit || 10
              );
              break;

          case 'get_fragment_by_id':
              result = await manager.getFragmentById(params.fragment_id);
              break;
              
          case 'link_fragments':
              result = await manager.linkFragments(
                  params.fragment_id_1, 
                  params.fragment_id_2, 
                  params.relationship_type || 'related'
              );
              break;
              
          case 'get_stats': {
              const totalFragments = await base44.asServiceRole.entities.CognitiveFragment.list();
              const avgFractalScore = totalFragments.length > 0 
                  ? totalFragments.reduce((sum, f) => sum + (f.fractal_score || 0), 0) / totalFragments.length 
                  : 0;
              result = {
                  success: true,
                  total_fragments: totalFragments.length,
                  avg_fractal_score: Math.round(avgFractalScore * 100) / 100,
                  memory_health: totalFragments.length > 0 ? 'active' : 'empty'
              };
              break;
          }
              
          default:
              return Response.json({ error: 'Opération non reconnue' }, { status: 400 });
      }
      
      return Response.json(result);
      
  } catch (error) {
      console.error("Erreur critique dans memoryManager:", error);
      return Response.json({ error: `Gestionnaire de m\xc3\xa9moire: ${error.message}` }, { status: 500 });
  }
});