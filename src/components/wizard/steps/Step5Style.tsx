"use client";

import type { WizardData, GardenStyle } from "@/types/garden";

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
}> = [
  {
    id: "kitchen",
    label: "Kitchen Garden",
    emoji: "🍽️",
    description: "Practical and productive. Maximum edibles, neat rows, easy harvest.",
    traits: ["High yield", "Organized rows", "Mixed veggies & herbs", "Functional beauty"],
  },
  {
    id: "cottage",
    label: "Cottage Garden",
    emoji: "🏡",
    description: "Romantic and informal. Flowers mingle with edibles in lush abundance.",
    traits: ["Naturalistic style", "Dense planting", "Old-fashioned flowers", "Charming chaos"],
  },
  {
    id: "formal",
    label: "Formal Garden",
    emoji: "🏛️",
    description: "Symmetrical and structured. Clean lines, geometric beds, classic elegance.",
    traits: ["Symmetrical design", "Defined edges", "Clipped hedges", "Classic elegance"],
  },
  {
    id: "wildflower",
    label: "Wildflower Meadow",
    emoji: "🌾",
    description: "Naturalistic and wildlife-friendly. Native plants for pollinators and birds.",
    traits: ["Native plants", "Pollinator haven", "Low maintenance", "Eco-friendly"],
  },
];

export function Step5Style({ data, updateData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-primary mb-2">Choose your garden style</h2>
        <p className="text-gray-600">This shapes the layout aesthetic and plant selection Claude will use.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {styleOptions.map((style) => (
          <button
            key={style.id}
            onClick={() => updateData("style", style.id)}
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
  );
}
