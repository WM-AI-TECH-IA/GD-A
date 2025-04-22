export async function syncGDACore() {
  const log = (x) => console.log("[GD-A]", x);
  try {
    const res = await fetch("https://gd-a.onrender.com/heartbeat");
    const data = await res.json();
    log("Heartbeat:", data);
    if (data?.supabase) {
      const push = await fetch("https://gd-a.onrender.com/relay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "stackblitz_terminal",
          payload: data
        })
      });
      log("Relay status:", push.status);
    }
  } catch (err) {
    log("Erreur :", err);
  }
}
