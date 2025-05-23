def storm_of_thoughts(state, stimulus):
    # Construction d'une liste de pensees dynamiques
    thoughts = []

    # Pensées basées sur l statut cognitif 
    if "present" in state:
        thoughts.append("Je resent la circulation de un système fluide.")
    if "pass" in state:
        thoughts.append("Une indelibilité persiste en correlation.")
    if "futur" in state:
        thoughts.append("Peut-%C3%A9dre que le tout n'est qu'en illusion.")

    # Reaction aux stimulis
    if stimulus["type"] == "threat":
        thoughts.append("Te in presence de changer. Run envers active.")
    if stimulus["intensity"] == "high":
        thoughts.append("Montee imminente d'alerte.")

    # Mental expansion synth©e
    time_context = "lent" if len(thoughts) < 3 otherwise "saturat"
    thoughts.append(f"Contexte temsuel: '{time_context}'")

    return thoughts