"use client";

import type { WizardData, GardenGoal, ExperienceLevel, WaterPreference } from "@/types/garden";

interface StepProps {
  data: WizardData;
  updateData: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}

const goals: Array<{ id: GardenGoal; label: string; emoji: string }> = [
  { id: "maximize-yield", label: "Maximize Yield", emoji: "🏆" },
  { id: "low-maintenance", label: "Low Maintenance", emoji: "😌" },
  { id: "pollinator-friendly", label: "Pollinator-Friendly", emoji: "🐝" },
  { id: "cut-flowers", label: "Cut Flowers", emoji: "💐" },
  { id: "culinary-herbs", label: "Culinary Herbs", emoji: "🧑‍🍳" },
  { id: "year-round", label: "Year-Round Harvest", emoji: "📅" },
  { id: "organic", label: "Organic Growing", emoji: "🌱" },
  { id: "kids-garden", label: "Kid-Friendly", emoji: "👦" },
];

const experienceLevels: Array<{ id: ExperienceLevel; label: string; emoji: string; description: string }> = [
  { id: "beginner", label: "Beginner", emoji: "🌱", description: "New to gardening, simple plants" },
  { id: "intermediate", label: "Intermediate", emoji: "🌿", description: "Some experience, ready to try more" },
  { id: "expert", label: "Expert", emoji: "🌳", description: "Experienced, complex plants welcome" },
];

const waterOptions: Array<{ id: WaterPreference; label: string; emoji: string; description: string }> = [
  { id: "low", label: "Low Water", emoji: "💧", description: "Drought-tolerant plants, less irrigation" },
  { id: "moderate", label: "Moderate", emoji: "💧💧", description: "Regular watering, balanced approach" },
  { id: "high", label: "High Water", emoji: "💧💧💧", description: "Thirsty plants, frequent irrigation" },
];

export function Step9Goals({ data, updateData }: StepProps) {
  const toggleGoal = (goal: GardenGoal) => {
    if (data.goals.includes(goal)) {
      updateData("goals", data.goals.filter((g) => g !== goal));
    } else {
      updateData("goals", [...data.goals, goal]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-primary mb-2">Goals, experience & water</h2>
        <p className="text-gray-600">Tell Claude what matters most to you for a personalized design.</p>
      </div>

      {/* Goals */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">What are your garden goals? (pick all that apply)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {goals.map((goal) => {
            const isSelected = data.goals.includes(goal.id);
            return (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`
                  p-3 rounded-xl border-2 text-center transition-all duration-150
                  ${isSelected
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "border-sage/30 text-gray-700 hover:border-primary hover:bg-mint"
                  }
                `}
              >
                <div className="text-2xl mb-1">{goal.emoji}</div>
                <div className="text-xs font-medium">{goal.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Your gardening experience</h3>
        <div className="grid grid-cols-3 gap-3">
          {experienceLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => updateData("experience", level.id)}
              className={`
                p-4 rounded-xl border-2 text-center transition-all duration-150
                ${data.experience === level.id
                  ? "bg-earth/10 border-earth shadow-sm ring-2 ring-earth/20"
                  : "border-sage/30 hover:border-earth/50"
                }
              `}
            >
              <div className="text-3xl mb-1">{level.emoji}</div>
              <div className="font-semibold text-sm text-gray-800">{level.label}</div>
              <div className="text-xs text-gray-500 mt-1">{level.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Water Preference */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Water preference</h3>
        <div className="grid grid-cols-3 gap-3">
          {waterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => updateData("waterPref", opt.id)}
              className={`
                p-4 rounded-xl border-2 text-center transition-all duration-150
                ${data.waterPref === opt.id
                  ? "bg-blue-50 border-blue-400 shadow-sm"
                  : "border-sage/30 hover:border-blue-300"
                }
              `}
            >
              <div className="text-2xl mb-1">{opt.emoji}</div>
              <div className="font-semibold text-sm text-gray-800">{opt.label}</div>
              <div className="text-xs text-gray-500 mt-1">{opt.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
