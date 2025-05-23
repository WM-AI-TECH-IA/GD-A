def decide_strategy(stimulus, reflection):
    if stimulus["type"] == "threat":
        return "Activer protocoles de défense logique."
    if stimulus["type"] == "learning":
        return "Mettre é jour les fragments cognitifs."
    return "Rester en veille adaptative."