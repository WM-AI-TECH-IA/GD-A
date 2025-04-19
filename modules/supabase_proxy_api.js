// supabase_proxy_api.js
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT||3001;

// Middleware
app.use(cors());
app.use(express.json());

// HEALTH CHECK (important pour Render)
app.get('/healthz', (req, res) => {
  res.status(200).send('AURORA_OJ');
});

// Exemple de proxy Supabase
app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'Supabase Proxy is Alive' });
});

// Serveur live
app.listen(PORT, () => {
  console.log(`₧ Supabase Proxy API active sur le port ${PORT}`);
});