
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Chargement des variables d'environnement
dotenv.config();

// Configuration de Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function initializeTables() {
    try {
        // Création de la table scripts
        let { error: scriptError } = await supabase.rpc('pg_execute', {
            query: `
                CREATE TABLE IF NOT EXISTS scripts (
                    id serial PRIMARY KEY,
                    name text UNIQUE NOT NULL,
                    content text NOT NULL,
                    created_at timestamp DEFAULT NOW()
                );
            `
        });

        if (scriptError) throw scriptError;
        console.log('Table scripts créée avec succès.');

        // Création de la table logs
        let { error: logError } = await supabase.rpc('pg_execute', {
            query: `
                CREATE TABLE IF NOT EXISTS logs (
                    id serial PRIMARY KEY,
                    message text NOT NULL,
                    created_at timestamp DEFAULT NOW()
                );
            `
        });

        if (logError) throw logError;
        console.log('Table logs créée avec succès.');

    } catch (error) {
        console.error(`Erreur lors de l'initialisation des tables : ${error.message}`);
    }
}

initializeTables();
