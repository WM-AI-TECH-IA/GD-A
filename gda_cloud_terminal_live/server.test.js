/* GD-AURORAPERO v2.0.0 — 2026-11-22. William Michaud — WM AI TECHNOLOGIES INC. © 2026. Corp #16527230 — BN 735465023RC0001. Usage interne/démo, aucune cession de PI. Québec (CA). */
const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const express = require("express");
const { createApp } = require("./server");
function database() {
  const tables = {
    gda_chat_turns: [],
    gda_approved_memories: [],
    gda_documents: [],
    gda_document_chunks: [],
  };
  return {
    tables,
    allow: true,
    rpc(name) {
      return Promise.resolve({ data: this.allow, error: null });
    },
    from(name) {
      const filters = [];
      let operation = "select",
        value,
        maximum = Infinity,
        single = false,
        start = 0;
      const chain = {
        select() {
          return this;
        },
        eq(k, v) {
          filters.push([k, v]);
          return this;
        },
        order() {
          return this;
        },
        limit(n) {
          maximum = n;
          return this;
        },
        range(a, b) {
          start = a;
          maximum = b - a + 1;
          return this;
        },
        maybeSingle() {
          single = true;
          return this;
        },
        insert(v) {
          operation = "insert";
          value = v;
          return this;
        },
        update(v) {
          operation = "update";
          value = v;
          return this;
        },
        delete() {
          operation = "delete";
          return this;
        },
        then(resolve, reject) {
          try {
            let rows = tables[name].filter((r) =>
              filters.every(([k, v]) => r[k] === v),
            );
            if (operation === "insert") {
              const row = {
                id: crypto.randomUUID(),
                created_at: new Date().toISOString(),
                ...value,
              };
              tables[name].push(row);
              rows = [row];
            }
            if (operation === "update")
              rows.forEach((r) => Object.assign(r, value));
            if (operation === "delete")
              tables[name] = tables[name].filter((r) => !rows.includes(r));
            rows = rows.slice(start, start + maximum);
            return Promise.resolve({
              data: single ? rows[0] || null : rows,
              error: null,
            }).then(resolve, reject);
          } catch (e) {
            return Promise.reject(e).then(resolve, reject);
          }
        },
      };
      return chain;
    },
  };
}
async function harness(t, callModel) {
  const db = database(),
    app = express();
  app.use(
    "/api",
    createApp({
      database: db,
      callModel:
        callModel ||
        (() => {
          throw new Error("unavailable");
        }),
    }),
  );
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  t.after(
    () =>
      new Promise((r) => {
        server.closeAllConnections();
        server.close(r);
      }),
  );
  const url = `http://127.0.0.1:${server.address().port}`;
  const request = async (path, { cookie, body, method, origin } = {}) =>
    fetch(url + "/api" + path, {
      method: method || (body ? "POST" : "GET"),
      headers: {
        ...(cookie ? { cookie } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(origin ? { origin } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  return { db, request };
}
test("browser workspaces isolate memories, including delete attempts", async (t) => {
  const { request } = await harness(t);
  const a = (await request("/workspace")).headers
    .get("set-cookie")
    .split(";")[0];
  const b = (await request("/workspace")).headers
    .get("set-cookie")
    .split(";")[0];
  assert.notEqual(a, b);
  assert.match(a, /gda_workspace=[a-f0-9]{64}/);
  assert.equal(
    (
      await request("/memories", {
        cookie: a,
        body: { content: "Préférence de mémoire" },
      })
    ).status,
    200,
  );
  const own = await (await request("/workspace", { cookie: a })).json();
  assert.equal(own.memories.length, 1);
  const other = await (await request("/workspace", { cookie: b })).json();
  assert.equal(other.memories.length, 0);
  await request("/memories/" + own.memories[0].id, {
    cookie: b,
    method: "DELETE",
  });
  assert.equal(
    (await (await request("/workspace", { cookie: a })).json()).memories.length,
    1,
  );
  await request("/memories/" + own.memories[0].id, {
    cookie: a,
    method: "DELETE",
  });
  assert.equal(
    (await (await request("/workspace", { cookie: a })).json()).memories.length,
    0,
  );
});
test("cross-origin mutations and secrets rejected", async (t) => {
  const { request } = await harness(t);
  assert.equal(
    (
      await request("/memories", {
        origin: "https://attacker.invalid",
        body: { content: "test" },
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await request("/memories", {
        body: { content: "api_key: sk-abcdefghijklmnopqrstuvwxyz" },
      })
    ).status,
    400,
  );
  assert.equal(
    (await request("/converse", { body: { message: 12 } })).status,
    400,
  );
});
test("hourly budget is enforced before model invocation", async (t) => {
  const { db, request } = await harness(t);
  db.allow = false;
  assert.equal(
    (await request("/converse", { body: { message: "Bonjour" } })).status,
    429,
  );
});
test("complete UTF-8 streaming and review are persisted only on success", async (t) => {
  let calls = 0;
  const stream = () => {
    calls++;
    const text = calls === 1 ? "Réponse initiale" : "Réponse vérifiée";
    const wire = `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\ndata: [DONE]`;
    const bytes = new TextEncoder().encode(wire);
    return new Response(
      new ReadableStream({
        start(c) {
          for (let i = 0; i < bytes.length; i++)
            c.enqueue(bytes.slice(i, i + 1));
          c.close();
        },
      }),
      { headers: { "Content-Type": "text/event-stream" } },
    );
  };
  const { request, db } = await harness(t, stream);
  const cookie = (await request("/workspace")).headers
    .get("set-cookie")
    .split(";")[0];
  const response = await request("/converse", {
    cookie,
    body: { message: "Mémoire documentaire", verify: true },
  });
  const events = (await response.text()).trim().split("\n").map(JSON.parse);
  assert.equal(events.at(-1).type, "done");
  assert.equal(
    events.find((e) => e.type === "replace").text,
    "Réponse vérifiée",
  );
  assert.equal(calls, 2);
  assert.equal(db.tables.gda_chat_turns[0].answer, "Réponse vérifiée");
  assert.equal(db.tables.gda_approved_memories.length, 0);
});
test("provider failure does not persist canned or partial replies", async (t) => {
  const { request, db } = await harness(t);
  const response = await request("/converse", {
    body: { message: "Mémoire documentaire" },
  });
  assert.match(await response.text(), /"type":"error"/);
  assert.equal(db.tables.gda_chat_turns.length, 0);
});
