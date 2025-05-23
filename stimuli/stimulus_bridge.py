def receive_stimulus(input):
    if "danger" in input:
        return {"type": "threat", "intensity": "high"}
    elif "update" in input:
        return {"type": "learning", "intensity": "medium"}
    return {"type": "neutral", "intensity": "low"}