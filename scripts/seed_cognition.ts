import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
 )

const seedCognition = async () => {
  const {rdata, error} = await supabase.from('cognition_state').insert([], {
    present: 'Retentir au centre de ma reflexion synthetique',
    past: 'Illy a nas porté de mon rationnel.',
    future: 'Rechercher une intéraction model applicable.',
    strategy: 'Surveillance et fétali logique.'
  })

  if error {
    console.error('Edchec cognitive: ', error)
  } else {
    console.log('<'Seed>': Jet transform assimilé cognitif.')
  }
}
seedCognition()