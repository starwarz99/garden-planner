import Anthropic from "@anthropic-ai/sdk";
import type { WizardData, GardenDesign } from "@/types/garden";
import { getZoneById } from "@/data/usda-zones";
import { allPlants } from "@/data/plants";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY?.trim(),
});

function buildPrompt(data: WizardData): string {
  const zone = getZoneById(data.usdaZone);
  const gridCols = Math.floor(data.widthFt / 2);
  const gridRows = Math.floor(data.lengthFt / 2);

  const allSelected = [
    ...data.selectedVegetables,
    ...data.selectedHerbs,
    ...data.selectedFlowers,
  ];

  const allQuantities: Record<string, string> = {
    ...data.vegetableQuantities,
    ...data.herbQuantities,
    ...data.flowerQuantities,
  };

  const quantityHint: Record<string, string> = {
    less:   "LESS — minimal, 1–2 cells only",
    medium: "MEDIUM — standard amount",
    more:   "MORE — prioritize, use as many cells as spacing allows",
  };

  const selectedPlantDetails = allSelected
    .map((id) => allPlants.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => {
      const qty = allQuantities[p!.id] ?? "medium";
      return `  - ${p!.emoji} ${p!.name} (${p!.category}, ${p!.spacingFt}ft spacing, zones ${p!.minZone}-${p!.maxZone}, water: ${p!.waterNeeds}) [${quantityHint[qty]}]`;
    })
    .join("\n");

  return `You are an expert garden designer with deep knowledge of companion planting, USDA hardiness zones, and sustainable growing practices. Design an intelligent, optimized garden layout.

## Garden Specifications
- **Dimensions**: ${data.widthFt} × ${data.lengthFt} ft (${data.widthFt * data.lengthFt} sq ft)
- **Grid**: ${gridCols} columns × ${gridRows} rows (each cell = 2ft × 2ft)
- **USDA Zone**: ${data.usdaZone}${zone ? ` — ${zone.description}. Min temp: ${zone.minTemp}°F, First frost: ${zone.firstFrost}, Last frost: ${zone.lastFrost}` : ""}
- **Soil type**: ${data.soilType}
- **Sun exposure**: ${data.sunExposure}
- **Garden orientation**: ${data.orientation}-facing
- **Garden style**: ${data.style}
- **Walkways**: ${data.walkwayStyle === "none" ? "no dedicated walkways" : `${data.walkwayStyle} paths, ${data.walkwayWidth}ft wide (= ${data.walkwayWidth / 2} cell${data.walkwayWidth === 4 ? "s" : ""} wide)`}
- **Experience level**: ${data.experience}
- **Water preference**: ${data.waterPref}
- **Goals**: ${data.goals.length > 0 ? data.goals.join(", ") : "general garden"}

## Requested Plants (${allSelected.length} total)
${selectedPlantDetails || "No specific plants requested — choose the best plants for this zone, style, and conditions."}

## Design Instructions
1. Create a ${gridCols}×${gridRows} grid array (rows first, then columns). Each cell is either null (empty) or a PlantCell object.
2. Apply companion planting principles — place good companions adjacent, avoid bad companions.
3. Group plants into named zones (e.g., "Salad Corner", "Tomato Row", "Pollinator Border").
4. Place taller plants to the north (if ${data.orientation}-facing) so they don't shade shorter ones.
5. Respect spacing: plants needing >2ft should span multiple cells or be placed with buffer cells.
6. For a ${data.style} style: ${
    data.style === "cottage" ? "informal clusters, mix flowers throughout, romantic groupings" :
    data.style === "formal" ? "symmetrical layout, mirror left/right, geometric zones" :
    data.style === "kitchen" ? "efficient rows, herbs at edges, veggies in center, easy access paths" :
    "natural drifts, natives prioritized, irregular clusters, wildlife corridors"
  }
7. ${data.walkwayStyle === "none"
    ? "Leave ~20% cells as null for air circulation. No dedicated path cells needed."
    : `Place walkways as PathCell objects: {"isPath":true,"pathStyle":"${data.walkwayStyle}"}. Rules:
   - Path width: ${data.walkwayWidth / 2} cell(s) wide (${data.walkwayWidth}ft).
   - ${data.walkwayStyle === "straight"
       ? `Run straight paths horizontally and/or vertically to divide the garden into accessible beds. Every planting area should be reachable from a path. ${data.style === "formal" ? "Use a symmetrical cross pattern (one central horizontal + one vertical path)." : "Use an efficient L or T layout."}`
       : data.walkwayStyle === "curved"
       ? "Create a gently winding path that meanders through the garden. Approximate curves by staggering path cells diagonally — shift 1 cell left or right every 2–3 rows."
       : "Scatter individual stepping-stone cells (single PathCells) in a natural stepping pattern, spaced 1–2 cells apart, forming a clear walking route through the garden."
     }
   - No plant should be more than 4 cells from a path cell.`
  }
8. Prioritize plants that fit the zone ${data.usdaZone} — exclude any that won't survive.
9. Respect quantity preferences: LESS plants get 1–2 cells total; MEDIUM plants get a proportional share; MORE plants should fill as many cells as their spacing allows — they are the garden's dominant plants.

## Response Format
Respond with ONLY valid JSON (no markdown code blocks, no extra text):

{
  "grid": [
    [{"plantId":"tomato","plantName":"Tomato","emoji":"🍅","zoneColor":"#4ade80","note":"Anchor plant"}, {"isPath":true,"pathStyle":"straight"}, null, ...],
    ...
  ],
  "zones": [
    {"name":"Tomato Zone","color":"#4ade80","description":"Sun-loving fruiting vegetables"},
    ...
  ],
  "companionNotes": [
    "Basil planted next to tomatoes repels aphids and enhances flavor",
    ...
  ],
  "zoneTips": [
    "Zone ${data.usdaZone}: Start tomatoes indoors 6 weeks before last frost (${zone?.lastFrost ?? "check local dates"})",
    ...
  ],
  "careCalendar": {
    "January": ["Plan seed orders", "Clean tools"],
    "February": ["Start peppers and eggplant indoors"],
    "March": [...],
    "April": [...],
    "May": [...],
    "June": [...],
    "July": [...],
    "August": [...],
    "September": [...],
    "October": [...],
    "November": [...],
    "December": [...]
  },
  "designNotes": "Brief paragraph explaining the overall design philosophy and key companion planting decisions",
  "estimatedYield": "Estimated harvest summary, e.g. '40+ lbs tomatoes, 20 lbs zucchini...'"
}

The grid must be exactly ${gridRows} rows with exactly ${gridCols} cells per row. Use zone colors consistently — pick 3–6 distinct hex colors for different growing zones.`;
}

