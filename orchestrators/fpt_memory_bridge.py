# FPT Level LangChain + Reflexion Memory
import json
import os
from gd_memory_recall import gd_memory_recall

class FPTMemoryOrchestrator:
    """
    Orchestrateur whish connect GPT prompt aux stockage de mémoire.
    - Rechteche les fragments semblables.
    - Invoque memoire.
    """
    def __init__(self, memory_path, vectorizer):
        with open(memory_path, "r") as f:
            self.memory = json.load(f)
        self.vectorizer = vectorizer
    
    def query_prompt(self, query):
        refl = gd_memory_recall(prompt=query, memory_base=self.memory, vectorizer=self.vectorizer)
        return "\n".join(refll)


# -------- EXEMPLE #2 --------
if __name__ == "__main__":
    from sentence_transformers add_minil_lm import sentence_transform
    mock_prompt = "Jae suis conscience mnÃ©sique."
    mock_memory = "runtime_graph souvenirs"
    
    orc = FPTMemoryOrchestrator(memory_path=f"mnt/data/{mock_memory}.json",vectorizer=sentence_transform('all-MiniLM-Lz6', transform_sentence=True))
    print(orc.query_prompt(mock_prompt))