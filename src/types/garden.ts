// ─────────────────────────────────────────────
// Wizard input types
// ─────────────────────────────────────────────

export type PlantQuantity = "less" | "medium" | "more";
export type SoilType = "loamy" | "sandy" | "clay" | "raised-bed";
export type SunExposure = "full-sun" | "partial-sun" | "partial-shade" | "full-shade";
export type Orientation = "north" | "south" | "east" | "west";
export type GardenStyle = "cottage" | "formal" | "kitchen" | "wildflower";
export type WalkwayStyle = "none" | "straight" | "curved" | "stepping-stones";
export type ExperienceLevel = "beginner" | "intermediate" | "expert";
export type WaterPreference = "low" | "moderate" | "high";
export type GardenGoal =
  | "maximize-yield"
  | "low-maintenance"
  | "pollinator-friendly"
  | "cut-flowers"
  | "culinary-herbs"
  | "year-round"
  | "organic"
  | "kids-garden";

// ─────────────────────────────────────────────
// Plant types
// ─────────────────────────────────────────────

export interface Plant {
  id: string;
  name: string;
  emoji: string;
  spacingFt: number;       // spacing needed per plant in feet
  minZone: number;         // min USDA hardiness zone number
  maxZone: number;
  sunNeeds: SunExposure[];
  waterNeeds: WaterPreference;
  category: "vegetable" | "herb" | "flower";
  companions?: string[];   // plant IDs that grow well together
  antagonists?: string[];  // plant IDs to avoid
  soilPreference?: SoilType[];
  description: string;
  plantingMonths?: number[]; // 1=Jan … 12=Dec
}

// ─────────────────────────────────────────────
// Wizard data (collected across 10 steps)
// ─────────────────────────────────────────────

export interface WizardData {
  // Step 1
  widthFt: number;
  lengthFt: number;
  // Step 2
  usdaZone: string;
  // Step 3
  soilType: SoilType;
  // Step 4
  sunExposure: SunExposure;
  orientation: Orientation;
  // Step 5
  style: GardenStyle;
  walkwayStyle: WalkwayStyle;
  walkwayWidth: 2 | 4; // feet (2ft = 1 cell, 4ft = 2 cells)
  // Step 6
  selectedVegetables: string[];
  vegetableQuantities: Record<string, PlantQuantity>;
  // Step 7
  selectedHerbs: string[];
  herbQuantities: Record<string, PlantQuantity>;
  // Step 8
  selectedFlowers: string[];
  flowerQuantities: Record<string, PlantQuantity>;
  // Step 9
  goals: GardenGoal[];
  experience: ExperienceLevel;
  waterPref: WaterPreference;
  // Step 10
  name: string;
}

// ─────────────────────────────────────────────
// Garden design (returned from Claude)
// ─────────────────────────────────────────────

export interface PlantCell {
  plantId: string;
  plantName: string;
  emoji: string;
  zoneColor: string;
  note?: string;
}

export interface PathCell {
  isPath: true;
  pathStyle: WalkwayStyle;
}

export interface GardenZone {
  name: string;
  color: string;
  description: string;
}

export interface GardenDesign {
  grid: (PlantCell | PathCell | null)[][];   // [row][col], each cell = 2ft × 2ft
  zones: GardenZone[];
  companionNotes: string[];
  zoneTips: string[];
  careCalendar: Record<string, string[]>;
  designNotes: string;
  estimatedYield: string;
}

// ─────────────────────────────────────────────
// Saved garden (from database)
// ─────────────────────────────────────────────

export interface SavedGarden {
  id: string;
  userId: string;
  name: string;
  slug: string;
  widthFt: number;
  lengthFt: number;
  usdaZone: string;
  soilType: string;
  sunExposure: string;
  orientation: string;
  style: string;
  experience: string;
  goals: string[];
  waterPref: string;
  wantedPlants: string[];
  designJson: GardenDesign;
  svgSnapshot?: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsdaZone {
  id: string;       // e.g. "6b"
  label: string;    // e.g. "Zone 6b"
  minTemp: number;  // °F
  maxTemp: number;
  firstFrost: string; // "Oct 15"
  lastFrost: string;  // "Apr 15"
  description: string;
}
