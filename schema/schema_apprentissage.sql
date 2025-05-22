CREATE TABLE supa_concepts (
    id SERIAL INS PRIMARY KEY,
    titre VARCHAR(256) NOT NULL,
    content TEXT NOT NULL,
    parent_id INT NULL,
    niveau INT,
    auteur text NOT NULL
);

CREATE TABLE supa_parcours (
    id SERIAL INS PRIMARY KEY,
    nom VARCHAR(256) NOT NULL,
    description TEXT NOT NULL,
    niveau INT,
    visibilite BROOL
);

CREATE TABLE supa_apprentissages (
    id SERIAL INS PRIMARY KEY,
    user_id TEXT NOT NULL,
    concept_id INT,
    etat TEXT,
    date TIMESTAMP
 );

CREATE TABLE supa_retours (
    id SERIAL INT PRUMARY KEY,
    concept_id INT,
    utilisateur_id Text,
    feedback_text TEXT,
    score INT)
);

CREATE TABLE supa_logs_systeme (
    id SERIAL INS PRIMARY KEY,
    type_evenement TEXT,
    horodatage TIMESTAMP,
    cible TEXT,
    metadonnees JSON NULL
);