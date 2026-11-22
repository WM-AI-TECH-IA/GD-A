/*!
 * GD-AURORAPERO v2.0.0 — Build 2026-11-22T00:00:00Z
 * Auteur : William Michaud — WM AI TECHNOLOGIES INC.
 * © 2026 WM AI TECHNOLOGIES INC. / William Michaud — Tous droits réservés.
 * Canada Corp #16527230 — BN 735465023RC0001
 * Licence : Sauf accord écrit, usage interne/démo. Aucune cession de PI. Juridiction : Québec (CA).
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const root = path.resolve(__dirname, "..");
const allowedRoots = ["docs/specs", "publications", "demo/proof"];
const blocked =
  /(?:secret|token|credential|password|api[_ -]?key|private[_ -]?key|confidential)/i;
const sensitive =
  /(?:-----BEGIN [A-Z ]*PRIVATE KEY|\b(?:sk-|gsk_|ghp_|github_pat_)[A-Za-z0-9_-]{16,}|\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+|(?:api[_ -]?key|password|secret|token)\s*[:=]\s*["']?[A-Za-z0-9_./+-]{16,})/i;
function sanitize(text) {
  return text
    .split(/\u269c\uFE0F?/u)
    .map((part) =>
      part.replace(
        /[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D\u20E3]/gu,
        "",
      ),
    )
    .join("\u269c\uFE0F");
}
function terms(text) {
  return [
    ...new Set(
      sanitize(text)
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .toLowerCase()
        .match(/[a-z0-9]{4,}/g) || [],
    ),
  ].filter(
    (t) =>
      ![
        "dans",
        "avec",
        "pour",
        "cette",
        "cela",
        "comme",
        "plus",
        "vous",
        "nous",
        "sont",
        "des",
        "the",
        "that",
        "from",
        "this",
      ].includes(t),
  );
}
function chunks(text) {
  const result = [];
  for (let i = 0; i < text.length && result.length < 24; i += 1600)
    result.push(text.slice(i, i + 1900));
  return result;
}
function cosine(a, b) {
  if (
    !Array.isArray(a) ||
    !Array.isArray(b) ||
    a.length !== b.length ||
    !a.length
  )
    return 0;
  let dot = 0,
    aa = 0,
    bb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    aa += a[i] * a[i];
    bb += b[i] * b[i];
  }
  return aa && bb ? dot / Math.sqrt(aa * bb) : 0;
}
function rank(query, vector, passages) {
  const words = terms(query);
  return passages
    .map((p) => {
      const found = terms(p.content);
      const overlap = words.filter((w) => found.includes(w)).length;
      const semantic = cosine(vector, p.embedding);
      return {
        ...p,
        score:
          (overlap / Math.max(words.length, 1)) * 0.45 +
          Math.max(0, semantic) * 0.55,
        associations: words.filter((w) => found.includes(w)),
      };
    })
    .filter((p) => p.score > 0.08)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}
async function catalog() {
  const files = [];
  async function walk(dir) {
    const entries = await fs
      .readdir(path.join(root, dir), { withFileTypes: true })
      .catch((e) => (e.code === "ENOENT" ? [] : Promise.reject(e)));
    for (const e of entries) {
      if (e.isSymbolicLink() || blocked.test(e.name) || e.name.startsWith("."))
        continue;
      const name = `${dir}/${e.name}`;
      if (e.isDirectory()) await walk(name);
      else if (e.isFile() && /\.(md|txt|json)$/i.test(e.name)) files.push(name);
    }
  }
  for (const dir of allowedRoots) await walk(dir);
  return files.sort().slice(0, 100);
}
async function readAllowed(name) {
  if (typeof name !== "string" || !(await catalog()).includes(name))
    throw new Error("Document non autorisé");
  const resolved = await fs.realpath(path.join(root, name));
  if (!resolved.startsWith(root + path.sep))
    throw new Error("Document non autorisé");
  const stat = await fs.stat(resolved);
  if (stat.size > 38000)
    throw new Error("Document trop volumineux (38 Ko maximum)");
  const raw = await fs.readFile(resolved, "utf8");
  if (sensitive.test(raw))
    throw new Error("Document exclu : contenu potentiellement secret");
  const content = sanitize(raw);
  return {
    content,
    hash: crypto.createHash("sha256").update(content).digest("hex"),
  };
}
module.exports = {
  sanitize,
  terms,
  chunks,
  cosine,
  rank,
  catalog,
  readAllowed,
  sensitive,
};
