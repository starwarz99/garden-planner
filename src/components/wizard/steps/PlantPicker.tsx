"use client";

import { useState } from "react";
import type { Plant } from "@/types/garden";

interface PlantPickerProps {
  plants: Plant[];
  selected: string[];
  onChange: (ids: string[]) => void;
  label: string;
}

export function PlantPicker({ plants, selected, onChange, label }: PlantPickerProps) {
  const [search, setSearch] = useState("");

  const filtered = plants.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const selectAll = () => onChange(plants.map((p) => p.id));
  const clearAll = () => onChange([]);

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

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((id) => {
            const plant = plants.find((p) => p.id === id);
            if (!plant) return null;
            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/30 hover:bg-red-50 hover:text-red-500 hover:border-red-300 transition-colors"
              >
                {plant.emoji} {plant.name} ×
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
        {filtered.map((plant) => {
          const isSelected = selected.includes(plant.id);
          return (
            <button
              key={plant.id}
              onClick={() => toggle(plant.id)}
              title={plant.description}
              className={`
                flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-center
                transition-all duration-150
                ${isSelected
                  ? "bg-primary text-white border-primary shadow-md scale-105"
                  : "border-sage/30 hover:border-primary hover:bg-mint text-gray-700"
                }
              `}
            >
              <span className="text-2xl">{plant.emoji}</span>
              <span className="text-[10px] font-medium leading-tight">{plant.name}</span>
            </button>
          );
        })}
      </div>

      <div className="text-xs text-center text-gray-500">
        {selected.length} of {plants.length} {label.toLowerCase()} selected
      </div>
    </div>
  );
}
