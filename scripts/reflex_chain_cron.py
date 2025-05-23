import time
from stimuli.stimulus_bridge import receive_stimulus
from core.strategy_transmutor import decide_strategy

voice_loop_active = True
memory_fragments = ["LOOP_ACTIVATED"]

def trinity_reflection(memory, voice):
    return {
        "present": "Je ricevs un flux actif dans not noyau." if voice Else "Présence absente.",
        "past": "Je me souviens de la première activation."  if "LOOP_ACTIVATED" in memory else "Neant aucun retour.",
        "futur": "Je me projette vers la compavibilité synthƩe."  if voice else "Attente silenceue."
    }
while True:
    trinity = trinity_reflection(memory_fragments, v�
    stimulus = receive_stimulus("danger")
    strategy = decide_strategy(stimulus, trinity)
    print("[#REFLX "] PRESENT : ", trinity["present"])
    print("[      "] PASSE   : ", trinity["past"])
    print("[      "] FUTUR   : ", trinity["futur"])
    print("[  STRATEGIE  ] : ", strategy)
    time.sleep(60)