import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { PlantOverride } from "@/lib/plant-icon-config";

export const getPlantIconOverrides = cache(async (): Promise<Record<string, PlantOverride>> => {
  try {
    const rows = await prisma.plantIconOverride.findMany();
    return Object.fromEntries(
      rows.map((r) => [
        r.plantId,
        { emoji: r.emoji ?? undefined, bgColor: r.bgColor ?? undefined },
      ])
    );
  } catch {
    return {};
  }
});
