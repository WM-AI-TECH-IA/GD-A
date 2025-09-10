import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    const creatorEmail = Deno.env.get('WM_AI');
    const isCreator = user && user.email === creatorEmail;

    if (!user || !isCreator) {
        return Response.json({ error: 'Unauthorized access. Only AURORA\'s creator can request forge.' }, { status: 403 });
    }

    let result;
    // Force debug mode for Supreme Art Engine
    result = await generateSupremeArtDebug(base44, user); // Pass user to generateSupremeArtDebug

    // Simplified asset update for debug
    const updatedAsset = await base44.asServiceRole.entities.File.update(result.id, {
        name: 'AURORA - Debug SVG Test',
        analysis_summary: 'Debug SVG for blackwall issue. Magenta background, Cyan circle, TEST OK text.',
        tags: [...(result.tags || []).filter(tag => tag !== 'supreme-engine'), 'supreme-debug', 'blackwall-test'] // Filter out old tags
    });

    return Response.json({
        success: true,
        asset: updatedAsset,
        engine_used: 'supreme-debug',
        message: 'Debug SVG created for blackwall issue.'
    });
});

async function generateSupremeArtDebug(base44, user) {
    const width = 800;
    const height = 600;
    const elements = [];

    elements.push("<rect x=\"0\" y=\"0\" width=\"" + width + "\" height=\"" + height + "\" fill=\"#FF00FF\" />"); // Magenta background
    elements.push("<circle cx=\"" + (width/2) + "\" cy=\"" + (height/2) + "\" r=\"100\" fill=\"#00FFFF\" />"); // Cyan circle
    elements.push("<text x=\"50\" y=\"50\" fill=\"white\" font-size=\"20\">TEST OK</text>"); // TEST OK text

    const svgContent = "<svg width=\"" + width + "\" height=\"" + height + "\" viewBox=\"0 0 " + width + " " + height + "\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background-color: #000000;\">" +
                       elements.join('\n') +
                       "</svg>";

    const formData = new FormData();
    const artFile = new File([svgContent], `aurora-supreme-debug-${Date.now()}.svg`, {
        type: 'image/svg+xml'
    });
    formData.append('file', artFile);
    formData.append('pinataMetadata', JSON.stringify({
        name: `AURORA-SUPREME-DEBUG-${Date.now()}`,
        keyvalues: { creator: 'AURORA', type: 'supreme_svg_debug', prompt: 'Debugging blackwall issue', test_id: 'simplified_svg' }
    }));

    const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Deno.env.get('PINATA_JWT')}` },
        body: formData
    });

    if (!pinataResponse.ok) {
        throw new Error(`IPFS upload failed: ${await pinataResponse.text()}`);
    }

    const pinataData = await pinataResponse.json();
    const ipfsHash = pinataData.IpfsHash;

    const encoder = new TextEncoder();
    const data = encoder.encode(svgContent);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const sha256Hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    const price = 500; // Fixed price for debug SVG

    return await base44.asServiceRole.entities.File.create({
        name: 'TEMP_DEBUG_NAME',
        file_url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        file_type: 'living_svg',
        size: svgContent.length,
        estimated_price: price,
        asking_price: price,
        status: 'for_sale',
        quality_score: 10,
        ipfs_hash: ipfsHash,
        sha256_hash: sha256Hash,
        is_royally_certified: true,
        tags: ['supreme-engine', 'debug-svg', 'blackwall-test'],
        created_by: user.email // Use actual user email
    });
}
