import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { allPlants } from "@/data/plants";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const rows = await prisma.plantIconOverride.findMany();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as { updates: { plantId: string; emoji: string }[] };
  const { updates } = body;

  if (!Array.isArray(updates)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Build a map of default emojis to detect when an override matches the default
  const defaultEmojis = Object.fromEntries(allPlants.map((p) => [p.id, p.emoji]));

  await prisma.$transaction(
    updates.map(({ plantId, emoji }) => {
      // If the submitted emoji matches the default, delete the override (keep table clean)
      if (emoji === defaultEmojis[plantId]) {
        return prisma.plantIconOverride.deleteMany({ where: { plantId } });
      }
      return prisma.plantIconOverride.upsert({
        where: { plantId },
        create: { plantId, emoji },
        update: { emoji },
      });
    })
  );

  return NextResponse.json({ ok: true });
}
