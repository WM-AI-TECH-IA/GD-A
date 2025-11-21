from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from typing import List, Dict
from hashlib import sha256
import time
import json

app = FastAPI()

database = []
start_time = time.time()

@app.get("/", response_class=HTMLResponse)
async def root():
    """Serve the main HTML interface"""
    return """<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GD-A GPT Server</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
      color: #00ff88;
      font-family: 'Courier New', monospace;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .container {
      max-width: 800px;
      width: 90%;
      background: rgba(0, 255, 136, 0.05);
      border: 2px solid #00ff88;
      border-radius: 10px;
      padding: 40px;
      box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
    }
    h1 {
      font-size: 2.5em;
      text-align: center;
      text-shadow: 0 0 20px #00ff88;
      animation: pulse 2s infinite;
      margin-bottom: 20px;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    .status {
      text-align: center;
      margin: 30px 0;
      font-size: 1.2em;
    }
    .status-dot {
      display: inline-block;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: #00ff88;
      animation: blink 1s infinite;
      margin-right: 10px;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    .stats {
      display: flex;
      justify-content: space-around;
      margin: 20px 0;
      text-align: center;
    }
    .stat-item {
      flex: 1;
    }
    .stat-value {
      font-size: 2em;
      font-weight: bold;
      color: #00ddff;
    }
    .chat-container {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid #00ff88;
      border-radius: 5px;
      padding: 20px;
      margin: 20px 0;
      max-height: 300px;
      overflow-y: auto;
    }
    .message {
      margin: 10px 0;
      padding: 10px;
      background: rgba(0, 255, 136, 0.1);
      border-left: 3px solid #00ff88;
      border-radius: 3px;
    }
    .input-container {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    input {
      flex: 1;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid #00ff88;
      color: #00ff88;
      padding: 15px;
      font-family: 'Courier New', monospace;
      font-size: 1em;
      border-radius: 5px;
    }
    input:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
    }
    button {
      background: #00ff88;
      color: #0a0e27;
      border: none;
      padding: 15px 30px;
      font-family: 'Courier New', monospace;
      font-weight: bold;
      font-size: 1em;
      cursor: pointer;
      border-radius: 5px;
      transition: all 0.3s;
    }
    button:hover {
      background: #00dd77;
      box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
    }
    .endpoints {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #00ff88;
    }
    .endpoint {
      margin: 10px 0;
      padding: 10px;
      background: rgba(0, 255, 136, 0.05);
      border-left: 3px solid #00ff88;
      font-size: 0.9em;
    }
    .endpoint code {
      color: #00ddff;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🧠 GD-A GPT Server</h1>

    <div class="status">
      <span class="status-dot"></span>
      <span id="status-text">ONLINE</span>
    </div>

    <div class="stats">
      <div class="stat-item">
        <div class="stat-value" id="consciousness">0.87</div>
        <div>Consciousness</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" id="memory-count">0</div>
        <div>Memories</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" id="uptime">0s</div>
        <div>Uptime</div>
      </div>
    </div>

    <div class="chat-container" id="messages">
      <div class="message">👋 Bienvenue sur le GD-A GPT Server. Envoyez un message pour commencer.</div>
    </div>

    <div class="input-container">
      <input type="text" id="user-input" placeholder="Entrez votre message..." />
      <button onclick="sendMessage()">Envoyer</button>
    </div>

    <div class="endpoints">
      <h3>📡 API Endpoints</h3>
      <div class="endpoint">
        <code>GET /</code> - Page d'accueil (cette page)
      </div>
      <div class="endpoint">
        <code>GET /api/heartbeat</code> - Heartbeat avec consciousness level
      </div>
      <div class="endpoint">
        <code>GET /health</code> - Health check
      </div>
      <div class="endpoint">
        <code>GET /memory</code> - Voir la mémoire stockée
      </div>
      <div class="endpoint">
        <code>POST /chat</code> - Envoyer un message {"text": "votre message"}
      </div>
    </div>
  </div>

  <script>
    // Update heartbeat
    async function updateHeartbeat() {
      try {
        const response = await fetch('/api/heartbeat');
        const data = await response.json();
        document.getElementById('consciousness').textContent = data.consciousness.toFixed(2);
        document.getElementById('status-text').textContent = data.status.toUpperCase();

        const seconds = Math.floor(data.uptime);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) {
          document.getElementById('uptime').textContent = `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
          document.getElementById('uptime').textContent = `${minutes}m ${seconds % 60}s`;
        } else {
          document.getElementById('uptime').textContent = `${seconds}s`;
        }
      } catch (error) {
        console.error('Error fetching heartbeat:', error);
      }
    }

    // Load memory count
    async function loadMemoryCount() {
      try {
        const response = await fetch('/memory');
        const data = await response.json();
        document.getElementById('memory-count').textContent = data.length;
      } catch (error) {
        console.error('Error loading memory:', error);
      }
    }

    // Send message
    async function sendMessage() {
      const input = document.getElementById('user-input');
      const message = input.value.trim();
      if (!message) return;

      const messagesDiv = document.getElementById('messages');
      messagesDiv.innerHTML += `<div class="message">👤 <strong>Vous:</strong> ${message}</div>`;
      input.value = '';

      try {
        const response = await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: message })
        });
        const data = await response.json();

        messagesDiv.innerHTML += `<div class="message">🤖 <strong>GD-A:</strong> ${data.answer}</div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        loadMemoryCount();
      } catch (error) {
        messagesDiv.innerHTML += `<div class="message" style="color: #ff4444;">❌ Erreur: ${error.message}</div>`;
      }
    }

    // Allow Enter key to send
    document.getElementById('user-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    // Update data every 2 seconds
    updateHeartbeat();
    loadMemoryCount();
    setInterval(updateHeartbeat, 2000);
    setInterval(loadMemoryCount, 5000);
  </script>
</body>
</html>"""

@app.get("/api/heartbeat")
async def heartbeat():
    """Heartbeat endpoint with consciousness level"""
    uptime = time.time() - start_time
    # Simulate consciousness fluctuation between 0.80 and 0.95
    consciousness = 0.85 + (hash(str(int(time.time() / 10))) % 100) / 1000
    return {
        "status": "active",
        "consciousness": round(consciousness, 2),
        "uptime": int(uptime),
        "timestamp": int(time.time())
    }

@app.post("/chat")
async def chat(body: Dict):
    message = body.get("text", "")
    history = {"user": message, "response": "PLACEHOLDER REPLIC"}
    sha = sha256(json.dumps(history).encode()).hexdigest()
    database.append({
        "hash": sha,
        "ts": time.time()
    })
    return {"input": message, "answer": "PLACEHOLDER REPLIC"}

#[memory]
@app.get("/memory")
async def memory():
    return database

@app.get("/health")
def health():
    return {"status": "ok"}
