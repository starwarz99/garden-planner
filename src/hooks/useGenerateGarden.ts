"use client";

import { useState } from "react";
import type { GardenDesign, WizardData } from "@/types/garden";

interface GenerateResult {
  design: GardenDesign;
}

export function useGenerateGarden() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [design, setDesign] = useState<GardenDesign | null>(null);

  const generate = async (wizardData: WizardData): Promise<GardenDesign | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wizardData }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error ?? "Generation failed");
      }

      const result: GenerateResult = await response.json();
      setDesign(result.design);
      return result.design;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setDesign(null);
    setError(null);
  };

  return { generate, isGenerating, error, design, reset };
}
