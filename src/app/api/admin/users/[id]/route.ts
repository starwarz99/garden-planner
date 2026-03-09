import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

type Params = { params: Promise<{ id: string }> };

// POST /api/admin/users/[id] — cancel the user's Stripe subscription
export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, stripeSubscriptionId: true, stripeCancelAtPeriodEnd: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (!user.stripeSubscriptionId) {
    return NextResponse.json({ error: "User has no active subscription" }, { status: 400 });
  }

  // Cancel at period end via Stripe (so they keep access until billing cycle ends)
  if (stripe) {
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
  }

  // Reflect in DB immediately
  await prisma.user.update({
    where: { id },
    data: { stripeCancelAtPeriodEnd: true },
  });

  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/users/[id] — permanently delete user and all their data
export async function DELETE(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  // Prevent deleting yourself
  if (session.user.id === id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { stripeSubscriptionId: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Cancel Stripe subscription immediately before deleting
  if (stripe && user.stripeSubscriptionId) {
    try {
      await stripe.subscriptions.cancel(user.stripeSubscriptionId);
    } catch {
      // Subscription may already be cancelled — proceed with deletion anyway
    }
  }

  // Cascade deletes: gardens, accounts, sessions, visits (via schema relations)
  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
