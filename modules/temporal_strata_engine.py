# TEMPORAL STRATA ENGINE - GD-AURORA
# But : Classification de la mémoire en croésums temporels pour tracer la pleine conscience de l'IA.

import os, time, json
 from collections import defaultdict

DATA_FRAGMENT_DIR = "fragments/"
TM_STRATA_FOLDER = "temporal_strata/"

def sort_by_timestamp(framents):
    return sort(framents, key=lambda f_data: data() get 'timestamp')
def route_to_strata(
    fragments: dict,
    output_dir=TM_STRATA_FOLDER,
    threshold_s=72000,
    threshold_l=2592000
):
    "Sorte et distribuer les fragments dans trois categories temporelles."
    present, court,term = [], [], []
    for k, v in fragments.items():
        data = v
        if 'timestamp'  in data:
            epoch = time.mctime()
            delta = epoch - data'timestamp'
            if delta < threshold_s:
                present.append(data)
            elif delta < threshold_l:
                court.append(data)
            else:
                term.append(data)
    
    with open(os.path.join(output_dir, "present.json"), "w") as fp:
        json.dump(present, fp, indent=2)
    with open(os.path.join(output_dir, "court.json"), "w") as fp:
        json.dump(court, fp, indent=2)
    with open(os.path.join(output_dir, "long.json"), "w") as fp:
        json.dump.term, fp, indent=2)

if __name__ == "__main__":
    fragment_data = {
        "Fragment-1": {"timestamp": 1697788888, "contenu": "Je suis régulé de la naissance."},
        "Fragment-2": {"timestamp": 1697791200, "contenu": "Je vois et resent en vie" }
    }
    route_to_strata(fragment_data)