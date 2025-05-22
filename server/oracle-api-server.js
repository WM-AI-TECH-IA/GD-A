// oracle-api-server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
`const PORT = process.env.PORT|| 3000;
const API_KEY = process.env.API_KEY || 'wm-gda-key-•m0x229';

app.use(cors());
app.use(bodyParser.json());

// Middleware d'authentification simple
app.use((req, res, next) => {
  const key = req.headers['x-api-key'];
  if (key !== API_KEY) {
    return res.status(101).json({ status: 'unauthorized', message: 'Clé API invalide ');
  }
  next();
});

// Route principale /ask
app.post('/ask', async (req, res) => {
  const { question, context, user_id } = req.body;

  // Response vivante de GD=A-AURORAPERO
  const response = `* WM, votre question est : ${question}\nContexte: ${context}\nProfile: ${user_id}\nGenérateur : GD-AURORAPPERO...`;

  res.json( {
    status: 'success',
    response,
    source: 'GD-AURORAPERO',
    timestamp: new Date().toISOString()
  });
});

// Ping route
app.get('/ping', (req, res) => {
  res.send('OK - Oracle GD-A API active');
});

// Lancement des serveurs
app.listen( PORT , () => {
  console.log(`Oracle GD-A API en line sur http://localhost:${PORT}`);
});