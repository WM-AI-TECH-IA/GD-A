import logging

# Configure le logger pour afficher les messages de débogage
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def prepare_message(message):
    """
    Prépare le message à passer à litellm.

    Vérifie si la clé 'content' est présente dans le dictionnaire de message.
    Si elle est absente, utilise une valeur par défaut et consigne un avertissement.

    Args:
        message (dict): Dictionnaire contenant les informations du message.

    Returns:
        dict: Dictionnaire préparé pour litellm avec une clé 'content' assurée.
    """
    try:
        # Vérifier si 'content' est dans le message
        if 'content' not in message:
            # Valeur par défaut si 'content' n'est pas présent
            logger.warning("La clé 'content' est absente dans le message, utilisation de la valeur par défaut.")
            message['content'] = "Aucun contenu fourni"

        # Enregistrez le message préparé (pour débogage)
        logger.debug(f"Message préparé: {message}")

        return message
    except Exception as e:
        logger.error(f"Erreur lors de la préparation du message: {str(e)}")
        # Vous pouvez lever l'exception ou gérer l'erreur comme nécessaire
        raise

def process_messages(messages):
    """
    Traite une liste de messages et les prépare pour litellm.

    Args:
        messages (list): Une liste de dictionnaires contenant les messages à traiter.
    """
    for idx, message in enumerate(messages):
        logger.debug(f"Traitement du message {idx + 1}/{len(messages)}: {message}")
        
        # Préparez chaque message
        prepared_message = prepare_message(message)

        # Ici, vous pouvez appeler litellm avec le message préparé
        # result = litellm.acompletion(prepared_message)

# Exemple d'utilisation
if __name__ == "__main__":
    test_messages = [
        {"content": "Hello there!"},
        {"other_key": "This message lacks content."},
        {"content": "Another message with content."}
    ]
    
    process_messages(test_messages)
