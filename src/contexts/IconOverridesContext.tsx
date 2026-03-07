"use client";

import { createContext, useContext } from "react";

export const IconOverridesContext = createContext<Record<string, string>>({});

export function useIconOverrides() {
  return useContext(IconOverridesContext);
}

export function IconOverridesProvider({
  overrides,
  children,
}: {
  overrides: Record<string, string>;
  children: React.ReactNode;
}) {
  return (
    <IconOverridesContext.Provider value={overrides}>
      {children}
    </IconOverridesContext.Provider>
  );
}
