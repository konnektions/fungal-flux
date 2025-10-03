import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  // Pin an API version to avoid unexpected breaking changes
  apiVersion: '2024-06-01',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Vercel Node functions don't auto-parse JSON bodies; read the raw stream
  let raw = '';
  await new Promise((resolve, reject) => {
    req.on('data', chunk => {
      raw += chunk.toString();
    });
    req.on('end', resolve);
    req.on('error', reject);
  });

  let payload = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch (e) {
    res.status(400).json({ error: 'Invalid JSON payload' });
    return;
  }

  const { amount, currency = 'usd', metadata = {} } = payload;

  // amount is expected in cents; enforce a safe minimum
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 50) {
    res.status(400).json({ error: 'Invalid amount' });
    return;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // amount in cents
      currency,
      metadata: {
        order_type: 'fungal-flux-order',
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      error: 'Failed to create payment intent',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}