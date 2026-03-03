"use client";

import { flowers } from "@/data/plants/flowers";
import { PlantPicker } from "./PlantPicker";
import type { WizardData } from "@/types/garden";

interface StepProps {
  data: WizardData;
  updateData: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}

export function Step8Flowers({ data, updateData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-primary mb-2">Any companion flowers? 🌸</h2>
        <p className="text-gray-600">Flowers attract pollinators, deter pests, and add beauty to your garden design.</p>
      </div>
      <PlantPicker
        plants={flowers}
        selected={data.selectedFlowers}
        onChange={(ids) => updateData("selectedFlowers", ids)}
        label="Flowers"
        userZone={data.usdaZone}
        quantities={data.flowerQuantities}
        onQuantityChange={(id, qty) =>
          updateData("flowerQuantities", { ...data.flowerQuantities, [id]: qty })
        }
      />
    </div>
  );
}
