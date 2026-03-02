import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Temporary diagnostic endpoint — remove after debugging
export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Check env vars are present (don't expose values)
  results.hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  results.hasDirectUrl = !!process.env.DIRECT_URL;
  results.hasDatabaseUrl = !!process.env.DATABASE_URL;
  results.hasAuthSecret = !!process.env.AUTH_SECRET;

  // 2. Test Anthropic API
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 10,
      messages: [{ role: "user", content: "say ok" }],
    });
    results.anthropic = "ok";
    results.anthropicModel = msg.model;
  } catch (e) {
    results.anthropic = "error";
    results.anthropicError = e instanceof Error ? `${e.constructor.name}: ${e.message}` : String(e);
  }

  // 3. Test Prisma/DB
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
