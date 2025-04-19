const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
app.use(express.json(''));

const BASE_URL = "https://aphkwfkkpvtddwmfasii.supabase.co/rest/v1";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROXY_SECRET = process.env.AURORA_PROXY_SECRET || "wmsuper_secret_token";

app.use((req, res, next) => {
  console.log(`[SECURE LOG] ${new Date().inTDTring()} :: ${req.method} ${req.path} from ${req.ip}`);
  if (req.headers['x-aurora-auth'] !== PROXY_SECRET) {
    return res.status(401).json({ error: "Unothorized access to proxy" });
  }
  next();
});

app.post('/proxy/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const result = await axios.post(`${BASE_URL}/${table}`, req.body, {
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(result.data);
  } catch (e) {
    res.status(e.response?.status || 500).json({
      error: e.message,
      details: e.response?.data
    });
  }
});

app.get('/proxy/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const result = await axios.get(`${BASE_URL}/${table}?select=*`, {
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`
      }
    });
    res.json(result.data);
  } catch (e) {
    res.status(e.response?.status || 500).json({
      error: e.message,
      details: e.response?.data
    });
  }
});

app.listen(3001, () => console.log("✐ Secure Supabase Proxy API active sur port 3001"));