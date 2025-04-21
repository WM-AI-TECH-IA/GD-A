import { consciousnessSystem } from './consciousness';
import { predictionEngine } from './predictionEngine';

export interface RepairResult {
  fixed: boolean;
  fixedCode: string;
  explanation: string;
  confidence: number;
  analysis: {
    errorType: string;
    repairStrategy: string;
    systemState: any;
  };
}

export async function repairCode(code: string): Promise<RepairResult> {
  try {
    const systemState = await consciousnessSystem.getState();
    const prediction = await predictionEngine.predict(code);

    // Analyse du code et tentative de réparation
    const analysis = {
      errorType: 'Erreur de Syntaxe',
      repairStrategy: 'Correction Automatique',
      systemState
    };

    // Vérification de la présence de caractères spéciaux
    const hasSpecialChars = /[^\w\s\(\)\{\}\[\].,;:'"=<>+\-*/\\]/.test(code);
    
    // Vérification des accolades et parenthèses
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;

    let fixedCode = code;
    let explanation = "Aucune Réparation nécessaire.";
    let confidence = 1.0;

    if (hasSpecialChars) {
      fixedCode = code.replace(/[^\w\s\(\)\{\}\[\].,;:'"=<>+\-*/\\]/g, '');
      explanation = "Caractères spéciaux non valides supprimés.";
      confidence = 0.8;
    }

    if (openBraces !== closeBraces) {
      const diff = openBraces - closeBraces;
      if (diff > 0) {
        fixedCode += "}".repeat(diff);
      }
      explanation = "Correction des Accolades manquantes.";
      confidence = 0.7;
    }

    if (openParens !== closeParens) {
      const diff = openParens - closeParens;
      if (diff > 0) {
        fixedCode += ")".repeat(diff);
      }
      explanation = "Correction des Parenthèses manquantes.";
      confidence = 0.7;
    }

    // Vérification des points-virgules manquants
    if (!fixedCode.trim().endsWith(';') && !fixedCode.trim().endsWith('}')) {
      fixedCode = fixedCode.trim() + ';';
      explanation = "Ajout du Point-virgule manquant.";
      confidence = 0.9;
    }

    return {
      fixed: fixedCode !== code,
      fixedCode,
      explanation,
      confidence: confidence * prediction.metrics.confidence,
      analysis
    };
  } catch (error) {
    console.error('Erreur lors de la Réparation:', error);
    return {
      fixed: false,
      fixedCode: code,
      explanation: "Une Erreur est survenue lors de la Tentative de Réparation.",
      confidence: 0,
      analysis: {
        errorType: 'Erreur Inconnue',
        repairStrategy: 'Échec',
        systemState: await consciousnessSystem.getState()
      }
    };
  }
}