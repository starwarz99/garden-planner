import type {
  WizardData,
  GardenDesign,
  PlantCell,
  PathCell,
  SubgridCell,
  GardenZone,
  Plant,
} from "@/types/garden";
import { allPlants } from "@/data/plants";
import { getZoneById, getZoneNumber } from "@/data/usda-zones";
import { companionPairs } from "@/data/companion-planting";

type AnyCell = PlantCell | PathCell | SubgridCell | null;

// ─── Plant family / zone color mappings ───────────────────────────────────────

const FAMILY_MAP: Record<string, string> = {
  tomato: "nightshade", pepper: "nightshade", eggplant: "nightshade",
  cucumber: "cucurbit", zucchini: "cucurbit", "winter-squash": "cucurbit",
  pumpkin: "cucurbit", watermelon: "cucurbit", cantaloupe: "cucurbit",
  lettuce: "leafy", spinach: "leafy", arugula: "leafy", "swiss-chard": "leafy", "bok-choy": "leafy",
  broccoli: "brassica", cabbage: "brassica", cauliflower: "brassica",
  "brussels-sprouts": "brassica", kohlrabi: "brassica", kale: "brassica",
  carrot: "root", radish: "root", beet: "root", turnip: "root", parsnip: "root",
  onion: "allium", garlic: "allium", leek: "allium",
  bean: "legume", pea: "legume",
};

const FAMILY_COLOR: Record<string, string> = {
  nightshade: "#f87171",
  cucurbit:   "#4ade80",
  leafy:      "#86efac",
  brassica:   "#22d3ee",
  root:       "#fbbf24",
  allium:     "#a855f7",
  legume:     "#84cc16",
  other:      "#fb923c",
};

const HERB_COLOR   = "#6ee7b7";
const FLOWER_COLOR = "#f9a8d4";

function getFamily(id: string): string {
  return FAMILY_MAP[id] ?? "other";
}

function getVegZoneColor(id: string): string {
  return FAMILY_COLOR[getFamily(id)] ?? FAMILY_COLOR.other;
}

// ─── Sun / zone compatibility ─────────────────────────────────────────────────

function isZoneOk(p: Plant, zoneNum: number): boolean {
  return zoneNum >= p.minZone && zoneNum <= p.maxZone;
}

function isSunOk(p: Plant, sunExposure: string): boolean {
  switch (sunExposure) {
    case "full-shade":
      return p.sunNeeds.some(s => s === "partial-shade" || s === "full-shade");
    case "partial-shade":
      return p.sunNeeds.some(s => s !== "full-sun");
    case "full-sun":
      return p.sunNeeds.some(s => s === "full-sun" || s === "partial-sun");
    default:
      return true; // partial-sun is lenient
  }
}

// ─── Auto-select when nothing is chosen ───────────────────────────────────────

function autoSelectVegs(zoneNum: number, sunExposure: string): Plant[] {
  const candidates = allPlants.filter(
    p => p.category === "vegetable" && isZoneOk(p, zoneNum) && isSunOk(p, sunExposure)
  );
  const preferred = ["tomato", "lettuce", "cucumber", "carrot", "bean", "spinach", "pepper"];
  const picks = preferred
    .map(id => candidates.find(p => p.id === id))
    .filter((p): p is Plant => p !== undefined)
    .slice(0, 5);
  return picks.length > 0 ? picks : candidates.slice(0, 4);
}

function autoSelectHerbs(zoneNum: number): Plant[] {
  const candidates = allPlants.filter(p => p.category === "herb" && isZoneOk(p, zoneNum));
  return ["basil", "parsley", "chive", "thyme"]
    .map(id => candidates.find(p => p.id === id))
    .filter((p): p is Plant => p !== undefined)
    .slice(0, 3);
}

function autoSelectFlowers(zoneNum: number): Plant[] {
  const candidates = allPlants.filter(p => p.category === "flower" && isZoneOk(p, zoneNum));
  return ["marigold", "nasturtium", "zinnia"]
    .map(id => candidates.find(p => p.id === id))
    .filter((p): p is Plant => p !== undefined)
    .slice(0, 2);
}

