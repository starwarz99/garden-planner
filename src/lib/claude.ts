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

  const selectedPlantDetails = allSelected
    .map((id) => allPlants.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => `  - ${p!.emoji} ${p!.name} (${p!.category}, ${p!.spacingFt}ft spacing, zones ${p!.minZone}-${p!.maxZone}, water: ${p!.waterNeeds})`)
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
7. Leave ~20% cells empty (null) for pathways and air circulation.
8. Prioritize plants that fit the zone ${data.usdaZone} — exclude any that won't survive.

## Response Format
Respond with ONLY valid JSON (no markdown code blocks, no extra text):

{
  "grid": [
    [{"plantId":"tomato","plantName":"Tomato","emoji":"🍅","zoneColor":"#4ade80","note":"Anchor plant"}, null, ...],
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

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 8192,
    temperature: 0.7,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  let raw = textBlock.text.trim();

  // Strip markdown code fences if present
  if (raw.startsWith("```")) {
    raw = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  }

  const design: GardenDesign = JSON.parse(raw);

  // Validate grid dimensions
  const gridCols = Math.floor(data.widthFt / 2);
  const gridRows = Math.floor(data.lengthFt / 2);

  if (!Array.isArray(design.grid) || design.grid.length === 0) {
    throw new Error("Invalid grid in Claude response");
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