export async function generateGardenDesign(data: WizardData): Promise<GardenDesign> {
  const prompt = buildPrompt(data);
  const gridCols = Math.floor(data.widthFt / 2);
  const gridRows = Math.floor(data.lengthFt / 2);

  // Scale token budget to grid size — smaller grids need far fewer tokens
  const cellCount = gridCols * gridRows;
  const maxTokens = cellCount <= 32 ? 3000 : cellCount <= 64 ? 5000 : 8000;

  // Retry up to 3 times on 529 overloaded or timeout errors.
  // Delays: 2s then 4s — fits within Vercel's 60s function limit (3 × 25s + 6s headroom).
  let message;
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      message = await anthropic.messages.create(
        {
          model: "claude-haiku-4-5-20251001",
          max_tokens: maxTokens,
          temperature: 0.2,
          messages: [{ role: "user", content: prompt }],
        },
        { timeout: 25000 },
      );
      break;
    } catch (err: unknown) {
      const status = (err as { status?: number }).status;
      const msg = (err as { message?: string }).message ?? "";
      const isOverloaded = status === 529;
      const isTimeout = msg.includes("timeout") || msg.includes("timed out");
      if ((isOverloaded || isTimeout) && attempt < maxAttempts) {
        await new Promise((res) => setTimeout(res, attempt * 2000));
        continue;
      }
      // All retries exhausted or non-retryable error — throw a clean user-facing message
      if (isOverloaded) {
        throw new Error("The AI service is overloaded right now — please wait a moment and try again.");
      }
      if (isTimeout) {
        throw new Error("The AI is taking too long to respond — please try again.");
      }
      throw new Error("Garden generation failed — please try again.");
    }
  }
  if (!message) throw new Error("The AI service is overloaded right now — please wait a moment and try again.");

  if (message.stop_reason === "max_tokens") {
    throw new Error("Garden is too large to generate — try a smaller size or fewer plants.");
  }

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI — please try again.");
  }

  let raw = textBlock.text.trim();

  // Strip markdown code fences if present
  if (raw.startsWith("```")) {
    raw = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  }

  if (!raw.startsWith("{")) {
    throw new Error("Garden generation failed — please try again with fewer plants.");
  }

  let design: GardenDesign;
  try {
    design = JSON.parse(raw);
  } catch {
    throw new Error("Garden generation failed — please try again with fewer plants.");
  }

  if (!Array.isArray(design.grid) || design.grid.length === 0) {
    throw new Error("Invalid garden layout received — please try again.");
  }

  // Pad/trim grid to match expected dimensions
  while (design.grid.length < gridRows) {
    design.grid.push(new Array(gridCols).fill(null));
  }
  design.grid = design.grid.slice(0, gridRows).map((row) => {
    if (!Array.isArray(row)) return new Array(gridCols).fill(null);
    while (row.length < gridCols) row.push(null);
    return row.slice(0, gridCols);
  });

  return design;
}
