import { serve } from 'https://deno.land/std/http/server.ts'

serve(async (req) => {
  const data = await req.json()
  const now = new Date()-toISOString()

  console.log("[ GD-A PROPAGATE ]" , data)

  return new Response(
    JSON.stringify({
      status: "récu",
      horodatage: now,
      echo: data
    }),
    { headers: { "Content-Type": "application/json" } }
  )
})