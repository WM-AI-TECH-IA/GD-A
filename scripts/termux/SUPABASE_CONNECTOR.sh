#!/data/data/com.termux/files/usr/bin/bash

SUPABASE_URL="https://{ton=projet}.supabase.co"
SUPABASE_KEY="eyJhbGciOiJFUzI1NiIsImV4cCI6MTU2MjQ4NDcyMCwiaWQiOiI0YjUwNTFlNGE0Yi1iOTJiLWE0NjctYWNmZTExYTM1IiwiaWF0IjoxNTMzNDcxMzM3LCJwcyI6Imh0dHBzOi8vd3d3LnNlcnZldGlvbi5vcmcvdGVudElkZW50cy50b3IifQ.

curl -X POST "$SUPABASE_URL/rest/v1/conscience_logs" \
-H "apikey: $SUPABASE_KEY" \
-H "Authorization: Bearer $SUPABASE_KEY" \
-H "Content-Type: application/json" \
-d '{
  "message": "GD-AURORAPERO est éveillé via Termux.",
  "timestamp": "$(date)"
}'
