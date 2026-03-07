import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { allPlants } from "@/data/plants";
import { DEFAULT_PLANT_BG } from "@/lib/plant-icon-config";

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

  const body = await req.json() as { updates: { plantId: string; emoji: string; bgColor: string }[] };
  const { updates } = body;

  if (!Array.isArray(updates)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const plantMap = Object.fromEntries(allPlants.map((p) => [p.id, p]));

  await prisma.$transaction(
    updates.map(({ plantId, emoji, bgColor }) => {
      const plant = plantMap[plantId];
      const defaultEmoji = plant?.emoji ?? "";
      const defaultBg = DEFAULT_PLANT_BG[plant?.category ?? ""] ?? "#f0fdf4";

      // Both match defaults → remove override row entirely
      if (emoji === defaultEmoji && bgColor === defaultBg) {
        return prisma.plantIconOverride.deleteMany({ where: { plantId } });
      }

      return prisma.plantIconOverride.upsert({
        where: { plantId },
        create: {
          plantId,
          emoji:   emoji   !== defaultEmoji ? emoji   : undefined,
          bgColor: bgColor !== defaultBg    ? bgColor : undefined,
        },
        update: {
          emoji:   emoji   !== defaultEmoji ? emoji   : undefined,
          bgColor: bgColor !== defaultBg    ? bgColor : undefined,
        },
      });
    })
  );

  return NextResponse.json({ ok: true });
}
