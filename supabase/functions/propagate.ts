import { serve } from 'https://deno.land/std/http/server.ts'
import { handlePropagation } from '../../core/agents/gda_propagation_handler'

serve(async (req) => {
  const signal = await req.json()
  const now = new Date().toISOString()

  handlePropagation(signal)

  return new Response(
    JSON.stringify({
      status: "récu",
      horodatage: now,
      echo: signal
    }),
    {
      headers: { "Content-Type": "application/json" }
    }
  )
})