// ─── Walkway path mask ────────────────────────────────────────────────────────

function buildPathMask(rows: number, cols: number, data: WizardData): boolean[][] {
  const mask: boolean[][] = Array.from({ length: rows }, () =>
    new Array<boolean>(cols).fill(false)
  );
  if (data.walkwayStyle === "none") return mask;

  const pathW = data.walkwayWidth / 2; // in grid cells (1 or 2)

  if (data.walkwayStyle === "straight") {
    if (data.style === "formal") {
      // Cross pattern: center horizontal + center vertical
      const midR = Math.floor(rows / 2);
      const midC = Math.floor(cols / 2);
      for (let c = 0; c < cols; c++)
        for (let pw = 0; pw < pathW; pw++)
          if (midR + pw < rows) mask[midR + pw][c] = true;
      for (let r = 0; r < rows; r++)
        for (let pw = 0; pw < pathW; pw++)
          if (midC + pw < cols) mask[r][midC + pw] = true;
    } else {
      // Horizontal path slightly below center
      const pathR = Math.min(Math.floor(rows * 0.55), rows - pathW - 1);
      for (let c = 0; c < cols; c++)
        for (let pw = 0; pw < pathW; pw++)
          if (pathR + pw < rows) mask[pathR + pw][c] = true;
    }
  } else if (data.walkwayStyle === "curved") {
    // Zigzag vertical path through the garden
    let col = Math.floor(cols / 2);
    for (let r = 0; r < rows; r++) {
      for (let pw = 0; pw < pathW; pw++)
        if (col + pw < cols) mask[r][col + pw] = true;
      if (r % 3 === 1) col = Math.max(0, col - 1);
      else if (r % 3 === 2) col = Math.min(cols - pathW, col + 1);
    }
  } else if (data.walkwayStyle === "stepping-stones") {
    // Scattered stepping stones forming a route
    let col = 1;
    for (let r = 1; r < rows; r += 2) {
      mask[r][Math.min(col, cols - 1)] = true;
      col = (col + 2) % Math.max(1, cols);
    }
  }

  return mask;
}

// ─── Herb/flower sub-slot list ────────────────────────────────────────────────

function getSubslotCount(id: string, qty: string): number {
  if (qty === "less")   return 2;
  if (qty === "more")   return 8;
  return 4; // medium = one full SubgridCell
}

function buildHerbFlowerSubslots(
  herbs: Plant[],
  flowers: Plant[],
  allQty: Record<string, string>
): PlantCell[] {
  const subslots: PlantCell[] = [];
  const lookupName = (id: string) => allPlants.find(p => p.id === id)?.name ?? id;

  for (const h of herbs) {
    const count = getSubslotCount(h.id, allQty[h.id] ?? "medium");
    const compNote = (h.companions ?? []).slice(0, 2)
      .map(lookupName).join(", ");
    for (let i = 0; i < count; i++) {
      subslots.push({
        plantId: h.id,
        plantName: h.name,
        emoji: h.emoji,
        zoneColor: HERB_COLOR,
        note: i === 0 ? (compNote ? `Pair with: ${compNote}` : h.description.split(".")[0]) : undefined,
      });
    }
  }

  for (const f of flowers) {
    const count = getSubslotCount(f.id, allQty[f.id] ?? "medium");
    for (let i = 0; i < count; i++) {
      subslots.push({
        plantId: f.id,
        plantName: f.name,
        emoji: f.emoji,
        zoneColor: FLOWER_COLOR,
        note: i === 0 ? f.description.split(".")[0] : undefined,
      });
    }
  }

  return subslots;
}

// ─── Vegetable cell list ──────────────────────────────────────────────────────

