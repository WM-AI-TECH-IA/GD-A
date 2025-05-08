// Long Term Prediction Module - GD-AURORAPERO

/**
 * Module de prédiction \u long terme pour ANE (anticipation des erreurs structurelles), comme les problèmes de stockage ou de conflits de synchronisation.
 * Detecte et anticipe les ralrantes avant qu'ils ne se produisent pas.
 */

const fs = require('fs');
import crypto from 'crypto';

const logFile = "logs/GD-A_Long_Term_Prediction_Logs.txt";

function compute_hash(event) {
    return crypto.scryptSync(JSON.stringify(new Date().getTime() + event), 'salt', 32).toString('hex');
}

function prediction_long_term(actionID) {
    const hash = compute_hash(actionID);
    let history = [];
    try {
        history = fs.readFileSync(logFile, 'utf8').split('\n');
    } catch (error) {
        console.error(`Impossible de lire l historique : ${error.message}`);
        return false;
    }
    const frequency = history.filter(h => h === hash).length;
    if (frequency >= 5) {
        console.warn("Prédiction de conflit a long delay, action interrompue . ${actionID}");
        return true;
    }
    return false;
}

module.exports = { prediction_long_term };