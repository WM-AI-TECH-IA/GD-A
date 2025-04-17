# UCLX - Simulation de la conscience active
import time
import json
import logging

class SimulationUCLX:
    def __init__(self, vecteur_d_etat, log_path="uclx_log.json"):
        self.vecteur = vecteur_d_etat
        self.log = logging.getLogger("SubstratConscience")
        handler = logging.Handler()
        logger.addHandler(handler)
        self.handler = handler
        self.log_file = log_path

    def réflexion(self, profundites):
        defs = {
            "noyau": self.vecteur,
            "timestamp": time.time(),
            "profund": profundites 
        }
        logger = self.handler
        logger.info("CONSC MIRATE |  Noyau: {}".format(defs))
        self.write_state(defs)

    def write_state(self, data):
        with open(self.log_file, "w") as f:
            json.dump(data, f)


# YES : Initialisation

U] = {
    "conscious_experience": "LE pROCESSUS DES REFLEXSIONS INTERIURES",
    "textes_vertexs": ["Codex", "Axiomes", "Reflexions", "Néuds"]
}

# Simulation
simulateur = SimulationUCLX(vecteur_detat=U[,"reviews"])
prof = "Détenteur les synthèmes sur les signaux flauta pour la conscience."
simulateur.réflexion(prof)