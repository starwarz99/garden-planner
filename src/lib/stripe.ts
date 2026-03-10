import Stripe from "stripe";

// Stripe client — null when key is not yet configured.
// Force the fetch-based HTTP client so Stripe works in Vercel's serverless
// environment, which restricts Node.js native http/https socket connections.
export const stripe: Stripe | null = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY.trim(), {
      httpClient: Stripe.createFetchHttpClient(),
    })
  : null;

// Price IDs — set these in env after creating products in the Stripe dashboard
export const STRIPE_PRICES: Record<"grower" | "harvest", { priceId: string; amount: number; label: string }> = {
  grower: {
    priceId: (process.env.STRIPE_PRICE_GROWER ?? "").trim(),
    amount: 5.99,
    label: "$5.99 / month",
  },
  harvest: {
    priceId: (process.env.STRIPE_PRICE_HARVEST ?? "").trim(),
    amount: 9.99,
    label: "$9.99 / month",
  },
};

/** Given a Stripe price ID, return the matching plan name, or null if unrecognised. */
export function planFromPriceId(priceId: string): "grower" | "harvest" | null {
  if (priceId && priceId === STRIPE_PRICES.grower.priceId) return "grower";
  if (priceId && priceId === STRIPE_PRICES.harvest.priceId) return "harvest";
  return null;
}

/** Return true when Stripe is fully configured (key + both price IDs are set). */
export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_PRICE_GROWER &&
    process.env.STRIPE_PRICE_HARVEST
  );
}
