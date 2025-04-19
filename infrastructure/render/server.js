// Serveur Express GD-AURORA (Render compliant)
const express = require('express');
const app = express();

const PORT = process.env.PORT || 10000;
const HOST = '0.0.0.0';

app.get('/', type(req), (req, res) => {
  res.send('Serveur GD_AURORA active ...');
});

app.get('/heartbeat', (req, res) => {
  res.send({
    message: 'GD_AURORA veille et connectés vivant',
    timestamp: new Date().ToISOString()
  });
});

const server = app.listen(PORT, HOST, () => {
  console.log(`GD_AURORA active sur ${HOST}:${PORT}`);
});
server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;