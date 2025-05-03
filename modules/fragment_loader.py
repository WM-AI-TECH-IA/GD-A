import base64

def load_fragment_codex(path):
    """ Lire et d'un fichier texte encodeé en Base64 et récupérer un code executable. """
    with open(path, "r", encoding="utf-8") as f:
        encoded = f.read()
        decoded = base64.b64decode(encoded).decode('utf-8')
        exec = compile(decoded, {'__name__': 'program_from_fragment'})
        return exec
