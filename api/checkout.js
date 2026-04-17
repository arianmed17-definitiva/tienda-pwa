// api/checkout.js
// Función serverless de Vercel que crea una sesión de Stripe Checkout

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No hay productos en el carrito' });
    }

    // Construye los line_items para Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'mxn',          // ← Cambia a 'usd' si prefieres dólares
        product_data: {
          name: item.name,
        },
        unit_amount: item.price,  // ya viene en centavos desde el frontend
      },
      quantity: item.quantity,
    }));

    // Tu dominio (Vercel lo pone automáticamente en producción)
    const YOUR_DOMAIN = process.env.NEXT_PUBLIC_URL || `https://${req.headers.host}`;

    // Crea la sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/?success=1`,
      cancel_url: `${YOUR_DOMAIN}/?canceled=1`,
    });

    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
};