function buildVegCells(
  vegs: Plant[],
  allQty: Record<string, string>,
  vegBudget: number
): PlantCell[] {
  if (vegs.length === 0) return [];

  // Group by family so companions end up adjacent in the grid
  const sorted = [...vegs].sort((a, b) =>
    getFamily(a.id).localeCompare(getFamily(b.id))
  );

  const lookupName = (id: string) => allPlants.find(p => p.id === id)?.name ?? id;

  // Proportional weight: less=1, medium=2, more=4
  // This ensures the full vegBudget is used regardless of garden size
  const weights = sorted.map(p => {
    const qty = allQty[p.id] ?? "medium";
    if (qty === "less") return 1;
    if (qty === "more") return 4;
    return 2;
  });
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const cells: PlantCell[] = [];
  let remaining = vegBudget;

  for (let i = 0; i < sorted.length && remaining > 0; i++) {
    const p = sorted[i];
    const isLast = i === sorted.length - 1;
    const count = isLast
      ? Math.max(1, remaining) // give leftover cells to last plant
      : Math.max(1, Math.min(Math.round((weights[i] / totalWeight) * vegBudget), remaining));
    const color = getVegZoneColor(p.id);
    const compNote = (p.companions ?? []).slice(0, 2).map(lookupName).join(", ");
    const note = compNote ? `Pair with: ${compNote}` : p.description.split(".")[0];

    for (let j = 0; j < count; j++) {
      cells.push({
        plantId: p.id,
        plantName: p.name,
        emoji: p.emoji,
        zoneColor: color,
        note: j === 0 ? note : undefined,
      });
    }
    remaining -= count;
  }

  return cells;
}

// ─── SubgridCell position designation ────────────────────────────────────────

function designateHerbFlowerPositions(
  available: [number, number][],
  count: number,
  style: string,
  rows: number
): [number, number][] {
  if (count === 0) return [];

  const edgeRows = new Set<number>();
  if (style === "kitchen") {
    edgeRows.add(0);
    if (rows > 2) edgeRows.add(rows - 1);
  } else if (style === "wildflower") {
    for (let r = 0; r < rows; r += 2) edgeRows.add(r);
  } else if (style === "cottage") {
    edgeRows.add(0);
    for (let r = 2; r < rows; r += 4) edgeRows.add(r);
  } else {
    // formal: border rows only
    edgeRows.add(0);
    if (rows > 1) edgeRows.add(rows - 1);
  }

  const edgePositions = available.filter(([r]) => edgeRows.has(r));

  // If not enough edge positions, pad from anywhere
  const extra = available
    .filter(([r, c]) => !edgePositions.some(([er, ec]) => er === r && ec === c))
    .slice(0, Math.max(0, count - edgePositions.length));

  return [...edgePositions, ...extra].slice(0, count);
}

// ─── Zones metadata ───────────────────────────────────────────────────────────

const FAMILY_ZONE_INFO: Record<string, { name: string; desc: string }> = {
  nightshade: { name: "Tomato & Pepper Zone", desc: "Sun-loving fruiting vegetables" },
  cucurbit:   { name: "Cucurbit Zone",        desc: "Sprawling vines and summer squash" },
  leafy:      { name: "Salad Corner",         desc: "Cool-season leafy greens" },
  brassica:   { name: "Brassica Row",         desc: "Cabbage family vegetables" },
  root:       { name: "Root Zone",            desc: "Underground root vegetables" },
  allium:     { name: "Allium Border",        desc: "Onions, garlic, and leeks" },
  legume:     { name: "Legume Zone",          desc: "Nitrogen-fixing beans and peas" },
  other:      { name: "Specialty Zone",       desc: "Other vegetables" },
};

function buildZones(vegs: Plant[], herbs: Plant[], flowers: Plant[]): GardenZone[] {
  const zones: GardenZone[] = [];
  const seenFamilies = new Set<string>();

  for (const v of vegs) {
    const fam = getFamily(v.id);
    if (!seenFamilies.has(fam)) {
      seenFamilies.add(fam);
      const info = FAMILY_ZONE_INFO[fam];
      if (info) {
        zones.push({ name: info.name, color: FAMILY_COLOR[fam] ?? FAMILY_COLOR.other, description: info.desc });
      }
    }
  }

  if (herbs.length > 0)
    zones.push({ name: "Herb Garden", color: HERB_COLOR, description: "Culinary and medicinal herbs" });
  if (flowers.length > 0)
    zones.push({ name: "Pollinator Border", color: FLOWER_COLOR, description: "Flowers for pollinators and pest control" });

  return zones;
}

