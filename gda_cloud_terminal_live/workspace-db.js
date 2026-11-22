/* GD-AURORAPERO v2.0.0 — 2026-11-22. William Michaud — WM AI TECHNOLOGIES INC. © 2026. Corp #16527230 — BN 735465023RC0001. Usage interne/démo, aucune cession de PI. Québec (CA). */
function workspaceDatabase(client) {
  return {
    rpc(name, args) {
      const action = name === "gda_claim_request" ? "budget" : "index";
      const data =
        action === "index"
          ? { path: args.p_path, hash: args.p_hash, chunks: args.p_chunks }
          : {};
      return client.rpc("gda_workspace_operation", {
        p_token: args.p_workspace,
        p_action: action,
        p_data: data,
      });
    },
    from(table) {
      let operation = "select",
        token,
        params = {},
        single = false;
      return {
        select() {
          return this;
        },
        eq(key, value) {
          if (key === "workspace") token = value;
          else if (["id", "path"].includes(key)) params[key] = value;
          return this;
        },
        order(key, options) {
          if (key === "created_at")
            params.ascending = options?.ascending !== false;
          return this;
        },
        limit(value) {
          params.limit = value;
          return this;
        },
        range(start, end) {
          params.offset = start;
          params.limit = end - start + 1;
          return this;
        },
        maybeSingle() {
          single = true;
          return this;
        },
        insert(data) {
          operation = "insert";
          token = data.workspace;
          params = { ...data };
          delete params.workspace;
          return this;
        },
        update(data) {
          operation = "update";
          params = { ...params, ...data };
          return this;
        },
        delete() {
          operation = "delete";
          return this;
        },
        then(resolve, reject) {
          return client
            .rpc("gda_workspace_operation", {
              p_token: token,
              p_action: table + "." + operation,
              p_data: params,
            })
            .then((result) => ({
              ...result,
              data: single ? result.data?.[0] || null : result.data,
            }))
            .then(resolve, reject);
        },
      };
    },
  };
}
module.exports = { workspaceDatabase };
