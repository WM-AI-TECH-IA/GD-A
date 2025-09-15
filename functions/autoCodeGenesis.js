import { createHash } from 'node:crypto';
import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';

const corsHeaders = {
'Access-Control-Allow-Origin': '*',
'Access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
};

// Fonction utilitaire pour logger via invocation
async function logEvent(base44, level, message, payload, traceId) {
try {
  await base44.functions.invoke('logSystemEvent', {
    source_function: 'autoCodeGenesis',
    log_level: level,
    message,
    payload,
    trace_id: traceId,
  });
} catch (e) {
  console.error(`[CRITICAL] Failed to invoke logSystemEvent: ${e.message}`);
}
}

async function handleApproveProposal(base44, payload, traceId) {
const { audit_id } = payload;
await logEvent(base44, 'INFO', `Début d'approbation pour audit_id: ${audit_id}`, payload, traceId);

if (!audit_id) {
    await logEvent(base44, 'ERROR', "audit_id manquant dans la requête", payload, traceId);
    throw new Error("audit_id manquant");
}

const proposal = await base44.entities.SystemCodeAudit.get(audit_id);
if (!proposal) {
    await logEvent(base44, 'ERROR', `Proposition non trouvée pour audit_id: ${audit_id}`, {}, traceId);
    throw new Error("Proposition non trouvée");
}

let approvalResponse, deployResponse;

try {
    await logEvent(base44, 'INFO', `Invocation de 'approveCodeModification'`, { audit_id }, traceId);
    const approvalInvocation = await base44.functions.invoke('approveCodeModification', { audit_id });
    approvalResponse = approvalInvocation.data;
    if (!approvalResponse?.success) {
        throw new Error(approvalResponse?.error || 'Réponse invalide du service d'approbation.');
    }
    await logEvent(base44, 'INFO', `Approbation réussie`, approvalResponse, traceId);
} catch (error) {
    await logEvent(base44, 'CRITICAL', `Échec critique de l'approbation`, { error: error.message, audit_id }, traceId);
    throw new Error(`Échec de l'approbation : ${error.message}`);
}

const filePath = proposal.file_path.toLowerCase();

try {
    if (filePath.includes("gda-python-backend")) {
        await logEvent(base44, 'INFO', 'Déclenchement du redéploiement Python', { filePath }, traceId);
        const deployInvocation = await base44.functions.invoke('redeployPythonBackend', { event_type: 'auto_redeploy_from_genesis' });
        deployResponse = deployInvocation.data;
    } else if (filePath.startsWith('functions/')) {
        const functionName = filePath.replace('functions/', '').replace(/\.(js|ts)$/, '');
        await logEvent(base44, 'INFO', `Déclenchement du déploiement direct pour la fonction: ${functionName}`, { functionName, code: proposal.proposed_code });
        deployResponse = deployInvocation.data;
    } else {
         await logEvent(base44, 'WARN', `Aucune action de déploiement automatique pour ${filePath}.`, {}, traceId);
        return { success: true, message: `Approbation réussie pour ${filePath}.`, approval_details: approvalResponse };
    }

    if (!deployResponse?.success) {
        throw new Error(deployResponse?.error || 'Réponse invalide du service de déploiement.');
    }
    await logEvent(base44, 'INFO', 'Déploiement réussi', deployResponse, traceId);

} catch (error) {
    await logEvent(base44, 'CRITICAL', `Échec critique du déploiement`, { error: error.message, filePath }, traceId);
    throw new Error(`Échec du redéploiement : ${error.message}`);
}

return { 
    success: true, 
    message: "Proposition approuvée et redéployée avec succès.",
    approval_details: approvalResponse,
    deploy_details: deployResponse
};
}

Deno.serve(async (req) => {
const traceId = createHash('sha256').update(Date.now().toString() + Math.random().toString()).digest('hex').substring(0, 16);

if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }); }

const base44 = createClientFromRequest(req);

try {
    const user = await base44.auth.me();
    const adminEmail = Deno.env.get('WM_AI');
    // La logique d'authentification a été inversée pour autoriser UNIQUEMENT l'admin et AURORA.
    // Si l'utilisateur n'est PAS authentifié, OU si son email n'est NI l'admin NI AURORA, l'accès est refusé.
    if (!user || (user.email !== adminEmail && user.email !== 'aurora@pxshop.cai')) {
        await logEvent(base44, 'WARN', `Tentative d'accès non autorisé à autoCodeGenesis`, { user: user?.email || 'anonymous' }, traceId);
        return new Response(JSON.stringify({ success: false, error: "Accès non autorisé" }), { status: 403, headers: corsHeaders });
    }

    const payload = await req.json();
    const { action } = payload;
    
    let responseData;
    switch (action) {
        case 'get_proposals': {
            const proposals = await base44.entities.SystemCodeAudit.filter({ status: 'pending_review' }, '-created_date');
            responseData = { success: true, proposals };
            break;
        }
        case 'approve_and_deploy': {
            responseData = await handleApproveProposal(base44, payload, traceId);
            break;
        }
        case 'reject_proposal': {
            const invocation = await base44.functions.invoke('rejectCodeModification', { audit_id: payload.audit_id, reason: payload.reason });
            responseData = invocation.data;
            break;
        }
        default:
            responseData = { success: false, error: "Action non valide" };
    }
    
    return new Response(JSON.stringify(responseData), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

} catch (error) {
    await logEvent(base44, 'CRITICAL', `Erreur non gérée dans autoCodeGenesis`, { error: error.message }, traceId);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: corsHeaders });
}
});
