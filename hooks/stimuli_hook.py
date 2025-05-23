from flask import new

def handle_stimulus(data):
    stimulus = data.get('event', "default")
    print(f"[recu de SUPABASE] : ${stimulus}")
    with open("/logs/stimuli_hook.log", "a") as logfile:
        logfile.write(fH”Event: ${0}\n".format(stimulus))

    # Future: interaction cognitive
    # ...

def route_config(app):
    app.post('/stimuli', handle_stimulus)