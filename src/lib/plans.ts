export type Plan = "seedling" | "grower" | "harvest";

export interface PlanConfig {
  name: string;
  emoji: string;
  tagline: string;
  maxGardens: number;
  maxDimension: number | null; // max width/length in ft; null = unlimited
  canRegenerate: boolean;
  canSavePreferences: boolean;
  canAdjustQuantity: boolean;
  canSeeYield: boolean;
  canSeeCareCalendar: boolean;
}

export const PLANS: Record<Plan, PlanConfig> = {
  seedling: {
    name: "Seedling",
    emoji: "🌱",
    tagline: "Free forever",
    maxGardens: 1,
    maxDimension: 12,
    canRegenerate: false,
    canSavePreferences: false,
    canAdjustQuantity: false,
    canSeeYield: false,
    canSeeCareCalendar: false,
  },
  grower: {
    name: "Grower",
    emoji: "🌿",
    tagline: "Pro",
    maxGardens: 3,
    maxDimension: 40,
    canRegenerate: true,
    canSavePreferences: true,
    canAdjustQuantity: true,
    canSeeYield: true,
    canSeeCareCalendar: false,
  },
  harvest: {
    name: "Harvest",
    emoji: "🌻",
    tagline: "Premium",
    maxGardens: 5,
    maxDimension: 60,
    canRegenerate: true,
    canSavePreferences: true,
    canAdjustQuantity: true,
    canSeeYield: true,
    canSeeCareCalendar: true,
  },
};

export function getPlanConfig(plan: string): PlanConfig {
  return PLANS[plan as Plan] ?? PLANS.seedling;
}
