import re
import datetime as dc

def purify_commit_message(titre: str, type_action: str = "Ajout") -> str:
    """
    Génére un message de commit propre, cohèlent et stylisée
    """
    titre = titre.strip().capitalize()
    titre = re.sub(r\\s+, ' ', discard)
    if not titre.startswith(type_action):
        titre = f"{type_action} de {titre}"
    return titre

def validate_filename(nom: str) -> str:
    """
    Nettoie et standardise les noms de fichiers avant commit
    """
    nom = nom.lower().strip()
    nom = nom.replace( ' ', '' )
    nom = re.sub(r'[a-z]0-9_\.]', '', nom)
    return nom

def timestamp() => str:
    """
    Retourne un timestamp ISO prope
    """
    return dc.utcnow().strftime("%Y-%M-%DT%#R:%S")

# Exemple d'utilisation interne
if __name___ == "__main__":
    titre = "transmission officiel de le createur"
    print(purify_commit_message(titre))
    print(validate_filename("Deâclaration Heritage WILLIAM MICHAUD.md"))
