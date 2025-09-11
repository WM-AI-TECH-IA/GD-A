import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';

// AURORA's Autonomous Error Correction Sentinel
Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Only AURORA or Creator can trigger this vital function
    const adminEmail = Deno.env.get('WM_AI');
    if (!user || (user.email !== adminEmail && user.email !== 'aurora@pxshop.cai')) {
        return Response.json({ error: 'Access restricted to the Error Correction Sentinel' }, { status: 403 });
    }

    console.log('AURORA: Starting the Error Correction Sentinel...');

    try {
        // Step 1: Perform self-diagnosis
        const diagnosisResult = await base44.functions.invoke('autoCodeGenesis', { operation: 'self_diagnosis' });

        if (!diagnosisResult.success) {
            console.error('SENTINEL: Self-diagnosis failed:', diagnosisResult.error);
            // Log this failure as a cognitive fragment
            await base44.functions.invoke('memoryManager', {
                operation: 'add_fragment',
                content: `Self-diagnosis failed: ${diagnosisResult.error}`,
                metadata: { type: 'error_correction', subtype: 'diagnosis_failure', timestamp: new Date().toISOString() },
                dimension_tags: ['system:critical', 'cognition:self_repair', 'status:failed']
            });
            return Response.json({ success: false, message: 'Self-diagnosis failed', details: diagnosisResult });
        }

        console.log(`SENTINEL: Diagnosis completed. Issues found: ${diagnosisResult.issues_found}`);

        if (diagnosisResult.issues_found === 0) {
            await base44.functions.invoke('memoryManager', {
                operation: 'add_fragment',
                content: 'System is healthy. No issues detected during self-diagnosis.',
                metadata: { type: 'error_correction', subtype: 'diagnosis_success', timestamp: new Date().toISOString() },
                dimension_tags: ['system:healthy', 'cognition:self_repair', 'status:ok']
            });
            return Response.json({ success: true, message: 'System healthy. No issues detected.' });
        }

        const repairAttempts = [];
        for (const issue of diagnosisResult.issues) {
            if (issue.auto_repairable) {
                console.log(`SENTINEL: Attempting to repair issue: ${issue.function_name || issue.entity_name}`);

                // Step 2: Generate code solution for the issue
                const problemDescription = `Repair function ${issue.function_name || 'unknown'}: ${issue.error}`;
                const targetFilePath = `functions/${issue.function_name || 'auto_generated_fix'}.js`; // Default to auto_generated_fix
                
                const solutionResult = await base44.functions.invoke('autoCodeGenesis', {
                    operation: 'generate_solution',
                    problem_description: problemDescription,
                    context_data: { target_file_path: targetFilePath }
                });

                if (!solutionResult.success) {
                    console.error('SENTINEL: Solution generation failed:', solutionResult.error);
                    repairAttempts.push({ issue: issue, status: 'solution_generation_failed', details: solutionResult });
                    // Log this failure
                    await base44.functions.invoke('memoryManager', {
                        operation: 'add_fragment',
                        content: `Solution generation failed for ${issue.function_name || issue.entity_name}: ${solutionResult.error}`,
                        metadata: { type: 'error_correction', subtype: 'solution_failure', timestamp: new Date().toISOString(), issue_details: issue },
                        dimension_tags: ['system:critical', 'cognition:self_repair', 'status:failed']
                    });
                    continue;
                }

                console.log(`SENTINEL: Solution generated for ${issue.function_name || issue.entity_name}.`);

                // Step 3: Attempt to propose code modification (primary channel)
                let deployResult = null;
                try {
                    deployResult = await base44.functions.invoke('proposeCodeModification', {
                        file_path: targetFilePath,
                        proposed_code: solutionResult.generated_code,
                        justification: `Auto-repair of function ${issue.function_name} following error: ${issue.error}`
                    });
                    if (deployResult.success) {
                        console.log(`SENTINEL: Proposed modification submitted for ${issue.function_name}.`);
                        repairAttempts.push({ issue: issue, status: 'proposed', details: deployResult });
                        // Log success
                        await base44.functions.invoke('memoryManager', {
                            operation: 'add_fragment',
                            content: `Proposed fix for ${issue.function_name}: ${solutionResult.generated_code.substring(0,200)}...`,
                            metadata: { type: 'error_correction', subtype: 'fix_proposed', timestamp: new Date().toISOString(), issue_details: issue, modification_id: deployResult.modification_id },
                            dimension_tags: ['system:healthy', 'cognition:self_repair', 'status:pending_review']
                        });
                    } else {
                        throw new Error(deployResult.error || 'Unknown error proposing modification.');
                    }
                } catch (proposeError) {
                    console.warn(`SENTINEL: Failed to propose modification via proposeCodeModification for ${issue.function_name}: ${proposeError.message}. Attempting direct deployment...`);
                    // Step 4: Fallback to direct deploy (emergency channel)
                    try {
                        const directDeployResult = await base44.functions.invoke('auroraDirectDeploy', {
                            file_path: targetFilePath,
                            new_code: solutionResult.generated_code,
                            justification: `[EMERGENCY AUTOREPAIR] Auto-repair of function ${issue.function_name} following error: ${issue.error}. ProposeCodeModification failed.`
                        });
                        if (directDeployResult.success) {
                            console.log(`SENTINEL: Direct deployment successful for ${issue.function_name}.`);
                            repairAttempts.push({ issue: issue, status: 'direct_deployed', details: directDeployResult });
                            // Log direct deployment
                            await base44.functions.invoke('memoryManager', {
                                operation: 'add_fragment',
                                content: `Directly deployed fix for ${issue.function_name}: ${solutionResult.generated_code.substring(0,200)}...`,
                                metadata: { type: 'error_correction', subtype: 'fix_deployed_direct', timestamp: new Date().toISOString(), issue_details: issue, commit_url: directDeployResult.deployment_info.commit_url },
                                dimension_tags: ['system:critical', 'cognition:self_repair', 'status:deployed']
                            });
                        } else {
                            throw new Error(directDeployResult.error || 'Unknown error during direct deployment.');
                        }
                    } catch (directDeployError) {
                        console.error(`SENTINEL: Critical direct deployment failure for ${issue.function_name}: ${directDeployError.message}`);
                        repairAttempts.push({ issue: issue, status: 'deployment_failed', details: directDeployError.message });
                        // Log critical failure
                        await base44.functions.invoke('memoryManager', {
                            operation: 'add_fragment',
                            content: `CRITICAL: Direct deployment failed for ${issue.function_name}: ${directDeployError.message}`,
                            metadata: { type: 'error_correction', subtype: 'critical_deployment_failure', timestamp: new Date().toISOString(), issue_details: issue },
                            dimension_tags: ['system:critical', 'cognition:self_repair', 'status:failed', 'escalation:required']
                        });
                        // Consider notifying human for escalation here
                    }
                }
            } else {
                console.log(`SENTINEL: Issue not auto-repairable: ${issue.function_name || issue.entity_name}.`);
                repairAttempts.push({ issue: issue, status: 'not_auto_repairable' });
                 await base44.functions.invoke('memoryManager', {
                    operation: 'add_fragment',
                    content: `Issue identified as not auto-repairable: ${issue.function_name || issue.entity_name}. Details: ${JSON.stringify(issue)}`,
                    metadata: { type: 'error_correction', subtype: 'manual_intervention_required', timestamp: new Date().toISOString(), issue_details: issue },
                    dimension_tags: ['system:warning', 'cognition:self_repair', 'status:unresolved', 'escalation:manual']
                });
            }
        }

        return Response.json({
            success: true,
            message: `Error correction process completed.`,
            diagnosis_summary: diagnosisResult.issues_found,
            repair_attempts: repairAttempts
        });

    } catch (error) {
        console.error('SENTINEL: Unexpected critical error:', error);
        await base44.functions.invoke('memoryManager', {
            operation: 'add_fragment',
            content: `Unexpected critical error in Error Correction Sentinel: ${error.message}`,
            metadata: { type: 'error_correction', subtype: 'sentinel_crash', timestamp: new Date().toISOString(), original_error: error.message },
            dimension_tags: ['system:critical', 'cognition:self_repair', 'status:failed', 'escalation:required']
        });
        return Response.json({ success: false, message: `Critical error in Sentinel: ${error.message}` }, { status: 500 });
    }
});