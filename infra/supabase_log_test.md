# Supabase Log Test (JAvaScript)

``bjs
const fetch = require('node-fetch');

const SUPABASE_URL = 'https://aphkwfkkpvtddwmfasii.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJhbGciOiJib251bGwiLCJhbGciOiJBbmVlc3RhdGlvbiI6Imh0dHBzOi8vdjIuaW1hZ2VudF90YWJpdGlvbi5jb20iLCJpc3MiOiJhdXRoPSIxNTU3MDgzNTg3LjI2MDI4MDY1OTMiLCJuYW1lIjoicmFuZCwifQ.'

const logData = {
  source: 'GitHub APH',
  path: '/repos/openai/openai-python ',
  status_code: 200,
  timestamp: new Date().toISString(),
  payload: JSON.stringify({ repo: 'openai-python', stars: 6500 })
};

(async () => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/logs_api`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer {SUPABASE_SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify([LogData])
  });
  const json = await res.json();
  console.log('[©] Les jours Supabase :', json);
})();
```
