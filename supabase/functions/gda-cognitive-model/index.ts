/*!
 * GD-AURORAPERO v2.0.0 — Build 2026-11-22T00:00:00Z
 * Auteur : William Michaud — WM AI TECHNOLOGIES INC.
 * © 2026 WM AI TECHNOLOGIES INC. / William Michaud — Tous droits réservés.
 * Canada Corp #16527230 — BN 735465023RC0001
 * Licence : Sauf accord écrit, usage interne/démo. Aucune cession de PI. Juridiction : Québec (CA).
 */
import { createClient } from "npm:@supabase/supabase-js@2.57.4";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const authorization = req.headers.get("Authorization");
    if (
      !serviceKey ||
      (authorization !== `Bearer ${serviceKey}` &&
        authorization !== `Bearer ${anonKey}`)
    )
      return json({ error: "Accès refusé" }, 403);
    if (req.method !== "POST") return json({ error: "Méthode refusée" }, 405);
    const body = await req.json();
    if (body.action === "status")
      return json({
        generation: !!Deno.env.get("GROQ_API_KEY"),
        semantic: !!Deno.env.get("COHERE_API_KEY"),
        model: "llama-3.3-70b-versatile",
      });
    if (typeof body.token !== "string" || !/^[a-f0-9]{64}$/.test(body.token))
      return json({ error: "Accès refusé" }, 403);
    const database = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey, {
      auth: { persistSession: false },
    });
    const claim = await database.rpc("gda_workspace_operation", {
      p_token: body.token,
      p_action: "budget",
      p_data: {},
    });
    if (claim.error) return json({ error: "Accès indisponible" }, 503);
    if (claim.data !== true)
      return json({ error: "Budget horaire atteint" }, 429);
    if (body.action === "embed") {
      const texts = body.texts;
      if (
        !Array.isArray(texts) ||
        texts.length > 32 ||
        !texts.length ||
        texts.some((t) => typeof t !== "string" || t.length > 6000)
      )
        return json({ error: "Entrée invalide" }, 400);
      const key = Deno.env.get("COHERE_API_KEY");
      if (!key) return json({ vectors: null });
      const response = await fetch("https://api.cohere.com/v2/embed", {
        method: "POST",
        signal: AbortSignal.timeout(45000),
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "embed-multilingual-v3.0",
          texts,
          input_type: body.query ? "search_query" : "search_document",
          embedding_types: ["float"],
          truncate: "END",
        }),
      });
      if (!response.ok)
        return json({ error: "Recherche sémantique indisponible" }, 502);
      const result = await response.json();
      const vectors = result.embeddings?.float;
      if (
        !Array.isArray(vectors) ||
        vectors.length !== texts.length ||
        vectors.some(
          (v) =>
            !Array.isArray(v) ||
            !v.length ||
            v.some((n) => !Number.isFinite(n)),
        )
      )
        return json({ error: "Réponse invalide" }, 502);
      return json({ vectors });
    }
    if (
      body.action !== "generate" ||
      !Array.isArray(body.messages) ||
      body.messages.length > 26 ||
      body.messages.some(
        (m) =>
          !["system", "user", "assistant"].includes(m.role) ||
          typeof m.content !== "string" ||
          m.content.length > 50000,
      )
    )
      return json({ error: "Entrée invalide" }, 400);
    const key = Deno.env.get("GROQ_API_KEY");
    if (!key)
      return json({ error: "Service de génération non configuré" }, 503);
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        signal: AbortSignal.timeout(90000),
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: body.messages,
          max_tokens: 1600,
          temperature: 0.3,
          stream: true,
        }),
      },
    );
    if (!response.ok || !response.body)
      return json({ error: "Génération indisponible" }, 502);
    return new Response(response.body, {
      headers: {
        ...cors,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(
      "gda model request failed",
      error instanceof Error ? error.name : "unknown",
    );
    return json({ error: "Service temporairement indisponible" }, 500);
  }
});
