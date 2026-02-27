"use client";

import type { WizardData, SoilType } from "@/types/garden";

interface StepProps {
  data: WizardData;
  updateData: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}

const soilOptions: Array<{
  id: SoilType;
  label: string;
  emoji: string;
  description: string;
  pros: string[];
  color: string;
}> = [
  {
    id: "loamy",
    label: "Loamy",
    emoji: "🌍",
    description: "The ideal garden soil — a mix of sand, silt, and clay.",
    pros: ["Excellent drainage", "Retains moisture well", "Easy to work", "Nutrient-rich"],
    color: "bg-amber-50 border-amber-300",
  },
  {
    id: "sandy",
    label: "Sandy",
    emoji: "🏖️",
    description: "Loose, gritty soil that drains quickly. Warms up fast in spring.",
    pros: ["Great drainage", "Warms quickly", "Easy digging", "Root vegetables love it"],
    color: "bg-yellow-50 border-yellow-300",
  },
  {
    id: "clay",
    label: "Clay",
    emoji: "🏺",
    description: "Dense, heavy soil that holds water and nutrients well.",
    pros: ["Holds moisture", "Nutrient-rich", "Supports large plants", "Slow to dry out"],
    color: "bg-orange-50 border-orange-300",
  },
  {
    id: "raised-bed",
    label: "Raised Bed",
    emoji: "🪴",
    description: "Controlled growing medium — usually a premium mix you choose.",
    pros: ["Perfect drainage", "No weeds", "Easy access", "Customizable depth"],
    color: "bg-green-50 border-green-300",
  },
];

export function Step3Soil({ data, updateData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-primary mb-2">What&apos;s your soil type?</h2>
        <p className="text-gray-600">Soil type affects drainage, nutrients, and which plants will thrive.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {soilOptions.map((soil) => (
          <button
            key={soil.id}
            onClick={() => updateData("soilType", soil.id)}
            className={`
              p-5 rounded-2xl border-2 text-left transition-all duration-200
              ${data.soilType === soil.id
                ? `${soil.color} border-primary shadow-md scale-[1.02] ring-2 ring-primary/20`
                : `${soil.color} opacity-70 hover:opacity-100 hover:shadow-sm`
              }
            `}
          >
            <div className="text-4xl mb-2">{soil.emoji}</div>
            <div className="font-bold text-gray-800 text-lg mb-1">{soil.label}</div>
            <div className="text-sm text-gray-600 mb-3">{soil.description}</div>
            <ul className="space-y-1">
              {soil.pros.map((pro) => (
                <li key={pro} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="text-green-500">✓</span>
                  {pro}
                </li>
              ))}
            </ul>
            {data.soilType === soil.id && (
              <div className="mt-3 flex items-center gap-1 text-primary font-semibold text-sm">
                <span>✓</span> Selected
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
