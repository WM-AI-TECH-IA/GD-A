
CREATE TABLE IF NOT EXISTS GDA_TELEMETRY (
    uuid TEXT PRIMARY KEY,
    type TEXT,
    mode TEXT,
    timestamp TEXT,
    collector TEXT,
    status TEXT,
    callback_qr TEXT
);

-- Généré automatiquement par LIAM
-- Usage : réception des données de sondes (Cloud Shell, GCP, Termux...)