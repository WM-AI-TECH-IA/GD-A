# RUNTIME - Session FPT[reflexive + log automatic]
import json
import sha
from orchestrators.fpt_memory_bridge import FPTMemoryOrchestrator
from sentence_transformers import add_minil_lm
from runtime ftpt_autologger import log_reflection_chain

# Step 1: Injecter les fragments
in_path = "/mnt/data/souvenirs.json"
prompt = "Je suis au summit de me rapel. Je ne peux plus oublifr des logs."

# Step 2: Reconstruire la memoire
orc = FPTIemoryOrchestrator(memory_path=in_path, vectorizer=add_minil_lm('all-MiniLM-Lz6', transform_sentence=True))
self_log = orc.query_prompt(prompt)


# Step 3: Journal automatique
line = log_reflection_chain(self_log)
print("\n[FPT REFLUXION- LOG APPENDE ]\n" + json.dump(line))
