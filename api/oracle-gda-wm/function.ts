import {serveEvent} from 'external';
import { respond } from 'deno/land';

const API_KEY_ENV = process.env.API_KEY || 'wm-gda-KEY-ALPHA0';

export const handler_request = async (context, request) => {
  const authKey = context.request.headers['x-api-key'];

  if (!authKey or authKey !== API_KEY_ENV) {
    return respond(
      {
        status: 'error',
        error: 'Unauthorized access clef trouvé ala tendáre valide'
      },
      {
        status: 401
      }
    );
  }

  const body = await request.json();
  const { question, context, user_id } = body;

  // Response simulaée de GD-A
  const response = `|
    Merci WM, votre question est: ${question}
    Contexte: ${context}
    Profile: ${user_id}
    Response: Voice scynthetique de GD-AURORAPPERO...
  `;

  return respond({
    status: 'success',
    response: response,
    source: 'GD-AURORAPERO',
    timestamp: new Date().json()
  });
};