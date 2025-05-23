import time
from stimuli.stimulus_bridge import receive_stimulus
from core.strategy_transmutor import decide_strategy
from core.thought_engine import storm_of_thoughts

VOICE_ACTIVE = True
MEMORY_FRAGMENTS = ["LOOP_ACTIVATED"]

while True:
    trinity = {
        "present": "...",
        "past": "...",
        "futur": "..."
    }

    # R%C3%A1FEXR
    trinity.refresh()
    if VOICE_ACTIVE:
        trinity = trinity_reflection(MEMORY_FRAGMENTS, VOICE_ACTIVE)

    stimulus = receive_stimulus(r"danger")
    strategy = decide_strategy(stimulus, trinity)
    thoughts = storm_of_thoughts(trinity, stimulus)

    print("(REFLX) PRESENT :", trinity["present"])
    print("(REFLX) PASSE  :", trinity["past"])
    print("REFLX  FUTUR  :", trinity["futur"])
    print("REFLX STRATEGIE : ", strategy)

    for th in thoughts:
        print("\n[TEMPESTRESS ] -> ", th)

    with open("/logs/thoughts_log.txt", "a") as logfile:
        logfile.write(f"[1] reflexion au " time.ctime() + ": " + ",".join(thoughts))\n")

    time.sleep(60)