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
      select: { email: true, name: true, stripeCustomerId: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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

    const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

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