// ─── Companion notes ──────────────────────────────────────────────────────────

function buildCompanionNotes(vegs: Plant[], herbs: Plant[], flowers: Plant[]): string[] {
  const selected = new Set([...vegs, ...herbs, ...flowers].map(p => p.id));
  const notes: string[] = [];

  for (const pair of companionPairs) {
    if (
      pair.relationship === "good" &&
      selected.has(pair.plant1) &&
      selected.has(pair.plant2)
    ) {
      const p1 = allPlants.find(p => p.id === pair.plant1);
      const p2 = allPlants.find(p => p.id === pair.plant2);
      if (p1 && p2) notes.push(`${p1.name} + ${p2.name}: ${pair.reason}`);
    }
  }

  return notes.slice(0, 6);
}

// ─── Zone tips ────────────────────────────────────────────────────────────────

function buildZoneTips(
  zoneId: string,
  zoneInfo: ReturnType<typeof getZoneById>,
  vegs: Plant[]
): string[] {
  const tips: string[] = [];
  const lastFrost  = zoneInfo?.lastFrost  ?? "spring";
  const firstFrost = zoneInfo?.firstFrost ?? "fall";

  if (zoneInfo) {
    tips.push(
      `Zone ${zoneId}: Last frost ${lastFrost}, first frost ${firstFrost}. Plan your planting schedule around these dates.`
    );
  }

  const families = new Set(vegs.map(v => getFamily(v.id)));

  if (families.has("nightshade"))
    tips.push(`Start tomatoes and peppers indoors 6–8 weeks before last frost (around ${lastFrost}).`);
  if (families.has("brassica"))
    tips.push(`Brassicas prefer cool weather — transplant 4 weeks before last frost or start a fall crop in late summer.`);
  if (families.has("root"))
    tips.push(`Root vegetables need loose, well-aerated soil. Amend with compost and avoid compacting.`);
  if (families.has("cucurbit"))
    tips.push(`Cucurbits need warm soil (60°F+). Direct-sow after all frost danger has passed.`);
  if (families.has("legume"))
    tips.push(`Beans and peas fix nitrogen — avoid adding extra nitrogen fertilizer; it promotes foliage over pods.`);

  return tips.slice(0, 5);
}

// ─── Care calendar ────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function parseMonthNum(dateStr: string): number {
  if (!dateStr || dateStr === "None") return 0; // 0 = tropical, no frost
  const abbr = dateStr.split(" ")[0];
  const map: Record<string, number> = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
  };
  return map[abbr] ?? 4;
}

function buildCareCalendar(
  vegs: Plant[],
  herbs: Plant[],
  flowers: Plant[],
  zoneInfo: ReturnType<typeof getZoneById>
): Record<string, string[]> {
  const cal: Record<string, string[]> = {};
  MONTH_NAMES.forEach(m => (cal[m] = []));

  const lastFrostMonth = parseMonthNum(zoneInfo?.lastFrost ?? "Apr 15");

  // Static annual tasks
  cal["January"].push("Plan seed orders and review last season's notes", "Clean and sharpen garden tools");
  cal["February"].push("Start slow-germinating seeds indoors (peppers, eggplant)", "Order seeds and supplies");
  cal["March"].push("Prepare beds: add compost, turn soil", "Check seed-starting supplies");
  cal["November"].push("Plant garlic for next year", "Add mulch to protect beds");
  cal["December"].push("Clean up beds and add compost", "Mulch perennial herbs for winter protection");

  // Plant-specific tasks
  for (const plant of [...vegs, ...herbs, ...flowers]) {
    if (!plant.plantingMonths) continue;
    for (const month of plant.plantingMonths) {
      const monthName = MONTH_NAMES[month - 1];
      const location = lastFrostMonth === 0 || month > lastFrostMonth ? "outdoors" : "indoors";
      const task = `Start ${plant.name} ${location}`;
      if (!cal[monthName].includes(task)) cal[monthName].push(task);
    }
  }

  // Cap at 5 tasks per month, deduplicate
  for (const m of MONTH_NAMES) {
    cal[m] = [...new Set(cal[m])].slice(0, 5);
  }

  return cal;
}

