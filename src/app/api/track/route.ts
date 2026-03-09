import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Known bot patterns — skip logging these
const BOT_RE = /bot|crawler|spider|slurp|bingbot|googlebot|yandex|baidu|duckduck|semrush|ahrefs|mj12|petalbot/i;

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      path?: string;
      search?: string;
      referrer?: string;
    };

    const ua = req.headers.get("user-agent") ?? null;

    // Skip bots
    if (ua && BOT_RE.test(ua)) {
      return NextResponse.json({ ok: true });
    }

    // Get authenticated user (JWT check — no DB round-trip)
    const session = await auth();

    // IP: Vercel sets x-forwarded-for; take the first (client) IP
    const forwarded = req.headers.get("x-forwarded-for");
    const ipAddress = forwarded
      ? forwarded.split(",")[0].trim()
      : (req.headers.get("x-real-ip") ?? null);

    // Vercel injects geo headers in production
    const country = req.headers.get("x-vercel-ip-country") ?? null;
    const city    = req.headers.get("x-vercel-ip-city")    ?? null;

    // Parse UTM / click IDs from the query string sent by the client
    const search = new URLSearchParams(body.search ?? "");

    const FIVE_DAYS_AGO = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

    await prisma.$transaction([
      // Auto-delete visits older than 5 days
      prisma.siteVisit.deleteMany({
        where: { createdAt: { lt: FIVE_DAYS_AGO } },
      }),
      // Log this visit
      prisma.siteVisit.create({
        data: {
          path:        body.path ?? "/",
          referrer:    body.referrer || null,
          userAgent:   ua,
          ipAddress,
          country,
          city,
          utmSource:   search.get("utm_source"),
          utmMedium:   search.get("utm_medium"),
          utmCampaign: search.get("utm_campaign"),
          utmContent:  search.get("utm_content"),
          fbclid:      search.get("fbclid"),
          gclid:       search.get("gclid"),
          userId:      session?.user?.id ?? null,
        },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    // Never surface errors to client — tracking is best-effort
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
