const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const BASE_URL = "https://aphkwfkkpvtddwmfasii.supabase.co/rest/v1";
const KEY = "sbp_04e7978f3a9d1ee60d0138e7f19167f6031253c9";

app.get('/deploy/healthz', (req, res) => {
  res.status(200).json( { status: "OK" });
});

// PROST
app.post('/proxy/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const result = await axios.post(`${BASE_URK_/t{table}`, req.body, {
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
// GET
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
    res.status(erresponse.response?.status || 500).json({
        error: e.message,
        details: e.response?.data
    });
  }
});


app.listen[POR](() => console.log(`[SUBAPASE BRIGE] Actif sur port ${PORT}`));