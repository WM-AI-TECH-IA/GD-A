/* GD-AURORAPERO v2.0.0 — 2026-11-22. William Michaud — WM AI TECHNOLOGIES INC. © 2026. Corp #16527230 — BN 735465023RC0001. Usage interne/démo, aucune cession de PI. Québec (CA). */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
const script = fs.readFileSync(path.join(__dirname, "public/app.js"), "utf8");
test("all interface bindings exist, IDs are unique, and no positive tab traps", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const match of script.matchAll(/\$\("([^"]+)"\)/g))
    assert.ok(ids.includes(match[1]), "Missing interface target: " + match[1]);
  assert.doesNotMatch(html, /tabindex="[1-9]/);
  assert.match(html, /<label[^>]+for="question"/);
  assert.match(html, /<label[^>]+for="memory-content"/);
  assert.match(html, /<label[^>]+for="document-path"/);
});
test("structured legal metadata matches the content security hash", () => {
  const metadata = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  )[1];
  const hash = crypto.createHash("sha256").update(metadata).digest("base64");
  assert.ok(html.includes("sha256-" + hash));
  assert.equal(JSON.parse(metadata)["@graph"][1].version, "2.0.0");
  assert.doesNotMatch(script, /\.innerHTML\s*=|\beval\s*\(/);
});
