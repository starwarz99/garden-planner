"use client";

import { herbs } from "@/data/plants/herbs";
import { PlantPicker } from "./PlantPicker";
import type { WizardData } from "@/types/garden";

interface StepProps {
  data: WizardData;
  updateData: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
  canAdjustQuantity?: boolean;
}

export function Step7Herbs({ data, updateData, canAdjustQuantity = true }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-primary mb-2">What herbs do you want? 🌿</h2>
        <p className="text-gray-600">Herbs add flavor, fragrance, and companion benefits to your garden.</p>
      </div>
      <PlantPicker
        plants={herbs}
        selected={data.selectedHerbs}
        onChange={(ids) => updateData("selectedHerbs", ids)}
        label="Herbs"
        userZone={data.usdaZone}
        quantities={data.herbQuantities}
        onQuantityChange={(id, qty) =>
          updateData("herbQuantities", { ...data.herbQuantities, [id]: qty })
        }
        canAdjustQuantity={canAdjustQuantity}
      />
    </div>
  );
}
