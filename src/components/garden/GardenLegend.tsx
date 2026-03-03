"use client";

import type { GardenDesign, PlantCell, PathCell } from "@/types/garden";

function isPlantCell(cell: PlantCell | PathCell | null): cell is PlantCell {
  return cell !== null && "plantId" in cell;
}

interface GardenLegendProps {
  design: GardenDesign;
}

export function GardenLegend({ design }: GardenLegendProps) {
  // Collect unique plants from grid
  const plantMap = new Map<string, { name: string; emoji: string; zoneColor: string; count: number }>();
  design.grid.forEach((row) =>
    row.forEach((cell) => {
      if (!isPlantCell(cell)) return;
      const existing = plantMap.get(cell.plantId);
      if (existing) {
        existing.count++;
      } else {
        plantMap.set(cell.plantId, {
          name: cell.plantName,
          emoji: cell.emoji,
          zoneColor: cell.zoneColor,
          count: 1,
        });
      }
    })
  );

  const plants = Array.from(plantMap.values()).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Zone legend */}
      <div>
        <h3 className="font-serif font-bold text-gray-800 mb-3">Garden Zones</h3>
        <div className="space-y-2">
          {design.zones.map((zone) => (
            <div key={zone.name} className="flex items-start gap-2.5">
              <div
                className="w-4 h-4 rounded-sm mt-0.5 flex-shrink-0 border border-white shadow-sm"
                style={{ backgroundColor: zone.color }}
              />
              <div>
                <div className="text-sm font-semibold text-gray-800">{zone.name}</div>
                <div className="text-xs text-gray-500">{zone.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plant list */}
      <div>
        <h3 className="font-serif font-bold text-gray-800 mb-3">Plants ({plants.length})</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {plants.map((plant) => (
            <div key={plant.name} className="flex items-center gap-1.5 text-sm">
              <span className="text-lg">{plant.emoji}</span>
              <div>
                <div className="text-xs font-medium text-gray-700">{plant.name}</div>
                <div className="text-[10px] text-gray-400">{plant.count} cell{plant.count !== 1 ? "s" : ""}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Companion notes */}
      {design.companionNotes.length > 0 && (
        <div>
          <h3 className="font-serif font-bold text-gray-800 mb-3">Companion Planting Notes</h3>
          <ul className="space-y-2">
            {design.companionNotes.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Zone tips */}
      {design.zoneTips.length > 0 && (
        <div>
          <h3 className="font-serif font-bold text-gray-800 mb-3">Zone Tips</h3>
          <ul className="space-y-2">
            {design.zoneTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">💡</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Design notes */}
      {design.designNotes && (
        <div>
          <h3 className="font-serif font-bold text-gray-800 mb-2">Design Notes</h3>
          <p className="text-xs text-gray-600 leading-relaxed">{design.designNotes}</p>
        </div>
      )}

      {/* Estimated yield */}
      {design.estimatedYield && (
        <div className="card bg-harvest/10 border-harvest/30">
          <div className="font-semibold text-sm text-gray-800 mb-1">🏆 Estimated Yield</div>
          <p className="text-xs text-gray-600">{design.estimatedYield}</p>
        </div>
      )}
    </div>
  );
}
