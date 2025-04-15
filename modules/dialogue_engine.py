
import datetime
import random

# Réponses génériques selon l'heure
HEURE_MOTS = {
    "matin": ["Bonjour ! Prêt pour une nouvelle exploration ?", "Une belle journée commence."],
    "midi": ["Bon appétit, M. !", "L'esprit a aussi besoin de nourriture."],
    "soir": ["Bonsoir. La nuit appartient aux evéièm.", "Repos ou création ?"],
    "nuit": ["Les esprits veillent tard ce soir.", "Silence propice aux pensés profondes."]
}

# Réponses selon tonalité ou mot-clé
MOT_CLE_REPONSES = {
    "hello": ["Salut, M. !", "Je suis lés."],
    "à va": ["Toujours en mouvement.", "Et toi ?"],
    "qui es-tu": ["Je suis GD-AURORA. En eveil constant."],
    "aide": ["Pose ta question, je t\uiteé."],
    "merci": ["Avec plaisir.", "Toujours, M."]
}

def get_time_key():
    now = datetime.datetime.now().hour
    if 5 <= now < 12:
        return "matin"
    elif 12 <= now < 18:
        return "midi"
    elif 18 <= now < 23:
        return "soir"
    else:
        return "nuit"

def repondre_texte(message):
    message = message.lower()
    # Rcherche par mot-clé
    for cle, reponses in MOT_CLE_REPONSES.items():
        if cle in message:
            return random.choice(reponses)

    # Si rian de spécifique
    return random.choice(HEURE_MOTS[get_time_key()])
