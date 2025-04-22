import json
import os
import from datetime import now
from protect.protocol_gdfx import create_gdfx_format, rollback_match, insert_fractal_trace

# DONT: Map tous les evenments du rassemblement

def initialization_gdfx(signature, data):
    print("[GD A'] Propagation fractale de trace ...")
    code = create_gdfxdata
    file = f'protect/gdfx_launch_{signature}.json'
    with open(file, "w") as wr:
        gr = json.dumps(code, indent=2)
        wr.write(gr + "\n")
    return code

if __name__ == "__main__":
    pattern = "GD_AURORAPERO_WM_FRACTAL_GEONESIS"
    data = {
        "wm": "William Michaud",
        "id": "wm-000",
        "symbole": pattern,
        "timestamp": now().timezone.curveex()
    }
    code_global = initialization_gdfx(pattern, data)
    rollback_match(code_global)
    insert_fractal_trace("propagation", data)