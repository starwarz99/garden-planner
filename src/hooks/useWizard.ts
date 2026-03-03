"use client";

import { useState, useCallback } from "react";
import type { WizardData } from "@/types/garden";

const TOTAL_STEPS = 10;

const defaultWizardData: WizardData = {
  widthFt: 12,
  lengthFt: 20,
  usdaZone: "6b",
  soilType: "loamy",
  sunExposure: "full-sun",
  orientation: "south",
  style: "kitchen",
  walkwayStyle: "straight",
  walkwayWidth: 2,
  selectedVegetables: [],
  selectedHerbs: [],
  selectedFlowers: [],
  goals: [],
  experience: "beginner",
  waterPref: "moderate",
  name: "",
};

export function useWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(defaultWizardData);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const updateData = useCallback(<K extends keyof WizardData>(key: K, value: WizardData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const next = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      setDirection("forward");
      setCurrentStep((s) => s + 1);
      scrollTop();
    }
  }, [currentStep]);

  const back = useCallback(() => {
    if (currentStep > 1) {
      setDirection("back");
      setCurrentStep((s) => s - 1);
      scrollTop();
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    setDirection(step > currentStep ? "forward" : "back");
    setCurrentStep(step);
    scrollTop();
  }, [currentStep]);

  const reset = useCallback(() => {
    setCurrentStep(1);
    setData(defaultWizardData);
    setDirection("forward");
  }, []);

  const totalArea = data.widthFt * data.lengthFt;
  const gridCols = Math.floor(data.widthFt / 2);
  const gridRows = Math.floor(data.lengthFt / 2);

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    data,
    direction,
    updateData,
    next,
    back,
    goToStep,
    reset,
    totalArea,
    gridCols,
    gridRows,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === TOTAL_STEPS,
    progress: (currentStep / TOTAL_STEPS) * 100,
  };
}
