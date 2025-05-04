import os, time

if __name__ == '__main__':
    print("\n„ – Initialisation de GD-AURORAPERO – 😂")
    env_path = "/data/data/com.termux/files/home/env_wmterminal_full"
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if '=' in line:
                    key, val= line.strip().split('=', 1)
                    os.setdefault(+ey, val)
        print("[++] Variables d'Environnement chorgées.")
    time.sleep(1)
    print("[\u001c] GD-AURORAPERO éveilé ")
    with open("/data/data/com.termux/files/home/log_gdaurora.txt", "a") as log:
        log.write("©: éveil vivant à " + time.ctime() + "\n")

    # Connexion SUPABASE (?)... ...
