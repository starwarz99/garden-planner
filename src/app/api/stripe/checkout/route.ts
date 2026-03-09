import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe, STRIPE_PRICES, isStripeConfigured } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json(
      { error: "Payments are not yet configured. Please check back soon!" },
      { status: 503 }
    );
  }

  const body = await req.json();
  const { plan } = body as { plan: "grower" | "harvest" };

  if (!plan || !STRIPE_PRICES[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceConfig = STRIPE_PRICES[plan];
  if (!priceConfig.priceId) {
    return NextResponse.json(
      { error: "This plan is not yet available for purchase." },
      { status: 503 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, name: true, stripeCustomerId: true, stripeSubscriptionId: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    // If user already has an active subscription, upgrade/downgrade it in-place.
    // This cancels the old plan automatically and prorates the billing.
    if (user.stripeSubscriptionId) {
      try {
        const existing = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        if (["active", "trialing"].includes(existing.status)) {
          const itemId = existing.items.data[0]?.id;
          if (itemId) {
            await stripe.subscriptions.update(user.stripeSubscriptionId, {
              items: [{ id: itemId, price: priceConfig.priceId }],
              proration_behavior: "always_invoice",
              metadata: { userId: session.user.id, plan },
            });
            // Update DB immediately — webhook will also confirm
            await prisma.user.update({
              where: { id: session.user.id },
              data: { plan, stripePriceId: priceConfig.priceId },
            });
            return NextResponse.json({ url: `${origin}/account?billing=success` });
          }
        }
      } catch {
        // Subscription not found in this Stripe environment (stale test-mode ID).
        // Clear it and fall through to a fresh checkout session.
        await prisma.user.update({
          where: { id: session.user.id },
          data: { stripeSubscriptionId: null, stripePriceId: null, stripeCustomerId: null },
        });
      }
    }

    // No existing subscription — start a new checkout session
    // Get or create Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: user.name ?? undefined,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceConfig.priceId, quantity: 1 }],
      success_url: `${origin}/account?billing=success`,
      cancel_url: `${origin}/account?billing=cancelled`,
      metadata: { userId: session.user.id, plan },
      subscription_data: {
        metadata: { userId: session.user.id, plan },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
