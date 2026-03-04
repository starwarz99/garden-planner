import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, planFromPriceId } from "@/lib/stripe";
import type Stripe from "stripe";

// Stripe requires the raw body for signature verification — do NOT use req.json()
export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET ?? "").trim();
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }


  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        if (!userId || !plan) break;

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string, {
          expand: ["latest_invoice"],
        });
        const priceId = subscription.items.data[0]?.price.id ?? "";

        // current_period_end was removed in Stripe API 2026-02-25.clover;
        // fall back to latest_invoice.period_end for the renewal date.
        const latestInvoice = subscription.latest_invoice as Stripe.Invoice | null;
        const periodEnd = latestInvoice?.period_end ?? null;

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: planFromPriceId(priceId) || plan,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
            stripeCancelAtPeriodEnd: false,
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price.id ?? "";
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        const isActive = ["active", "trialing"].includes(subscription.status);
        const sub = subscription as unknown as { cancel_at_period_end: boolean; cancel_at: number | null };
        // Treat as cancelling if either cancel_at_period_end is true OR a specific cancel_at date is scheduled
        const isCancelling = sub.cancel_at_period_end || (sub.cancel_at != null && sub.cancel_at > 0);

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: isActive ? planFromPriceId(priceId) : "seedling",
            stripePriceId: priceId,
            stripeCancelAtPeriodEnd: isCancelling,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        // Only downgrade if this is still the user's current subscription in the DB.
        // If the user already has a different active subscription recorded, ignore this deletion.
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { stripeSubscriptionId: true },
        });
        if (dbUser?.stripeSubscriptionId !== subscription.id) break;

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "seedling",
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            stripeCancelAtPeriodEnd: false,
          },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        // Stripe API 2026-02-25.clover moved the subscription ref to invoice.parent.subscription_details.subscription
        const subscriptionId =
          invoice.parent?.subscription_details?.subscription as string | undefined
          ?? (invoice as unknown as { subscription?: string }).subscription;
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        // Use invoice.period_end (available on the invoice) for the renewal date
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeCurrentPeriodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : null,
          },
        });
        break;
      }

      case "invoice.payment_failed": {
        // Log it — optionally email the user
        const invoice = event.data.object as Stripe.Invoice;
        console.warn("Payment failed for invoice:", invoice.id, "customer:", invoice.customer);
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
