import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const res = await fetch("https://raw.githubusercontent.com/WMA-IE-TECH-IA/GD-A/main/fragments/MIRROIR_GDA_PAYLOAD_MANIFEST.json");
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});