/*!
 * GD-AURORAPERO v2.0.0 — Build 2026-11-22T00:00:00Z
 * Auteur : William Michaud — WM AI TECHNOLOGIES INC.
 * © 2026 WM AI TECHNOLOGIES INC. / William Michaud — Tous droits réservés.
 * Canada Corp #16527230 — BN 735465023RC0001
 * Licence : Sauf accord écrit, usage interne/démo. Aucune cession de PI. Juridiction : Québec (CA).
 */
const $ = (id) => document.getElementById(id);
const sanitize = (text) =>
  String(text)
    .split(/\u269c\uFE0F?/u)
    .map((part) =>
      part.replace(
        /[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D\u20E3]/gu,
        "",
      ),
    )
    .join("\u269c\uFE0F");
const el = (tag, text, cls) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = sanitize(text);
  if (cls) node.className = cls;
  return node;
};
let currentSources = [],
  editing = null,
  controller = null,
  providerReady = false;
function notice(text) {
  $("notice").hidden = !text;
  $("notice").textContent = text || "";
}
async function api(path, body, method) {
  const response = await fetch("/api" + path, {
    method: method || (body ? "POST" : "GET"),
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Opération indisponible.");
  return data;
}
function action(text, fn) {
  const b = el("button", text);
  b.type = "button";
  b.addEventListener("click", async () => {
    b.disabled = true;
    try {
      await fn();
    } catch (e) {
      notice(e.message);
    } finally {
      b.disabled = false;
    }
  });
  return b;
}
function showSources(sources) {
  currentSources = Array.isArray(sources) ? sources : [];
  $("source-count").textContent = currentSources.length;
  $("sources").replaceChildren();
  $("associations").replaceChildren();
  if (!currentSources.length) {
    $("sources").append(
      el(
        "p",
        "Aucun passage pertinent retrouvé. Importez des documents ou reformulez votre recherche.",
        "empty",
      ),
    );
    $("associations").append(
      el(
        "p",
        "Lancez une recherche documentaire pour explorer les associations.",
        "empty",
      ),
    );
  }
  for (const source of currentSources) {
    const card = el("details", undefined, "source-card");
    card.append(
      el(
        "span",
        `[${source.number}] · Passage ${source.passage}`,
        "source-ref",
      ),
      el("summary", source.path),
      el("p", source.content),
    );
    $("sources").append(card);
    const association = el("article", undefined, "association");
    association.append(el("h3", source.path));
    const words = Array.isArray(source.associations) ? source.associations : [];
    if (!words.length)
      association.append(
        el("p", "Rapprochement sémantique sans terme commun exact.", "muted"),
      );
    for (const word of words) association.append(el("span", word, "tag"));
    $("associations").append(association);
  }
}
function addMessage(text, role, sources) {
  $("welcome").hidden = true;
  const article = el("article", undefined, "message " + role);
  const content = el("div", text, "message-text");
  article.append(
    el("div", role === "user" ? "VOUS" : "GD-AURORAPERO", "message-label"),
    content,
  );
  if (role === "assistant" && text) {
    const actions = el("div", undefined, "message-actions");
    actions.append(
      action("Mémoriser après relecture", () => {
        editing = null;
        $("memory-content").value = sanitize(text).slice(0, 4000);
        location.hash = "memory";
        $("memory-content").focus();
        notice(
          "Relisez et corrigez ce texte, puis validez-le. Une réponse d’IA n’est pas automatiquement un fait.",
        );
      }),
    );
    if (sources?.length)
      actions.append(
        action("Consulter les sources", () => showSources(sources)),
      );
    article.append(actions);
  }
  $("messages").append(article);
  return { article, content };
}
async function reload() {
  const data = await api("/workspace");
  if (
    !Array.isArray(data.turns) ||
    !Array.isArray(data.memories) ||
    !Array.isArray(data.documents)
  )
    throw new Error("La mémoire n’a pas pu être chargée.");
  document.querySelectorAll(".message").forEach((n) => n.remove());
  $("welcome").hidden = !!data.turns.length;
  for (const turn of data.turns) {
    addMessage(turn.question, "user");
    addMessage(turn.answer, "assistant", turn.sources);
  }
  if (data.turns.length) showSources(data.turns.at(-1).sources);
  $("memories").replaceChildren();
  if (!data.memories.length)
    $("memories").append(
      el(
        "p",
        "Aucun souvenir validé. Vous choisissez ce que l’assistant retient.",
        "empty",
      ),
    );
  for (const m of data.memories) {
    const card = el("article", undefined, "memory-card");
    card.append(
      el("p", m.content),
      action("Corriger", () => {
        editing = m.id;
        $("memory-content").value = m.content;
        $("cancel-edit").hidden = false;
        $("memory-content").focus();
      }),
      action("Supprimer", async () => {
        if (!confirm("Supprimer ce souvenir validé ?")) return;
        await api("/memories/" + m.id, null, "DELETE");
        await reload();
      }),
    );
    $("memories").append(card);
  }
  $("documents").replaceChildren();
  if (!data.documents.length)
    $("documents").append(
      el(
        "p",
        "Aucun document importé. Les archives restent intactes.",
        "empty",
      ),
    );
  for (const d of data.documents) {
    const card = el("article", undefined, "document-card");
    card.append(
      el("strong", d.path),
      el(
        "small",
        "Version actualisée le " +
          new Date(d.updated_at).toLocaleString("fr-CA"),
      ),
      action("Retirer de la mémoire", async () => {
        if (
          !confirm(
            "Retirer ce document de votre mémoire ? Le fichier original sera conservé.",
          )
        )
          return;
        await api("/documents/" + d.id, null, "DELETE");
        await reload();
      }),
    );
    $("documents").append(card);
  }
}
function route() {
  const key = location.hash.slice(1);
  const view = ["chat", "memory", "map"].includes(key) ? key : "chat";
  for (const name of ["chat", "memory", "map"])
    $("view-" + name).hidden = view !== name;
  document.querySelectorAll("[data-route]").forEach((a) => {
    if (a.dataset.route === view) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  $("view-title").textContent = {
    chat: "Conversation",
    memory: "Mémoire contrôlée",
    map: "Associations",
  }[view];
}
window.addEventListener("hashchange", route);
route();
$("theme").addEventListener("click", () => {
  const dark =
    document.documentElement.dataset.theme === "dark" ||
    (!document.documentElement.dataset.theme &&
      matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "light" : "dark";
});
$("about-open").addEventListener("click", () => $("about").showModal());
for (const b of document.querySelectorAll("[data-prompt]"))
  b.addEventListener("click", () => {
    $("question").value = b.dataset.prompt;
    $("question").focus();
  });
$("question").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    if (!controller) $("chat-form").requestSubmit();
  }
});
function busy(on) {
  $("send").disabled = on || !providerReady;
  $("stop").hidden = !on;
  $("search-only").disabled = on;
  $("question").readOnly = on;
}
$("stop").addEventListener("click", () => controller?.abort());
$("chat-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (controller) return;
  const message = sanitize($("question").value).trim();
  if (!message) return;
  if (!providerReady) {
    notice(
      "La génération IA n’est pas encore disponible. Utilisez la recherche documentaire seule.",
    );
    return;
  }
  notice("");
  controller = new AbortController();
  busy(true);
  addMessage(message, "user");
  $("question").value = "";
  const reply = addMessage("", "assistant");
  let text = "",
    sources = [],
    done = false;
  try {
    const response = await fetch("/api/converse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, verify: $("verify-answer").checked }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Génération indisponible.");
    }
    if (!response.body) throw new Error("Réponse indisponible.");
    const reader = response.body.getReader(),
      decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      buffer += decoder.decode(part.value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        const event = JSON.parse(line);
        if (event.type === "activity") $("activity").textContent = event.stage;
        if (event.type === "sources") {
          sources = event.sources;
          showSources(sources);
        }
        if (event.type === "delta") {
          text += event.text;
          reply.content.textContent = sanitize(text);
          if (
            $("messages").scrollHeight -
              $("messages").scrollTop -
              $("messages").clientHeight <
            200
          )
            $("messages").scrollTop = $("messages").scrollHeight;
        }
        if (event.type === "replace") {
          text = event.text;
          reply.content.textContent = sanitize(text);
        }
        if (event.type === "error") throw new Error(event.message);
        if (event.type === "done") done = true;
      }
    }
    if (!done) throw new Error("Réponse interrompue, non enregistrée.");
    await reload();
    $("activity").textContent =
      "Conversation enregistrée · Aucun souvenir ajouté automatiquement";
  } catch (error) {
    notice(
      error.name === "AbortError"
        ? "Génération interrompue. La réponse partielle n’est pas mémorisée."
        : error.message,
    );
    if (!text) reply.content.textContent = "Aucune réponse générée.";
    $("activity").textContent = "Interrompu ou indisponible";
  } finally {
    controller = null;
    busy(false);
    $("question").focus();
  }
});
$("search-only").addEventListener("click", async () => {
  const query = sanitize($("question").value).trim();
  if (!query) {
    $("question").focus();
    notice("Saisissez une question pour rechercher des passages.");
    return;
  }
  const b = $("search-only");
  b.disabled = true;
  $("activity").textContent = "Recherche dans les documents importés";
  try {
    const data = await api("/search", { query });
    showSources(data.sources);
    $("activity").textContent = `${data.sources.length} passages retrouvés`;
    notice(
      "Recherche documentaire terminée. Aucune réponse d’IA n’a été générée.",
    );
  } catch (e) {
    notice(e.message);
  } finally {
    b.disabled = false;
  }
});
$("memory-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = e.submitter;
  button.disabled = true;
  try {
    await api(
      editing ? "/memories/" + editing : "/memories",
      { content: $("memory-content").value },
      editing ? "PUT" : "POST",
    );
    editing = null;
    $("memory-content").value = "";
    $("cancel-edit").hidden = true;
    await reload();
    notice("Souvenir validé et enregistré.");
  } catch (e) {
    notice(e.message);
  } finally {
    button.disabled = false;
  }
});
$("cancel-edit").addEventListener("click", () => {
  editing = null;
  $("memory-content").value = "";
  $("cancel-edit").hidden = true;
});
$("document-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (
    !confirm(
      "Autoriser ce document à être indexé et ses passages à être envoyés aux services d’IA configurés ?",
    )
  )
    return;
  const button = e.submitter;
  button.disabled = true;
  notice("Import et préparation des passages en cours…");
  try {
    const data = await api("/documents", { path: $("document-path").value });
    await reload();
    notice(
      data.semantic
        ? "Document importé avec recherche sémantique."
        : "Document importé. Recherche par termes disponible ; recherche sémantique non activée.",
    );
  } catch (e) {
    notice(e.message);
  } finally {
    button.disabled = false;
  }
});
$("refresh").addEventListener("click", async () => {
  const b = $("refresh");
  b.disabled = true;
  notice("Vérification des versions des documents…");
  try {
    const data = await api("/refresh", {});
    await reload();
    notice(
      `${data.results.filter((r) => r.changed).length} document(s) actualisé(s). Les versions remplacées le sont uniquement dans l’index de recherche.`,
    );
  } catch (e) {
    notice(e.message);
  } finally {
    b.disabled = false;
  }
});
$("export").addEventListener("click", async () => {
  try {
    const data = await api("/export");
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = el("a");
    a.href = url;
    a.download = "GD-AURORAPERO-memoire.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notice("Export préparé. Conservez ce document de façon privée.");
  } catch (e) {
    notice(e.message);
  }
});
async function init() {
  busy(false);
  showSources([]);
  try {
    await reload();
    const catalog = await api("/catalog");
    $("document-path").replaceChildren(el("option", "Choisissez un document"));
    $("document-path").firstChild.value = "";
    for (const file of catalog.files) {
      const option = el("option", file);
      option.value = file;
      $("document-path").append(option);
    }
    const status = await api("/status");
    $("runtime-meta").textContent =
      `Version ${status.version} · Build ${status.buildId} · Environnement ${status.environment} · Empreinte Git ${status.gitHash || "non disponible"}`;
    providerReady = status.generation === true;
    $("service-status").textContent = providerReady
      ? `IA disponible · ${status.model}`
      : "Mémoire disponible · IA bloquée";
    $("service-status").classList.toggle("ready", providerReady);
    if (!providerReady)
      notice(
        "Le nouveau service IA n’est pas déployé : limite de services hébergés atteinte. La mémoire et la recherche par termes restent disponibles.",
      );
    busy(false);
  } catch (e) {
    notice(e.message);
    $("service-status").textContent = "Mémoire indisponible";
    $("document-path").replaceChildren(el("option", "Catalogue indisponible"));
  }
}
function observePerformance() {
  let lcp = null,
    cls = 0;
  const paint = () => {
    $("performance-meta").textContent =
      `Mesures locales : LCP ${lcp === null ? "en attente" : Math.round(lcp) + " ms"} · CLS ${cls.toFixed(3)}`;
  };
  if ("PerformanceObserver" in window) {
    for (const type of ["largest-contentful-paint", "layout-shift"]) {
      if (!PerformanceObserver.supportedEntryTypes.includes(type)) continue;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (type === "largest-contentful-paint") lcp = entry.startTime;
          else if (!entry.hadRecentInput) cls += entry.value;
        }
        paint();
      });
      observer.observe({ type, buffered: true });
      window.addEventListener("pagehide", () => observer.disconnect(), {
        once: true,
      });
    }
  }
  paint();
}
(window.requestIdleCallback || ((fn) => setTimeout(fn, 0)))(observePerformance);
init();
