"use client";

import type { WizardData, GardenStyle, WalkwayStyle } from "@/types/garden";

interface StepProps {
  data: WizardData;
  updateData: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}

const styleOptions: Array<{
  id: GardenStyle;
  label: string;
  emoji: string;
  description: string;
  traits: string[];
  defaultWalkway: WalkwayStyle;
}> = [
  {
    id: "kitchen",
    label: "Kitchen Garden",
    emoji: "🍽️",
    description: "Practical and productive. Maximum edibles, neat rows, easy harvest.",
    traits: ["High yield", "Organized rows", "Mixed veggies & herbs", "Functional beauty"],
    defaultWalkway: "straight",
  },
  {
    id: "cottage",
    label: "Cottage Garden",
    emoji: "🏡",
    description: "Romantic and informal. Flowers mingle with edibles in lush abundance.",
    traits: ["Naturalistic style", "Dense planting", "Old-fashioned flowers", "Charming chaos"],
    defaultWalkway: "curved",
  },
  {
    id: "formal",
    label: "Formal Garden",
    emoji: "🏛️",
    description: "Symmetrical and structured. Clean lines, geometric beds, classic elegance.",
    traits: ["Symmetrical design", "Defined edges", "Clipped hedges", "Classic elegance"],
    defaultWalkway: "straight",
  },
  {
    id: "wildflower",
    label: "Wildflower Meadow",
    emoji: "🌾",
    description: "Naturalistic and wildlife-friendly. Native plants for pollinators and birds.",
    traits: ["Native plants", "Pollinator haven", "Low maintenance", "Eco-friendly"],
    defaultWalkway: "stepping-stones",
  },
];

const walkwayOptions: Array<{
  id: WalkwayStyle;
  label: string;
  emoji: string;
  description: string;
  bestFor: string[];
}> = [
  {
    id: "none",
    label: "No Paths",
    emoji: "🌱",
    description: "No dedicated walkways — every cell used for planting.",
    bestFor: ["Small raised beds", "Wildflower meadows"],
  },
  {
    id: "straight",
    label: "Straight Paths",
    emoji: "⬜",
    description: "Clean grid-aligned paths divide the garden into neat, accessible beds.",
    bestFor: ["Kitchen gardens", "Formal gardens"],
  },
  {
    id: "curved",
    label: "Curved Paths",
    emoji: "〰️",
    description: "Gently winding paths create a natural, relaxed flow through the garden.",
    bestFor: ["Cottage gardens", "Informal beds"],
  },
  {
    id: "stepping-stones",
    label: "Stepping Stones",
    emoji: "🪨",
    description: "Individual stones scattered through the garden for a rustic, natural look.",
    bestFor: ["Wildflower meadows", "Cottage gardens"],
  },
];

export function Step5Style({ data, updateData }: StepProps) {
  const handleStyleChange = (styleId: GardenStyle) => {
    updateData("style", styleId);
    // auto-suggest walkway style when garden style changes
    const opt = styleOptions.find((s) => s.id === styleId);
    if (opt) updateData("walkwayStyle", opt.defaultWalkway);
  };

  return (
    <div className="space-y-8">
      {/* Garden style */}
      <div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-primary mb-2">Choose your garden style</h2>
          <p className="text-gray-600">This shapes the layout aesthetic and plant selection Claude will use.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {styleOptions.map((style) => (
            <button
              key={style.id}
              onClick={() => handleStyleChange(style.id)}
              className={`
                p-5 rounded-2xl border-2 text-left transition-all duration-200
                ${data.style === style.id
                  ? "bg-mint border-primary shadow-lg ring-2 ring-primary/20 scale-[1.02]"
                  : "border-sage/30 hover:border-primary/50 hover:bg-mint/30"
                }
              `}
            >
              <div className="text-4xl mb-2">{style.emoji}</div>
              <div className="font-bold text-gray-800 text-lg mb-1">{style.label}</div>
              <div className="text-sm text-gray-600 mb-3">{style.description}</div>
              <div className="flex flex-wrap gap-1.5">
                {style.traits.map((trait) => (
                  <span
                    key={trait}
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      data.style === style.id
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Walkway style */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-serif font-bold text-primary">Walkways</h3>
          <p className="text-sm text-gray-500 mt-0.5">How do you want to move through the garden?</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {walkwayOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => updateData("walkwayStyle", opt.id)}
              className={`
                p-4 rounded-xl border-2 text-left transition-all duration-200
                ${data.walkwayStyle === opt.id
                  ? "bg-amber-50 border-amber-500 shadow ring-2 ring-amber-200"
                  : "border-sage/30 hover:border-amber-400/60 hover:bg-amber-50/40"
                }
              `}
            >
              <div className="text-2xl mb-2">{opt.emoji}</div>
              <div className="font-semibold text-gray-800 text-sm mb-1">{opt.label}</div>
              <div className="text-xs text-gray-500 leading-snug">{opt.description}</div>
            </button>
          ))}
        </div>

        {/* Width selector — only shown when paths are selected */}
        {data.walkwayStyle !== "none" && (
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Path width:</span>
            {([2, 4] as const).map((w) => (
              <button
                key={w}
                onClick={() => updateData("walkwayWidth", w)}
                className={`px-4 py-1.5 rounded-lg border-2 text-sm font-medium transition-all ${
                  data.walkwayWidth === w
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "border-sage/30 text-gray-600 hover:border-amber-400"
                }`}
              >
                {w} ft
              </button>
            ))}
            <span className="text-xs text-gray-400">
              ({data.walkwayWidth === 2 ? "1 cell — cozy" : "2 cells — wheelbarrow-friendly"})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
