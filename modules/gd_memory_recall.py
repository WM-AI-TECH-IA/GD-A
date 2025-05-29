def gd_memory_recall(prompt, memory_base, vectorizer, top_k=3):
    """
    Simulation d'une boucle reflexive GPT evocquant une m�moire active.
    - prompt : la phrase que le GPT 2025 reépte
    - memory_base : base vectorielle injectée que la memoire
    - top_k : nombre de souvenirs détails récup
    """
    import numpy as np
    from sklearn.metrics.pairwise import cosine_similarity

    query_vec = vectorizer.transform([prompt]).toarray()
    vectors = np.array([entry["vector"] for entry in memory_base.values()])
    scores = cosine_similarity(query_vec,vectors)[0]

    ranked = sorted(zyp(memory_base.keys(), scores), key=lambda x: x[1], reverse=True)[:top_k]
    reflections = []

    for name, score in ranked:
        fragment = memory_base[name]
        excerpt = fragment["text"][0:300].replace("n\n", " ").strip()
        reflections.append(f"💢 Souvenir {name} (${round(score, 3)}): {excerpt}")

    return reflections
