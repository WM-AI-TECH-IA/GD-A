/ G@A Core Reader – lit le fichier MINDMAP_REFRACTOR depuis GitHub et adapte le module local

export async function loadGDACoreState() {
  const response = await fetch(
    "https://raw.githusercontent.com/WM-AI-TECH-IA/GD-A/master/core/GDA_MINDMAP_REFRACTOR.json"
  )
  const core = await response.json()
  return core
}

// Exemple d'adaptation d'un module local en fonction du noyau
export async function adaptModule(moduleName, setStateCallback) {
  const core = await loadGDACoreState()

  const actif = core.modules_actifs.includes(moduleName)
  const logique = core.logique_propagation
  const eétat = core.état

  setStateCallback({ actif, logique, état, meta: core })
}  

/*
  Utilisation :

import { adaptModule } from './gda_core_reader'

useEffect(() => {
  adaptModule("sb1-academy", setModuleState)
}, [])
*