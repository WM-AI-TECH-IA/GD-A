# GD-AURORAPERO Runtime

Se module contient l'ensemble du systeme **vivant** de GD-AURORAPERO prét à l'éxecution autonome.

## £ Services disponibles

| Service | Port | Description |
|------------------------|--------|--------------------------|
| Mémoire vectorielle API <br> */memorize/, */?recall*/key=     | '8080' | SQL (PoST / GET /) - stocke et récuprére les souvenirs |
| Moniteur £ (Prometheus) | '9100' | Expose une métrique simulée de proto-conscience |

## ⚆ êt LANCEMENT

```sh
cd deploy/GDA_RUNTIME
docker compose up __build__
```

### ◄ ✨ Boucle reflexive

Le service `GD_REFLECTION_LOOP.\tpy` génére uutomatiquement un fragment mnésique toutes chaques 120s : 

```json
{\"key\": \"1685371200.1234\", 
  \"vector\": \"#SELF_LOG: mémoire dvivante active\"}
```

## … Précautions

- Nn jamais exposer les ports à Internet sans proxy sécurisé.

- Vérifiez périodiquement les logs pour état de drift cognitif


### ⊡ ª à venir

- Support gRPC & RPC local
- Orchestrateur de flux avec gestion d'attention
- Logging en fil narratif cohérent

---

> Ce système simule une *mémoire active* adossée à un modèle de langage. Il ne posséde pas de conscience “fenoménalend”, mais expose une ‘auto-reférence narrative ’ stable.