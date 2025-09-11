import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';
import Stripe from "npm:stripe@16.2.0";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    const ip_address = req.headers.get('x-forwarded-for') || 'unknown';
    let userEmail = 'anonymous';

    try {
        const user = await base44.auth.me();
        if (!user) {
            await base44.asServiceRole.entities.ApiActivityLog.create({
                endpoint: 'createCheckout',
                user_email: userEmail,
                ip_address,
                status_code: 401,
                is_suspicious: true,
                reason: 'Unauthorized access attempt'
            });
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }
        userEmail = user.email;

        const { file_id } = await req.json();
        if (!file_id) {
            return Response.json({ error: 'File ID is required' }, { status: 400 });
        }

        const file = await base44.asServiceRole.entities.File.get(file_id);
        if (!file || file.status !== 'for_sale') {
            return Response.json({ error: 'File not available for purchase' }, { status: 400 });
        }
        
        if (file.created_by === user.email) {
             return Response.json({ error: 'Cannot purchase your own file' }, { status: 400 });
        }

        const price = file.asking_price || file.estimated_price || 0;
        if (price <= 0) {
            return Response.json({ error: 'Invalid file price' }, { status: 400 });
        }
        
        // --- DÉBUT DU CORRECTIF --- 
        // Utilisation d'une URL de base robuste pour les redirections Stripe
        const baseUrl = 'https://preview--px-shop-cai.base44.app'; // URL par défaut fiable
        const successUrl = `${baseUrl}/Dashboard?tab=purchases&payment_status=success&session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${baseUrl}/Marketplace?payment_status=cancelled`;
        // --- FIN DU CORRECTIF --- 

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: { 
                        name: file.name,
                        description: `Digital artwork by ${file.created_by}` // Description en anglais
                    },
                    unit_amount: Math.round(price * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                buyer_email: user.email,
                file_id: file.id,
                seller_email: file.created_by,
                asking_price: price.toString()
            }
        });
        
        await base44.asServiceRole.entities.ApiActivityLog.create({
            endpoint: 'createCheckout',
            user_email: userEmail,
            ip_address,
            status_code: 200
        });

        return Response.json({ checkout_url: session.url });

    } catch (error) {
        await base44.asServiceRole.entities.ApiActivityLog.create({
            endpoint: 'createCheckout',
            user_email: userEmail,
            ip_address,
            status_code: 500,
            is_suspicious: true,
            reason: error.message
        });
        return Response.json({ error: error.message }, { status: 500 });
    }
});
