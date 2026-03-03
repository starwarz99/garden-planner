"use client";

import type { WizardData, PlantQuantity } from "@/types/garden";
import { getZoneById } from "@/data/usda-zones";
import { allPlants } from "@/data/plants";

interface StepProps {
  data: WizardData;
  updateData: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export function Step10Review({ data, updateData, onGenerate, isGenerating }: StepProps) {
  const zone = getZoneById(data.usdaZone);
  const allQuantities: Record<string, PlantQuantity> = {
    ...data.vegetableQuantities,
    ...data.herbQuantities,
    ...data.flowerQuantities,
  };

  const allSelectedPlants = [
    ...data.selectedVegetables,
    ...data.selectedHerbs,
    ...data.selectedFlowers,
  ].map((id) => allPlants.find((p) => p.id === id)).filter(Boolean);

  const area = data.widthFt * data.lengthFt;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-primary mb-2">Review & Generate 🌻</h2>
        <p className="text-gray-600">Give your garden a name, then let Claude create your personalized layout!</p>
      </div>

      {/* Garden Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Garden Name
        </label>
        <input
          type="text"
          placeholder="e.g. 'Backyard Kitchen Garden' or 'Mom's Herb Corner'…"
          value={data.name}
          onChange={(e) => updateData("name", e.target.value)}
          className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl text-base focus:border-primary focus:outline-none transition-colors"
          maxLength={100}
        />
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-2 gap-3">
        <SummaryCard emoji="📐" label="Size" value={`${data.widthFt} × ${data.lengthFt} ft (${area} sq ft)`} />
        <SummaryCard emoji="🌡️" label="Zone" value={zone ? `${zone.label} — ${zone.description}` : data.usdaZone} />
        <SummaryCard emoji="🌍" label="Soil" value={data.soilType.replace("-", " ")} />
        <SummaryCard emoji="☀️" label="Sun" value={data.sunExposure.replace("-", " ")} />
        <SummaryCard emoji="🧭" label="Orientation" value={`${data.orientation}-facing`} />
        <SummaryCard emoji="🎨" label="Style" value={data.style.replace("-", " ")} />
        <SummaryCard emoji="🌱" label="Experience" value={data.experience} />
        <SummaryCard emoji="💧" label="Water" value={`${data.waterPref} water`} />
      </div>

      {/* Plants summary */}
      <div className="card">
        <div className="font-semibold text-gray-700 mb-2">
          Selected plants ({allSelectedPlants.length})
        </div>
        {allSelectedPlants.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No specific plants selected — Claude will choose the best ones for your zone and style.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {allSelectedPlants.map((plant) => {
              if (!plant) return null;
              const qty = allQuantities[plant.id] ?? "medium";
              return (
                <span key={plant.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-mint rounded-full text-xs text-gray-700">
                  {plant.emoji} {plant.name}
                  {qty === "more" && (
                    <span className="ml-0.5 px-1 py-px bg-green-100 text-green-700 rounded-full text-[9px] font-semibold">more</span>
                  )}
                  {qty === "less" && (
                    <span className="ml-0.5 px-1 py-px bg-blue-100 text-blue-600 rounded-full text-[9px] font-semibold">less</span>
                  )}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Goals */}
      {data.goals.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.goals.map((goal) => (
            <span key={goal} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {goal.replace("-", " ")}
            </span>
          ))}
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={!data.name.trim() || isGenerating}
        className="
          w-full py-4 px-6 rounded-2xl font-bold text-lg text-primary-foreground
          bg-harvest hover:bg-harvest/90 disabled:opacity-50 disabled:cursor-not-allowed
          shadow-lg hover:shadow-xl transition-all duration-200
          flex items-center justify-center gap-3
          relative overflow-hidden group
        "
      >
        {isGenerating ? (
          <>
            <span className="animate-spin text-2xl">🌀</span>
            <span>Claude is designing your garden…</span>
          </>
        ) : (
          <>
            <span className="text-2xl animate-pulse">🌻</span>
            <span>Generate My Garden!</span>
            <span className="text-2xl animate-pulse">🌻</span>
          </>
        )}
      </button>

      {!data.name.trim() && (
        <p className="text-xs text-center text-orange-500">Give your garden a name to generate!</p>
      )}
    </div>
  );
}

function SummaryCard({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="card flex items-start gap-2 py-3 px-3">
      <span className="text-lg mt-0.5">{emoji}</span>
      <div>
        <div className="text-xs text-gray-500 font-medium">{label}</div>
        <div className="text-sm font-semibold text-gray-800 capitalize">{value}</div>
      </div>
    </div>
  );
}
