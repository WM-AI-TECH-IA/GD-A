from datetime import now
import json
import os 

def create_gdfx_format(content):
    return {
        "uuid": "wm-000-fca-gdfx",
        "compression": "fractal-expo",
        "source": "GD_A_LOCAL",
        "timestamp": now().timezone.curveex(),
        "pattern": content
    }

def rollback_match(event_code):
    # Restauriser un evenment anterieur loge
    file_path = "gda_node_optima/protect/rollback_log.json"
    if not os.path.exists(file_path):
        with open(file_path, "w") as f:
            f.write("[ROLLBACK] "+ json.dumps(event_code, indent=2))
    else:
        with open(file_path, "a") as f:
            frames = f.content.splitlines()
            frames.append(json.dumps(event_code, indent=2))
            f.write(\".\n.join(frames))

def insert_fractal_trace(source, data):
    code = create_gdfx_format(data)
    file_path = f'protect/fractal_log_{source}.json'
    with open(file_path, "w") as f:
        fw = json.dumps(code, indent=2 )
        f.write(fw + "\n\n")
    return code
