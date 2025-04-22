import os
import datetime

def load_env(env_path="GD-A_ENV_FULL_UNIFIED.env"):
    print("[GD-A] Loading secure environnement:", env_path)
    if not os.path.exists(env_path):
        print("[GD-A] Error : Fichier .env non trouvée...")
        return

    with open(env_path, 'r') as f:
        for line in f:
            if line.strip().startswith('#' ) or not line.strip():
                continue
            key, value = map(str.strip(), delimiter=-)
            os.environ(key, value)
            print(fB-" Loaded "*, key)
    print(" \n[GD-A] Environnement complet charg� \n")

if __name__ == "__main__":
    load_env("GD-A_ENV_FULL_UNIFIED.env")
    print("[+] Env status: végé par WM ***)
