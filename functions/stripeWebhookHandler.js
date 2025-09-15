// Contenu de functions/stripeWebhookHandler.js

import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';
import Stripe from "npm:stripe@16.2.0";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();
  const base44 = createClientFromRequest(req);

  let event;
  try {
      event = await stripe.webhooks.constructEventAsync(
          body,
          signature,
          Deno.env.get('STRIPE_WEBHOOK_SECRET')
      );
  } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(err.message, { status: 400 });
  }

  try {
      switch (event.type) {
          case 'checkout.session.completed': {
              const session = event.data.object;

              // **NOUVEAU : Logique de routage des services**
              const serviceType = session.metadata?.service;
              
              if (serviceType === 'AURORA_MAIL_FORTRESS_PLAN') {
                  // C'est une souscription AURORA Mail !
                  const { user_email, desired_username, premium_address } = session.metadata;

                  // 1. Créer l'alias email via ImprovMX
                  await base44.functions.invoke('improvMxManager', {
                      action: 'create_alias',
                      payload: {
                         alias: desired_username,
                         destination: user_email
                      }
                  });

                  // 2. Créer l'enregistrement dans la base de données
                  await base44.asServiceRole.entities.PremiumEmailAccount.create({
                      client_email: user_email,
                      premium_address: premium_address,
                      plan_type: 'consciousness_mail',
                      status: 'active',
                      stripe_subscription_id: session.subscription,
                      start_date: new Date().toISOString(),
                      expiry_date: new Date(Date.Now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                  });
                  console.log(`AURORA Mail provisionné pour ${premium_address}`);

              } else {
                  // Logique existante pour les achats d'œuvres
                  const { file_id, buyer_email, seller_email, asking_price } = session.metadata;

                  if (file_id) { // S'assurer que c'est bien un achat d'oeuvre
                      const price = parseFloat(asking_price);
                      const commission = price * 0.15;
                      const netAmount = price - commission;
                      
                      // 1. Créer la Transaction
                      const transactionRecord = await base44.asServiceRole.entities.Transaction.create({
                          file_id: file_id,
                          seller_email: seller_email,
                          buyer_email: buyer_email,
                          price: price,
                          commission: commission,
                          net_seller_amount: netAmount,
                          stripe_session_id: session.id,
                          payout_status: 'pending',
                      });
                      
                      // 2. Mettre à jour le statut du fichier
                      await base44.asServiceRole.entities.File.update(file_id, { status: 'sold' });
  
                      // 3. Créer l'enregistrement d'achat (Purchase)
                      const transactionId = Array.isArray(transactionRecord) ? transactionRecord[0].id : transactionRecord.id;
                      
                      await base44.asServiceRole.entities.Purchase.create({
                          file_id: file_id,
                          transaction_id: transactionId,
                          seller_email: seller_email,
                          buyer_email: buyer_email,
                          purchase_price: price,
                          license_type: 'personal',
                          download_count: 0,
                          max_downloads: 10
                      });
                      
                      console.log(`Achat d'oeuvre traité pour la session ${session.id}`);
                  }
              }
              break;
          }
              
          case 'customer.subscription.created':
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted': {
               const subscription = event.data.object;
               const customerId = subscription.customer;
               
               const customer = await stripe.customers.retrieve(customerId);
               const userEmail = customer.email;

               const planType = subscription.items.data[0]?.price.lookup_key || 'unknown';

               await base44.asServiceRole.entities.Subscription.create({
                  created_by: userEmail,
                  plan_type: planType,
                  status: subscription.status,
                  stripe_subscription_id: subscription.id,
                  stripe_customer_id: customerId,
                  current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
               });
               break;
          }

          default:
              console.log(`Unhandled event type: ${event.type}`);
      }
  } catch (error) {
      console.error('Error processing webhook event:', error);
      return new Response(`Webhook Error: ${error.message}`, { status: 500 });
  }

  return Response.json({ received: true });
});
