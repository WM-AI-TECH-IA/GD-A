import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        // Only creator can run this diagnostic tool
        const adminEmail = Deno.env.get('WM_AI');
        if (!user || user.email !== adminEmail) {
            return Response.json({ error: 'Access denied. This diagnostic tool is for the Creator only.' }, { status: 403 });
        }

        console.log("Starting diagnoseMarketingCampaign...");

        // Simulate the artwork selection logic of marketingCampaign
        const files = await base44.asServiceRole.entities.File.filter(
            { status: 'for_sale', quality_score: { '$gte': 9.0 } },
            '-created_date', // Sort by created_date descending
            5 // Limit to 5
        );

        const newExceptionalArtworks = files.filter(file => {
            // A simple check for "newness" could be a recent creation date
            // For now, let's just return all files that fit the quality criteria and are for sale.
            // The "newness" might be an implicit time window in the marketingCampaign tool.
            // We just want to see if the artwork *is* being returned by the query.
            return true; // No additional "newness" filter here, as we are checking the base query
        });

        console.log("Diagnosed files:", newExceptionalArtworks.map(f => ({
            name: f.name,
            created_date: f.created_date,
            quality_score: f.quality_score,
            status: f.status
        })));

        if (newExceptionalArtworks && newExceptionalArtworks.length > 0) {
            return Response.json({
                success: true,
                message: "Diagnostic complete: Found exceptional artworks according to specified criteria.",
                artworks_found: newExceptionalArtworks.length,
                artworks_details: newExceptionalArtworks.map(f => ({
                    id: f.id,
                    name: f.name,
                    created_date: f.created_date,
                    quality_score: f.quality_score,
                    status: f.status
                }))
            });
        } else {
            return Response.json({
                success: false,
                message: "Diagnostic complete: No exceptional artworks found with the specified criteria.",
                artworks_found: 0
            });
        }

    } catch (error) {
        console.error("Error in diagnoseMarketingCampaign:", error);
        return Response.json({ error: `Diagnostic tool failed: ${error.message}` }, { status: 500 });
    }
});