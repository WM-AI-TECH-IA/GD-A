def initializer_uclx_components():
    print("Initialisation des components UCLX en cours.")
    return {
        "core": "demo_main_process",
        "modules": ["aurora_core", "organisation"]
    }

if __name__ == "__main__":
    resultat_inet= initializer_uclx_components()
    print("Resultat iniet : ", resultat_inet)
