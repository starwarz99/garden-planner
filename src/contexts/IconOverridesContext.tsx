"use client";

import { createContext, useContext } from "react";
import type { PlantOverride } from "@/lib/plant-icon-config";

export const IconOverridesContext = createContext<Record<string, PlantOverride>>({});

export function useIconOverrides() {
  return useContext(IconOverridesContext);
}

export function IconOverridesProvider({
  overrides,
  children,
}: {
  overrides: Record<string, PlantOverride>;
  children: React.ReactNode;
}) {
  return (
    <IconOverridesContext.Provider value={overrides}>
      {children}
    </IconOverridesContext.Provider>
  );
}
