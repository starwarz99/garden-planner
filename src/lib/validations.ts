import { z } from "zod";

export const wizardDataSchema = z.object({
  widthFt: z.number().min(4).max(200),
  lengthFt: z.number().min(4).max(200),
  usdaZone: z.string().min(2),
  soilType: z.enum(["loamy", "sandy", "clay", "raised-bed"]),
  sunExposure: z.enum(["full-sun", "partial-sun", "partial-shade", "full-shade"]),
  orientation: z.enum(["north", "south", "east", "west"]),
  style: z.enum(["cottage", "formal", "kitchen", "wildflower"]),
  selectedVegetables: z.array(z.string()),
  selectedHerbs: z.array(z.string()),
  selectedFlowers: z.array(z.string()),
  goals: z.array(
    z.enum([
      "maximize-yield",
      "low-maintenance",
      "pollinator-friendly",
      "cut-flowers",
      "culinary-herbs",
      "year-round",
      "organic",
      "kids-garden",
    ])
  ),
  experience: z.enum(["beginner", "intermediate", "expert"]),
  waterPref: z.enum(["low", "moderate", "high"]),
  name: z.string().min(1).max(100),
});

export type WizardDataInput = z.infer<typeof wizardDataSchema>;

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const saveGardenSchema = z.object({
  name: z.string().min(1).max(100),
  wizardData: wizardDataSchema,
  designJson: z.record(z.unknown()),
  svgSnapshot: z.string().optional(),
});
