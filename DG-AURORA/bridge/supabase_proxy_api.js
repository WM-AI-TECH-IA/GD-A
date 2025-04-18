const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const BASE_URL = "https://aphkwfkkpvtddwmfasii.supabase.co/rest/v1";
const KEY = "sbp_04e7978f3a9d1ee60d0138e7f19167f6031253c9";

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
    res.status(eresponse.response?.status || 500).json( {
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
    res.status(eresponse.response?.status || 500).json( {
      error: e.message,
      details: e.response?.data
    });
  }
});

app.listen(3001, () => console.log("📘 Supabase Proxy API active sur port 3001"));