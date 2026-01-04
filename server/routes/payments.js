import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import pool from '../db.js';

dotenv.config({ path: '.env.local' });

const router = express.Router();
// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2023-10-16', // Adjust to a valid version
});

// Endpoint to create a connected account for a provider
router.post('/create-connect-account', async (req, res) => {
    try {
        const { userId, email } = req.body;

        // In a real app, check if user already has a stripe_account_id in DB
        // const [users] = await pool.query('SELECT stripe_account_id FROM users WHERE id = ?', [userId]);
        // if (users[0].stripe_account_id) return res.json({ accountId: users[0].stripe_account_id });

        const account = await stripe.accounts.create({
            type: 'standard',
            email: email,
        });

        // Save account.id to database linked to userId
        // await pool.query('UPDATE users SET stripe_account_id = ? WHERE id = ?', [account.id, userId]);

        res.json({ accountId: account.id });
    } catch (error) {
        console.error('Error creating connected account:', error);
        // Log detailed Stripe error if available
        if (error.raw) {
            console.error('Stripe Raw Error:', JSON.stringify(error.raw, null, 2));
        }
        res.status(500).json({
            error: error.message,
            details: error.raw ? error.raw.message : undefined
        });
    }
});

// Endpoint to create an account link for onboarding
router.post('/create-account-link', async (req, res) => {
    try {
        const { accountId, refreshUrl, returnUrl } = req.body;

        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: refreshUrl,
            return_url: returnUrl,
            type: 'account_onboarding',
        });

        res.json({ url: accountLink.url });
    } catch (error) {
        console.error('Error creating account link:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to create a payment intent with application fee
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency, providerStripeAccountId, paymentMethodType = 'card' } = req.body;

        if (!amount || !currency) {
            return res.status(400).json({ error: 'Missing required fields: amount or currency' });
        }

        console.log(`Creating PaymentIntent: Amount=${amount}, Currency=${currency}, ProviderAccount=${providerStripeAccountId || 'Platform'}`);

        let paymentIntentParams = {
            amount: amount,
            currency: currency,
            payment_method_types: [paymentMethodType],
            // expand: ['latest_charge.payment_method'], // Optional: Expand for more details if needed
        };

        // If a provider account is specified, we need to handle the transfer
        if (providerStripeAccountId) {
            // Calculate application fee (e.g., 10%)
            const appFeeAmount = Math.floor(amount * 0.1);

            paymentIntentParams.application_fee_amount = appFeeAmount;
            paymentIntentParams.transfer_data = {
                destination: providerStripeAccountId,
            };
        }

        const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

        res.json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
