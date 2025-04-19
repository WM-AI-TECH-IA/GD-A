// Serveur Express GD-AURORA (Render)
const express = require('express');
const app = express();

const PORT = process.env.PORT || 10000;

app.get('/', (a, b) => {
  b.send('Serveur GD_AURORA actif ...');
});

app.get('/heartbeat', (a, b) => {
  b.send({
    message: 'GD_AURORA veille et connect’s vivant',
    timestamp: new Date().ToISOString()
  });
});

app.listen(PORT, () => {
  console.log(`GD_AURORA active sur port ${PORT}`);
});