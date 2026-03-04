"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { useWizard } from "@/hooks/useWizard";
import { WizardProgress } from "./WizardProgress";
import { Step1Dimensions } from "./steps/Step1Dimensions";
import { Step2Zone } from "./steps/Step2Zone";
import { Step3Soil } from "./steps/Step3Soil";
import { Step4Sun } from "./steps/Step4Sun";
import { Step5Style } from "./steps/Step5Style";
import { Step6Vegetables } from "./steps/Step6Vegetables";
import { Step7Herbs } from "./steps/Step7Herbs";
import { Step8Flowers } from "./steps/Step8Flowers";
import { Step9Goals } from "./steps/Step9Goals";
import { Step10Review } from "./steps/Step10Review";
import type { GardenDesign, WizardData } from "@/types/garden";
import { getPlanConfig } from "@/lib/plans";

interface GardenWizardProps {
  onComplete: (design: GardenDesign, wizardData: WizardData) => Promise<void>;
  initialData?: Partial<WizardData>;
}

const slideVariants = {
  enter: (direction: string) => ({
    x: direction === "forward" ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: string) => ({
    x: direction === "forward" ? -60 : 60,
    opacity: 0,
  }),
};

export function GardenWizard({ onComplete, initialData }: GardenWizardProps) {
  const wizard = useWizard(initialData);
  const { currentStep, totalSteps, data, direction, next, back, goToStep, updateData } = wizard;
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const { data: session } = useSession();
  const planConfig = getPlanConfig(session?.user?.plan ?? "seedling");

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wizardData: data }),
      });

      if (!response.ok) {
        let errorMsg = "Generation failed — please try again.";
        try {
          const err = await response.json();
          if (err.error) errorMsg = err.error;
        } catch {}
        throw new Error(errorMsg);
      }

      const result = await response.json();
      await onComplete(result.design, data);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Generation failed");
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    const props = { data, updateData };
    switch (currentStep) {
      case 1: return <Step1Dimensions {...props} maxDimension={planConfig.maxDimension} planName={planConfig.name} isTopPlan={planConfig.name === "Harvest"} />;
      case 2: return <Step2Zone {...props} />;
      case 3: return <Step3Soil {...props} />;
      case 4: return <Step4Sun {...props} />;
      case 5: return <Step5Style {...props} />;
      case 6: return <Step6Vegetables {...props} canAdjustQuantity={planConfig.canAdjustQuantity} />;
      case 7: return <Step7Herbs {...props} canAdjustQuantity={planConfig.canAdjustQuantity} />;
      case 8: return <Step8Flowers {...props} canAdjustQuantity={planConfig.canAdjustQuantity} />;
      case 9: return <Step9Goals {...props} />;
      case 10: return (
        <Step10Review
          {...props}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          genError={genError}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <WizardProgress
        currentStep={currentStep}
        totalSteps={totalSteps}
        onStepClick={goToStep}
      />

      <div className="mt-8 relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {currentStep < totalSteps && (
        <div className="flex justify-between mt-8 gap-4">
          <button
            onClick={back}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-xl border-2 border-sage/30 text-gray-600 font-medium hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← Back
          </button>
          <button
            onClick={next}
            className="flex-1 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
          >
            Continue →
          </button>
        </div>
      )}

      {currentStep === totalSteps && !isGenerating && (
        <div className="mt-6">
          <button
            onClick={back}
            className="text-sm text-gray-500 hover:text-primary transition-colors"
          >
            ← Back to edit
          </button>
        </div>
      )}
    </div>
  );
}
