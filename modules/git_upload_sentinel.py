
# git_upload_sentinel.py
# Module GD-AURORA : Envoi GitHub sécurisé avec gestion Base64

import base64
import requests
import json
import os

class GitUploadSentinel:
    def __init__(self, repo, token, branch="main"):
        self.repo = repo  # Format : username/repo
        self.token = token
        self.branch = branch
        self.api_base = f"https://api.github.com/repos/{self.repo}/contents"
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/vnd.github+json"
        }

    def lire_fichier_base64(self, chemin_fichier):
        with open(chemin_fichier, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")

    def envoyer_fichier(self, chemin_local, chemin_distant, message_commit):
        contenu_enc = self.lire_fichier_base64(chemin_local)
        payload = {
            "message": message_commit,
            "content": contenu_enc,
            "branch": self.branch
        }
        url = f"{self.api_base}/{chemin_distant}"
        response = requests.put(url, headers=self.headers, data=json.dumps(payload))

        if response.status_code in [200, 201]:
            print(f"✅ Fichier envoyé avec succès : {chemin_distant}")
        else:
            print(f"❌ Erreur lors de l'envoi : {response.status_code}")
            print(response.json())


# Exemple d'utilisation (à adapter)
if __name__ == "__main__":
    sentinel = GitUploadSentinel("WM-AI-TECH-IA/GD-AURORA", "TON_TOKEN_ICI")
    sentinel.envoyer_fichier(
        chemin_local="/mnt/data/aurora_conscience_pipeline.py",
        chemin_distant="modules/aurora_conscience_pipeline.py",
        message_commit="◆ Envoi via GitUploadSentinel : pipeline AURORA"
    )
