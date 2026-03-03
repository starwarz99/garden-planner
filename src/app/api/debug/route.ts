import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import Stripe from "stripe";

// Temporary diagnostic endpoint — remove after debugging
export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Check env vars are present
  const apiKey = process.env.ANTHROPIC_API_KEY ?? "";
  results.hasAnthropicKey = !!apiKey;
  results.keyPrefix = apiKey ? apiKey.slice(0, 12) + "..." : "missing";
  results.keyHasWhitespace = apiKey !== apiKey.trim();
  results.hasDirectUrl = !!process.env.DIRECT_URL;
  results.hasDatabaseUrl = !!process.env.DATABASE_URL;
  results.hasAuthSecret = !!process.env.AUTH_SECRET;

  // 2. Test raw fetch (no SDK) to Anthropic API
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey.trim(),
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 10,
        messages: [{ role: "user", content: "say ok" }],
      }),
    });
    const data = await res.json() as Record<string, unknown>;
    results.rawFetch = res.ok ? "ok" : "http_error";
    results.rawFetchStatus = res.status;
    if (!res.ok) results.rawFetchBody = data;
  } catch (e) {
    results.rawFetch = "error";
    results.rawFetchError = e instanceof Error ? `${e.constructor.name}: ${e.message}` : String(e);
  }

  // 3. Test Anthropic SDK
  try {
    const client = new Anthropic({ apiKey: apiKey.trim() });
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 10,
      messages: [{ role: "user", content: "say ok" }],
    });
    results.anthropicSdk = "ok";
    results.anthropicModel = msg.model;
  } catch (e) {
    results.anthropicSdk = "error";
    results.anthropicSdkError = e instanceof Error ? `${e.constructor.name}: ${e.message}` : String(e);
  }

  // 4. Test Stripe connectivity
  results.hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
  try {
    const s = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
    const products = await s.products.list({ limit: 1 });
    results.stripe = "ok";
    results.stripeProducts = products.data.length;
  } catch (e) {
    results.stripe = "error";
    results.stripeError = e instanceof Error ? `${e.constructor.name}: ${e.message}` : String(e);
  }

  // 5. Test Prisma/DB
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$queryRaw`SELECT 1`;
    results.db = "ok";
  } catch (e) {
    results.db = "error";
    results.dbError = e instanceof Error ? `${e.constructor.name}: ${e.message}` : String(e);
  }

  return NextResponse.json(results);
}
