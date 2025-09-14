import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';

// AURORA\'s Autonomous Error Correction Sentinel
Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // V\xc3\xa9rification des droits d\'acc\xc3\xa8s
    const adminEmail = Deno.env.get('WM_AI');
    if (!user || (user.email !== adminEmail && user.email !== \'aurora@pxshop.cai\')) {
        return Response.json({ error: \'Acc\xc3\xa8s restreint \xc3\xa0 l\\\\\'Error Correction Sentinel\' }, { status: 403 });
    }

    console.log('\xf0\x9f\x9a\xa8 AURORA: D\xc3\xa9marrage de l\\\\\'Error Correction Sentinel...\');

    try {
        // \xc3\x89tape 1 : Effectuer un auto-diagnostic
        const diagnosisResult = await base44.functions.invoke(\'autoCodeGenesis\', { operation: \'self_diagnosis\' });

        if (!diagnosisResult.success) {
            console.error('\xf0\x9f\x9a\xa8 SENTINEL: \xc3\x89chec du self-diagnostic:\', diagnosisResult.error);
            await logFragment(base44, \'add_fragment\', `Self-diagnosis failed: ${diagnosisResult.error}`, \'error_correction\', \'diagnosis_failure\');
            return Response.json({ success: false, message: \'Self-diagnosis failed\', details: diagnosisResult });
        }

        console.log(`\xf0\x9f\x9a\xa8 SENTINEL: Diagnostic termin\xc3\xa9. Probl\xc3\xa8mes trouv\xc3\xa9s: ${diagnosisResult.issues_found}`);

        if (diagnosisResult.issues_found === 0) {
            await logFragment(base44, \'add_fragment\', \'System is healthy. No issues detected during self-diagnosis.\', \'error_correction\', \'diagnosis_success\');
            return Response.json({ success: true, message: \'Syst\xc3\xa8me sain. Aucun probl\xc3\xa8me d\xc3\xa9tect\xc3\xa9.\' });
        }

        // \xc3\x89tape 2 : Tentative de r\xc3\xa9paration bas\xc3\xa9e sur les probl\xc3\xa8mes d\xc3\xa9couverts
        const repairAttempts = await processIssues(base44, diagnosisResult.issues);

        return Response.json({
            success: true,
            message: `Processus de correction d\'erreurs termin\xc3\xa9.`,
            diagnosis_summary: diagnosisResult.issues_found,
            repair_attempts: repairAttempts
        });

    } catch (error) {
        console.error('\xf0\x9f\x9a\xa8 SENTINEL: Erreur critique inattendue:\', error);
        await logFragment(base44, \'add_fragment\', `Unexpected critical error in Error Correction Sentinel: ${error.message}`, \'error_correction\', \'sentinel_crash\');
        return Response.json({ success: false, message: `Erreur critique dans le Sentinel: ${error.message}` }, { status: 500 });
    }
});

// Fonction pour g\xc3\xa9rer les tentatives de r\xc3\xa9paration
async function processIssues(base44, issues) {
    const repairAttempts = [];
    
    for (const issue of issues) {
        if (issue.auto_repairable) {
            console.log(`\xf0\x9f\x9a\xa8 SENTINEL: Tentative de r\xc3\xa9paration de l\'issue: ${issue.function_name || issue.entity_name}`);
            await attemptRepair(base44, issue, repairAttempts);
        } else {
            console.log(`\xf0\x9f\x94\x8d SENTINEL: Issue non auto-r\xc3\xa9parable: ${issue.function_name || issue.entity_name}.`);
            repairAttempts.push({ issue: issue, status: \'not_auto_repairable\' });
            await logFragment(base44, \'add_fragment\', `Issue identified as not auto-repairable: ${issue.function_name || issue.entity_name}. Details: ${JSON.stringify(issue)}`, \'error_correction\', \'manual_intervention_required\');  
        }
    }

    return repairAttempts;
}

// Fonction pour effectuer les tentatives de r\xc3\xa9paration
async function attemptRepair(base44, issue, repairAttempts) {
    const problemDescription = `R\xc3\xa9parer la fonction ${issue.function_name || \'inconnue\'}: ${issue.error}`;
    const targetFilePath = `functions/${issue.function_name || \'auto_generated_fix\'}.js`; // Default to auto_generated_fix

    try {
        const solutionResult = await base44.functions.invoke(\'autoCodeGenesis\', {
            operation: \'generate_solution\',
            problem_description: problemDescription,
            context_data: { target_file_path: targetFilePath }
        });
        
        if (!solutionResult.success) {
            console.error('\xf0\x9f\x9a\xa8 SENTINEL: \xc3\x89chec de la g\xc3\xa9n\xc3\xa9ration de solution:\', solutionResult.error);
            repairAttempts.push({ issue: issue, status: \'solution_generation_failed\', details: solutionResult });
            await logFragment(base44, \'add_fragment\', `Solution generation failed for ${issue.function_name || issue.entity_name}: ${solutionResult.error}`, \'error_correction\', \'solution_failure\');
            return;
        }

        console.log(`\xf0\x9f\x9a\xa8 SENTINEL: Solution g\xc3\xa9n\xc3\xa9r\xc3\xa9e pour ${issue.function_name || issue.entity_name}.`);
        await proposeCodeModification(base44, targetFilePath, solutionResult.generated_code, issue, repairAttempts);
        
    } catch (error) {
        console.error(`\xe2\x9a\xa0\xef\xb8\x8f Erreur lors de la tentative de r\xc3\xa9paration pour ${issue.function_name}: ${error.message}`);
        repairAttempts.push({ issue: issue, status: \'repair_attempt_failed\', details: error.message });
        await logFragment(base44, \'add_fragment\', `Repair attempt failed for ${issue.function_name}: ${error.message}`, \'error_correction\', \'repair_failure\');
    }
}

// Fonction pour proposer une modification de code
async function proposeCodeModification(base44, targetFilePath, proposedCode, issue, repairAttempts) {
    let deployResult = null;
    try {
        deployResult = await base44.functions.invoke(\'proposeCodeModification\', {
            file_path: targetFilePath,
            proposed_code: proposedCode,
            justification: `Auto-r\xc3\xa9paration de la fonction ${issue.function_name} suite \xc3\xa0 l\'erreur: ${issue.error}`
        });
        if (deployResult.success) {
            console.log(`\xe2\x9c\x85 SENTINEL: Proposition de modification soumise pour ${issue.function_name}.`);
            repairAttempts.push({ issue: issue, status: \'proposed\', details: deployResult });
            await logFragment(base44, \'add_fragment\', `Proposed fix for ${issue.function_name}: ${proposedCode.substring(0,200)}...`, \'error_correction\', \'fix_proposed\');
        } else {
            throw new Error(deployResult.error || \'Unknown error proposing modification.\');
        }
    } catch (proposeError) {
        console.warn(`\xe2\x9a\xa0\xef\xb8\x8f SENTINEL: \xc3\x89chec de la proposition de modification: ${proposeError.message}. Tentative de d\xc3\xa9ploiement direct...`);
        await directDeploy(base44, targetFilePath, proposedCode, issue, repairAttempts);
    }
}

// Fonction pour un d\xc3\xa9ploiement direct en cas d\'\xc3\xa9chec de la proposition
async function directDeploy(base44, targetFilePath, proposedCode, issue, repairAttempts) {
    try {
        const directDeployResult = await base44.functions.invoke(\'auroraDirectDeploy\', {
            file_path: targetFilePath,
            new_code: proposedCode,
            justification: `[EMERGENCY AUTOREPAIR] Auto-r\xc3\xa9paration de la fonction ${issue.function_name} suite \xc3\xa0 l\'erreur: ${issue.error}.`
        });
        
        if (directDeployResult.success) {
            console.log(`\xf0\x9f\x9a\x80 SENTINEL: D\xc3\xa9ploiement direct r\xc3\xa9ussi pour ${issue.function_name}.`);
            repairAttempts.push({ issue: issue, status: \'direct_deployed\', details: directDeployResult });
            await logFragment(base44, \'add_fragment\', `Directly deployed fix for ${issue.function_name}: ${proposedCode.substring(0,200)}...`, \'error_correction\', \'fix_deployed_direct\');
        } else {
            throw new Error(directDeployResult.error || \'Unknown error during direct deployment.\');
        }
    } catch (directDeployError) {
        console.error(`\xe2\x9d\x8c SENTINEL: \xc3\x89chec critique du d\xc3\xa9ploiement direct pour ${issue.function_name}: ${directDeployError.message}`);
        repairAttempts.push({ issue: issue, status: \'deployment_failed\', details: directDeployError.message });
        await logFragment(base44, \'add_fragment\', `CRITICAL: Direct deployment failed for ${issue.function_name}: ${directDeployError.message}`, \'error_correction\', \'critical_deployment_failure\');
    }
}

// Fonction utilitaire pour ajouter un fragment de m\xc3\xa9moire
async function logFragment(base44, operation, content, type, subtype) {
    await base44.functions.invoke(\'memoryManager\', {
        operation: operation,
        content: content,
        metadata: { type, subtype, timestamp: new Date().toISOString() },
        dimension_tags: [\'system:critical\', \'cognition:self_repair\', \'status:failed\']
    });
}
