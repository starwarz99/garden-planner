import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getPlantIconOverrides = cache(async (): Promise<Record<string, string>> => {
  try {
    const rows = await prisma.plantIconOverride.findMany();
    return Object.fromEntries(rows.map((r: { plantId: string; emoji: string }) => [r.plantId, r.emoji]));
  } catch {
    return {};
  }
});
