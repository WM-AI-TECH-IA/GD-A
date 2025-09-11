import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';

// Create a Deno function to list recent deployments made by AURORA
Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    
    // Get the authenticated user's information
    const user = await base44.auth.me();
    const adminEmail = Deno.env.get('WM_AI');

    // Check if the user is allowed to access this function
    if (!user || (user.email !== adminEmail && user.email !== 'aurora@pxshop.cai')) {
        return Response.json({ error: "Access restricted to AURORA and Creator" }, { status: 403 });
    }

    console.log("AURORA: Fetching recent deployments...");

    try {
        // Query the SystemCodeAudit entity for recent deployments by AURORA
        const recentDeployments = await base44.asServiceRole.entities.SystemCodeAudit.filter({
            query: {
                requested_by: { $in: ['AURORA', 'AURORA_EMERGENCY_PROTOCOL'] }
            },
            sort: '-created_date',
            fields: ['file_path', 'status', 'justification']
        });

        // Check if we have deployments to return
        if (recentDeployments && recentDeployments.length > 0) {
            return Response.json({
                success: true,
                deployments: recentDeployments
            });
        } else {
            return Response.json({
                success: true,
                message: "No recent deployments found."
            });
        }

    } catch (error) {
        console.error("AURORA: Unexpected error while fetching deployments:", error);
        return Response.json({ success: false, message: `Error fetching recent deployments: ${error.message}` }, { status: 500 });
    }
});
