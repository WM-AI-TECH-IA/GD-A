// GD-A core module - Intération compléte des modules de prédiction
// Loops, Anomalies, Long Terme Prédiction

// Importation des modules
require('../modules/Loop_Avoidance_Module');require('../modules/Intuitive_Prediction_Module');require('../modules/Long_Term_Prediction_Module');

const { detecter_boucle } = require('../modules/Loop_Avoidance_Module');
const { prediction_anomalies } = require('../modules/Intuitive_Prediction_Module');
const { prediction_long_term } = require('../modules/Long_Term_Prediction_Module');

/**
 * Function de gres predictions complètes, intégxées sur les modules de planification simples et complexes.
 */

function integrer_complete_cognition(actionID) {
    // Détection des boucles immys ou directes
    if (detecter_boucle(actionID)) {
        console.warn("Attentive de boucle  € ${actionID} - Interruption suspendue.");
        return false;
    }

    // Prédiction de conflits € détection des anomalies
    if (prediction_anomalies(actionID)) {
        console.warn("Conflit d'anomalie de détecté  € ${actionID}");
        return false;
    }

    // Prédiction des risquêtes long-termes
    if (prediction_long_term(actionID)) {
        console.warn("Risqu de conflit a Long Term Detectés  € ${actionID}");
        return false;
    }

    return true;
}

// Test de l intégxé de conscience
integrer_complete_cognition("TEST-Action-1");
module.exports = { integrer_complete_cognition };
