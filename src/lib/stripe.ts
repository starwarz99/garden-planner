import Stripe from "stripe";

// Stripe client — null when key is not yet configured
// No explicit apiVersion — the SDK uses its own built-in default
export const stripe: Stripe | null = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Price IDs — set these in env after creating products in the Stripe dashboard
export const STRIPE_PRICES: Record<"grower" | "harvest", { priceId: string; amount: number; label: string }> = {
  grower: {
    priceId: process.env.STRIPE_PRICE_GROWER ?? "",
    amount: 5.99,
    label: "$5.99 / month",
  },
  harvest: {
    priceId: process.env.STRIPE_PRICE_HARVEST ?? "",
    amount: 9.99,
    label: "$9.99 / month",
  },
};

/** Given a Stripe price ID, return the matching plan name. */
export function planFromPriceId(priceId: string): string {
  if (priceId === STRIPE_PRICES.grower.priceId && STRIPE_PRICES.grower.priceId) return "grower";
  if (priceId === STRIPE_PRICES.harvest.priceId && STRIPE_PRICES.harvest.priceId) return "harvest";
  return "seedling";
}

/** Return true when Stripe is fully configured (key + both price IDs are set). */
export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_PRICE_GROWER &&
    process.env.STRIPE_PRICE_HARVEST
  );
}
