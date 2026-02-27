"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GardenWizard } from "@/components/wizard/GardenWizard";
import { GeneratingOverlay } from "@/components/GeneratingOverlay";
import type { GardenDesign, WizardData } from "@/types/garden";

export default function WizardPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleComplete = async (design: GardenDesign, wizardData: WizardData) => {
    setIsGenerating(true);
    sessionStorage.setItem("gardenDesign", JSON.stringify(design));
    sessionStorage.setItem("wizardData", JSON.stringify(wizardData));
    router.push("/wizard/result");
  };

  return (
    <div className="min-h-screen bg-mint/20">
      <GeneratingOverlay isVisible={isGenerating} />
      <GardenWizard onComplete={handleComplete} />
    </div>
  );
}