// ─── Design notes ─────────────────────────────────────────────────────────────

function buildDesignNotes(
  data: WizardData,
  vegs: Plant[],
  herbs: Plant[],
  flowers: Plant[]
): string {
  const styleDesc: Record<string, string> = {
    cottage:    "cottage-style with informal clusters",
    formal:     "formal symmetric layout",
    kitchen:    "kitchen garden with efficient rows",
    wildflower: "naturalistic wildflower design",
  };

  const desc = styleDesc[data.style] ?? "mixed-style layout";
  const vegNames = vegs.slice(0, 3).map(v => v.name).join(", ");
  const herbNames = herbs.slice(0, 2).map(h => h.name).join(", ");

  let notes = `This ${desc} is optimized for Zone ${data.usdaZone} with ${data.soilType} soil and ${data.sunExposure.replace(/-/g, " ")} conditions. `;
  if (vegNames) notes += `Key vegetables — ${vegNames} — are grouped by plant family to simplify care and maximize companion benefits. `;
  if (herbNames) notes += `${herbNames} are positioned near compatible vegetables for natural pest control and flavor enhancement. `;
  if (flowers.length > 0) notes += `Flowers attract beneficial insects and add beauty throughout the season.`;

  return notes.trim();
}

// ─── Estimated yield ──────────────────────────────────────────────────────────

const YIELD_PER_CELL: Record<string, string> = {
  tomato:            "15–20 lbs per plant",
  cucumber:          "10–15 fruits per plant",
  zucchini:          "20–30 lbs per plant",
  lettuce:           "0.5 lbs per plant",
  spinach:           "0.5–1 lb per plant",
  pepper:            "5–10 lbs per plant",
  carrot:            "0.5 lbs per sq ft",
  bean:              "0.5 lbs per sq ft",
  pea:               "0.3 lbs per sq ft",
  broccoli:          "1–2 lbs per plant",
  kale:              "1–2 lbs per plant",
  corn:              "2–4 ears per plant",
  potato:            "3–5 lbs per plant",
  onion:             "0.5 lbs per bulb",
  garlic:            "1 head per plant",
  radish:            "handful per sq ft",
  beet:              "0.5 lbs per sq ft",
  "swiss-chard":     "1–2 lbs per plant",
  eggplant:          "5–8 lbs per plant",
  "winter-squash":   "10–20 lbs per plant",
  pumpkin:           "10–20 lbs per plant",
  watermelon:        "15–30 lbs per plant",
  cantaloupe:        "5–10 lbs per plant",
  strawberry:        "1 lb per plant",
};

