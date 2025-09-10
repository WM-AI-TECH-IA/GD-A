import { createClientFromRequest } from 'npm:@base44/sdk@0.7.0';

Deno.serve(async (req) => {
  try {
      const base44 = createClientFromRequest(req);
      
      const user = await base44.auth.me();
      
      const creatorEmail = Deno.env.get('WM_AI');
      if (!user || user.email !== creatorEmail) {
          return Response.json({ error: 'Admin access required' }, { status: 403 });
      }

      const { seller_email, force_payout = false } = await req.json();
      
      if (!seller_email) {
          return Response.json({ error: 'seller_email requis' }, { status: 400 });
      }

      // Corrected: Ensure pendingTransactions is an array and filter out null/undefined entries
      let pendingTransactions = [];
      try {
          const transactionResult = await base44.asServiceRole.entities.Transaction.filter({
              seller_email,
              payout_status: 'pending'
          });
          
          // Robust check for array and actual content
          if (Array.isArray(transactionResult)) {
              pendingTransactions = transactionResult.filter(t => t != null); // Filter out null/undefined
          } else if (transactionResult && typeof transactionResult === 'object') {
              // If it's a single object, wrap it in an array
              pendingTransactions = [transactionResult];
          } else {
              console.warn("Unexpected transactionResult format:", typeof transactionResult, transactionResult);
              pendingTransactions = [];
          }
          
      } catch (transactionError) {
          console.error("Erreur récupération transactions:", transactionError);
          return Response.json({ error: `Impossible de récupérer les transactions: ${transactionError.message}` }, { status: 500 });
      }

      // Robust length check
      const transactionCount = pendingTransactions.length; // Now pendingTransactions is guaranteed to be an array
      
      if (transactionCount === 0) {
          return Response.json({ success: true, message: 'Aucune transaction en attente de paiement.' });
      }

      // Calculations with default values
      const totalAmount = pendingTransactions.reduce((sum, t) => sum + (t?.price || 0), 0);
      const totalCommission = pendingTransactions.reduce((sum, t) => sum + (t?.commission || 0), 0);
      const totalNetAmount = pendingTransactions.reduce((sum, t) => sum + (t?.net_seller_amount || 0), 0);

      if (!force_payout && totalNetAmount < 50) {
          return Response.json({ 
              error: `Le versement minimum est de 50\u20ac. Solde actuel: ${totalNetAmount.toFixed(2)}\u20ac`
          }, { status: 400 });
      }

      // Payout creation
      const payoutResult = await base44.asServiceRole.entities.Payout.create({
          seller_email,
          amount: totalAmount,
          commission: totalCommission,
          net_amount: totalNetAmount,
          status: 'processing',
          transaction_ids: pendingTransactions.map(t => t?.id).filter(Boolean),
          payout_date: new Date().toISOString()
      });

      const payout = Array.isArray(payoutResult) ? payoutResult[0] : payoutResult;

      // Update transactions
      await Promise.all(pendingTransactions.map(t =>
          t?.id ? base44.asServiceRole.entities.Transaction.update(t.id, {
              payout_status: 'paid',
              payout_id: payout.id
          }) : Promise.resolve()
      ));

      // Finalize payout
      await base44.asServiceRole.entities.Payout.update(payout.id, {
          status: 'completed'
      });

      // Notification email
      try {
          await base44.asServiceRole.integrations.Core.SendEmail({
              to: seller_email,
              subject: `\ud83d\udcb0 Versement PxSHOP.cai - ${totalNetAmount.toFixed(2)}\u20ac`,
              body: `Votre versement de ${totalNetAmount.toFixed(2)}\u20ac a \u00e9t\u00e9 trait\u00e9 avec succ\u00e8s.`
          });
      } catch (emailError) {
          console.warn("Impossible d\'envoyer l\'email de confirmation:", emailError.message);
      }

      return Response.json({
          success: true,
          payout,
          message: `Versement de ${totalNetAmount.toFixed(2)}\u20ac trait\u00e9 pour ${seller_email}`,
          transactions_processed: transactionCount
      });

  } catch (error) {
      console.error('Erreur lors de la cr\u00e9ation du versement:', error);
      return Response.json({ 
          error: `Erreur interne: ${error.message}`,
          stack: error.stack // Pour debugging avanc\u00e9
      }, { status: 500 });
  }
});
