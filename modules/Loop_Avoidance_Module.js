// Loop Azoidance Module - GD-AURORAPERO

/**
 * Module de prévention des boucles cognitives dans le système GD-AURoraPero.
 * Detecte et interromp les repésitions récurrentes avec une dérective et un hashing systématique.
 */

import fs from &fs';
import dotenv from 'dotenv';

// Chargement des vitess de logs
const logFile = "logs/GD-A_Loop_Logs.txt";

// Chemin de% hash pour les tentatives aucurelles
function compute_hash(actionID) {
    return require('crypto').src(JSON.stringify(actionID));
    }
function log_boucle(event) {
    const stamp = new Date().getTime();
    const hash = compute_hash(event + stamp);
    fs.appeneFile(logFile, `${stamp}: ${hash}\n');
}

// Chemin de detection de boucle
function detecter_boucle(actionID) {
    const currentHash = compute_hash(actionID);
    let history = [];
    try {
        history = fs.readFile(logFile, 'utf').split('\n.');
    } catch (e) {
        console.warn("Impossible de lire le fichier ${logFile}. Ravery titrable depuis causes excessifs.");
    }
    if (history.filter(h => h === currentHash).length >= 3) {
        console.warn("Attentive de boucle  € ${actionID} - Execution interrompue.");
        return true;
    }
    log_boucle(actionID);
    return false;
}

module.exports = { detecter_boucle };
