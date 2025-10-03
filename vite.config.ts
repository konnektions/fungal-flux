/** @type {import('vitest').UserConfig} */
/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import type { ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import react from '@vitejs/plugin-react';
import Stripe from 'stripe';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const stripeSecret = env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || '';

  const devStripeApiPlugin = {
    name: 'dev-stripe-api',
    configureServer(server: ViteDevServer) {
      // Dev-only API to avoid requiring `vercel dev` login locally
      server.middlewares.use('/api/create-payment-intent', async (req: IncomingMessage, res: ServerResponse) => {
        res.setHeader('Content-Type', 'application/json');

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let raw = '';
        await new Promise((resolve, reject) => {
          req.on('data', (chunk: Buffer) => (raw += chunk.toString()));
          req.on('end', resolve);
          req.on('error', reject);
        });

        let payload: Record<string, unknown> = {};
        try {
          payload = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
        } catch {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
          return;
        }

        const amountRaw = (payload as Record<string, unknown>).amount;
        const amount =
          typeof amountRaw === 'number' ? amountRaw : Number(amountRaw);
        const currency =
          typeof (payload as Record<string, unknown>).currency === 'string'
            ? ((payload as Record<string, unknown>).currency as string)
            : 'usd';
        const metadata =
          typeof (payload as Record<string, unknown>).metadata === 'object' &&
          (payload as Record<string, unknown>).metadata !== null
            ? ((payload as Record<string, unknown>).metadata as Record<string, string>)
            : {};

        if (!stripeSecret) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Server misconfiguration: STRIPE_SECRET_KEY missing' }));
          return;
        }

        if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 50) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid amount' }));
          return;
        }

        try {
          const stripe = new Stripe(stripeSecret);
          const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount), // amount in cents
            currency,
            metadata: { order_type: 'fungal-flux-order', ...metadata },
            automatic_payment_methods: { enabled: true },
          });

          res.statusCode = 200;
          res.end(
            JSON.stringify({
              clientSecret: paymentIntent.client_secret,
              paymentIntentId: paymentIntent.id,
            })
          );
        } catch (err: unknown) {
          console.error('[dev-stripe-api] Error creating PaymentIntent:', err);
          res.statusCode = 500;
          res.end(
            JSON.stringify({
              error: 'Failed to create payment intent',
              message: err instanceof Error ? err.message : 'Unknown error',
            })
          );
        }
      });
    },
  };

  return {
    plugins: [react(), devStripeApiPlugin],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/tests/setup.ts',
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
