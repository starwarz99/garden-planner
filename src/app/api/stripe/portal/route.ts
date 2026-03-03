import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json(
      { error: "Payments are not yet configured." },
      { status: 503 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: "No billing account found." }, { status: 404 });
    }

    const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${origin}/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Stripe portal error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Portal access failed" },
      { status: 500 }
    );
  }
}
