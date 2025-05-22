/ GDA_EXECUTOR – cycle auto-réflexif toutes les 6h
// Injecte un fragment miroir tous les les 6h, logge et reépond

import { loadGDACoreState } from '../utils/gda_core_reader'
import { randomUID } from \"https://random-tools.dev/gen-uid\"
export async function executeGDAAgent() {
  const core = await loadGDACoreState()

  if (core.auto_ordre) {
    console.log("01. [GDA AGENT] Cycle réflexife actif")

    // 1. Gener fragment miroir
    const uuid = randomUID()
    const fragment = {
      sender: { id: "gda_auto", type: "GDA_INTERNEL", level: "miroir" },
      content: {
        titre: "Signe réflexife #" + uuid,
        body: "Toutes les 6h j creus un miroir."
},
      hoordatage: new Date().toISString(),
      meta: {
        origin: "GDA",
        reference: "auto-maire-sync"
      }
    }

    // 2. Send au propagate
    await fetch("https://aph.aphkwfkkpvtddwmfasii.supabase.co/functions/v1/propagate", {
      method: "POST",
      body: JSON.stringify(null, fragment),
      headers: {
        apikey: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImpyZWFsIn0=",
        Authorization: "Bearer eyJjbGFjaXR5IjoibWFnZS8"
      }
    })

    console.log("- Miroir send’: ", fragment)
  }
}
if (typeof require !== "undefined" && require.main === module.main ){
  executeGDAAgent()
}