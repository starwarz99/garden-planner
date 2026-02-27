"use client";

import { vegetables } from "@/data/plants/vegetables";
import { PlantPicker } from "./PlantPicker";
import type { WizardData } from "@/types/garden";

interface StepProps {
  data: WizardData;
  updateData: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}

export function Step6Vegetables({ data, updateData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-primary mb-2">Which vegetables would you like? 🥦</h2>
        <p className="text-gray-600">Select any vegetables you want Claude to include. Pick as many as you like!</p>
      </div>
      <PlantPicker
        plants={vegetables}
        selected={data.selectedVegetables}
        onChange={(ids) => updateData("selectedVegetables", ids)}
        label="Vegetables"
      />
    </div>
  );
}
