"use client";

import { useState } from "react";
import type { Plant, PlantQuantity } from "@/types/garden";
import { getZoneNumber } from "@/data/usda-zones";

interface PlantPickerProps {
  plants: Plant[];
  selected: string[];
  onChange: (ids: string[]) => void;
  label: string;
  userZone?: string;
  quantities?: Record<string, PlantQuantity>;
  onQuantityChange?: (id: string, quantity: PlantQuantity) => void;
  canAdjustQuantity?: boolean;
}

const QUANTITY_STEPS: PlantQuantity[] = ["less", "medium", "more"];

const quantityLabel: Record<PlantQuantity, string> = {
  less:   "less",
  medium: "med",
  more:   "more",
};

export function PlantPicker({
  plants,
  selected,
  onChange,
  label,
  userZone,
  quantities = {},
  onQuantityChange,
  canAdjustQuantity = true,
}: PlantPickerProps) {
  const [search, setSearch] = useState("");

  const userZoneNum = userZone ? getZoneNumber(userZone) : null;

  const isCompatible = (plant: Plant) =>
    userZoneNum === null ||
    (userZoneNum >= plant.minZone && userZoneNum <= plant.maxZone);

  const filtered = plants.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const compatible   = filtered.filter(isCompatible);
  const incompatible = filtered.filter((p) => !isCompatible(p));
  const showDivider  = userZoneNum !== null && compatible.length > 0 && incompatible.length > 0;

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const stepQuantity = (e: React.MouseEvent, id: string, direction: 1 | -1) => {
    e.stopPropagation();
    const current = quantities[id] ?? "medium";
    const idx = QUANTITY_STEPS.indexOf(current);
    const next = QUANTITY_STEPS[Math.max(0, Math.min(2, idx + direction))];
    onQuantityChange?.(id, next);
  };

  const selectAll = () => onChange(plants.map((p) => p.id));
  const clearAll  = () => onChange([]);

  const renderPlant = (plant: Plant) => {
    const isSelected = selected.includes(plant.id);
    const qty = quantities[plant.id] ?? "medium";

    return (
      <button
        key={plant.id}
        onClick={() => toggle(plant.id)}
        title={plant.description}
        className={`
          flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-center
          transition-all duration-150
          ${isSelected
            ? "bg-primary text-white border-primary shadow-md"
            : "border-sage/30 hover:border-primary hover:bg-mint text-gray-700"
          }
        `}
      >
        <span className="text-2xl">{plant.emoji}</span>
        <span className="text-[10px] font-medium leading-tight">{plant.name}</span>

        {isSelected && canAdjustQuantity && (
          <div
            className="flex items-center gap-0.5 mt-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => stepQuantity(e, plant.id, -1)}
              disabled={qty === "less"}
              className="w-4 h-4 flex items-center justify-center rounded text-white/80 hover:text-white hover:bg-white/20 disabled:opacity-30 text-xs leading-none transition-colors"
            >
              −
            </button>
            <span className="text-[9px] font-semibold w-6 text-center text-white/90">
              {quantityLabel[qty]}
            </span>
            <button
              onClick={(e) => stepQuantity(e, plant.id, 1)}
              disabled={qty === "more"}
              className="w-4 h-4 flex items-center justify-center rounded text-white/80 hover:text-white hover:bg-white/20 disabled:opacity-30 text-xs leading-none transition-colors"
            >
              +
            </button>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 mr-3">
          <input
            type="text"
            placeholder={`Search ${label.toLowerCase()}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 pl-9 border-2 border-sage/30 rounded-xl text-sm focus:border-primary focus:outline-none transition-colors"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="text-xs px-3 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            All
          </button>
          <button
            onClick={clearAll}
            className="text-xs px-3 py-1.5 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto pr-1 space-y-3">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {compatible.map(renderPlant)}
        </div>

        {showDivider && (
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 border-t-2 border-dashed border-amber-300" />
            <span className="text-xs text-amber-600 font-medium whitespace-nowrap">
              Not ideal for Zone {userZone}
            </span>
            <div className="flex-1 border-t-2 border-dashed border-amber-300" />
          </div>
        )}

        {incompatible.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 opacity-60">
            {incompatible.map(renderPlant)}
          </div>
        )}
      </div>

      <div className="text-xs text-center text-gray-500">
        {selected.length} of {plants.length} {label.toLowerCase()} selected
        {selected.length > 0 && canAdjustQuantity && (
          <span className="ml-2 text-gray-400">· tap − / + on a card to adjust amount</span>
        )}
        {selected.length > 0 && !canAdjustQuantity && (
          <span className="ml-2 text-amber-500">· upgrade to 🌿 Grower to adjust amounts</span>
        )}
      </div>
    </div>
  );
}
