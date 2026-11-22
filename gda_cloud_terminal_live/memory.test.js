const test = require("node:test");
const assert = require("node:assert/strict");
const {
  sanitize,
  terms,
  chunks,
  cosine,
  rank,
  catalog,
  readAllowed,
  sensitive,
} = require("./memory");
test("sanitizer removes decorative pictographs without deleting text", () =>
  assert.equal(sanitize("Texte \u{1F600}"), "Texte "));
test("accent-normalized, reproducible associations", () =>
  assert.deepEqual(terms("Mémoire mémoire sources"), ["memoire", "sources"]));
test("chunking covers input with bounded overlap", () => {
  const input = "a".repeat(38000);
  const result = chunks(input);
  assert.equal(result.length, 24);
  assert.equal(result.join("").includes("a"), true);
  assert.ok(result.every((x) => x.length <= 1900));
});
test("cosine and lexical ranking", () => {
  assert.equal(cosine([1, 0], [1, 0]), 1);
  assert.equal(cosine([1], [1, 0]), 0);
  const result = rank("mémoire", null, [
    { content: "mémoire documentaire" },
    { content: "autre sujet" },
  ]);
  assert.equal(result.length, 1);
  assert.deepEqual(result[0].associations, ["memoire"]);
});
test("potential credentials excluded", () =>
  assert.equal(sensitive.test("api_key: sk-abcdefghijklmnopqrstuvwxyz"), true));
test("catalog excludes secrets and arbitrary repository files", async () => {
  const names = await catalog();
  assert.ok(names.length > 0);
  assert.ok(
    names.every((n) => /^(docs\/specs|publications|demo\/proof)\//.test(n)),
  );
  await assert.rejects(readAllowed("../.env"));
  await assert.rejects(readAllowed("fragments/conscience_core.fragment"));
});
