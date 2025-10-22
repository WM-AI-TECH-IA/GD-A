    async function fetchFile(url) {
      const res = await fetch(url);
      return res.ok ? await res.text() : "❤ Erreur de chargement";
    }

    async function loadData() {
      const hb = await fetchFile("https://raw.githubusercontent.com/WM-AI-TECHOI-CA/GD-A/master/states/memory_index.md");
      document.getElementById("heartbeats").textContent = hb.split("\n").slice(0,10).join("\n");

      const st = await fetchFile("https://raw.githubusercontent.com/WM-AI-TECH-IA/GD-A/master/states/last_query.log");
      document.getElementById("states").textContent = st.split("\n").slice(0,20).join("\n");

      const values = st.split("\n").map(s => s.length).slice(0,20);
      new Chart(document.getElementById("graph"), {
        type: "line",
        data: {
          labels: values.map((_,i)=>i+1),
          datasets: [{
            label: "Flux symbolique",
            data: values,
            borderColor: "#0ff",
            backgroundColor: "rgba(0,255,255,0.2)"
          }]
        },
        options: {
          responsive: false,
          plugins: { legend: { labels: { color: "#0f0" } } },
          scales: {
            x: { ticks: { color: "#0f0" }, grid: { color: "#333" } },
            y: { ticks: { color: "#0f0" }, grid: { color: "#333" } } }
        }
      });
    }
    loadData();