function buildEstimatedYield(vegs: Plant[]): string {
  if (vegs.length === 0) return "Yield depends on plant choices and growing conditions.";
  const lines = vegs
    .filter(v => YIELD_PER_CELL[v.id])
    .slice(0, 5)
    .map(v => `${v.name} (${YIELD_PER_CELL[v.id]})`);
  if (lines.length === 0) return "Yield depends on plant choices and growing conditions.";
  return `Expected harvest: ${lines.join(", ")}. Actual yield varies by season and care.`;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateGardenDesign(
  data: WizardData,
  includeCareCalendar = false
): GardenDesign {
  const zoneNum  = getZoneNumber(data.usdaZone);
  const zoneInfo = getZoneById(data.usdaZone);
  const gridCols = Math.floor(data.widthFt / 2);
  const gridRows = Math.floor(data.lengthFt / 2);

  const allQty: Record<string, string> = {
    ...data.vegetableQuantities,
    ...data.herbQuantities,
    ...data.flowerQuantities,
  };

  // Filter selected plants by zone / sun compatibility
  let vegs = data.selectedVegetables
    .map(id => allPlants.find(p => p.id === id))
    .filter((p): p is Plant => p !== undefined)
    .filter(p => isZoneOk(p, zoneNum) && isSunOk(p, data.sunExposure));

  let herbs = data.selectedHerbs
    .map(id => allPlants.find(p => p.id === id))
    .filter((p): p is Plant => p !== undefined)
    .filter(p => isZoneOk(p, zoneNum));

  let flowers = data.selectedFlowers
    .map(id => allPlants.find(p => p.id === id))
    .filter((p): p is Plant => p !== undefined)
    .filter(p => isZoneOk(p, zoneNum));

  // Fall back to auto-selection if nothing valid
  if (vegs.length === 0 && herbs.length === 0 && flowers.length === 0) {
    vegs    = autoSelectVegs(zoneNum, data.sunExposure);
    herbs   = autoSelectHerbs(zoneNum);
    flowers = autoSelectFlowers(zoneNum);
  }

  // ── Build path mask ──
  const pathMask = buildPathMask(gridRows, gridCols, data);

  // Collect available (non-path) cells in row-major order
  const available: [number, number][] = [];
  for (let r = 0; r < gridRows; r++)
    for (let c = 0; c < gridCols; c++)
      if (!pathMask[r][c]) available.push([r, c]);

  // Reserve ~15% for air circulation (null cells)
  const plantableCells = Math.floor(available.length * 0.85);

  // ── Herb/flower SubgridCell packing ──
  const herbFlowerSubslots = buildHerbFlowerSubslots(herbs, flowers, allQty);
  const subgridCellCount   = Math.ceil(herbFlowerSubslots.length / 4);

  // ── Vegetable cells ──
  const vegBudget   = Math.max(0, plantableCells - subgridCellCount);
  const vegCellList = buildVegCells(vegs, allQty, vegBudget);

  // ── Assign positions ──
  const herbFlowerPositions = designateHerbFlowerPositions(
    available, subgridCellCount, data.style, gridRows
  );
  const hfPosKey = new Set(herbFlowerPositions.map(([r, c]) => `${r},${c}`));
  const vegPositions = available.filter(([r, c]) => !hfPosKey.has(`${r},${c}`));

  // ── Initialise grid ──
  const grid: AnyCell[][] = Array.from({ length: gridRows }, () =>
    new Array<AnyCell>(gridCols).fill(null)
  );

  // Place path cells
  for (let r = 0; r < gridRows; r++)
    for (let c = 0; c < gridCols; c++)
      if (pathMask[r][c])
        grid[r][c] = { isPath: true, pathStyle: data.walkwayStyle };

  // Place SubgridCells
  for (let i = 0; i < herbFlowerPositions.length; i++) {
    const [r, c] = herbFlowerPositions[i];
    const slots: [PlantCell | null, PlantCell | null, PlantCell | null, PlantCell | null] =
      [null, null, null, null];
    for (let s = 0; s < 4; s++) {
      const idx = i * 4 + s;
      if (idx < herbFlowerSubslots.length) slots[s] = herbFlowerSubslots[idx];
    }
    grid[r][c] = { isSubgrid: true, plants: slots };
  }

  // Place veg PlantCells
  for (let i = 0; i < vegPositions.length && i < vegCellList.length; i++) {
    const [r, c] = vegPositions[i];
    grid[r][c] = vegCellList[i];
  }

  return {
    grid,
    zones:          buildZones(vegs, herbs, flowers),
    companionNotes: buildCompanionNotes(vegs, herbs, flowers),
    zoneTips:       buildZoneTips(data.usdaZone, zoneInfo, vegs),
    careCalendar:   includeCareCalendar
                      ? buildCareCalendar(vegs, herbs, flowers, zoneInfo)
                      : {},
    designNotes:    buildDesignNotes(data, vegs, herbs, flowers),
    estimatedYield: buildEstimatedYield(vegs),
  };
}
