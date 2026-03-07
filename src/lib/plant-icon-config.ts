export interface PlantOverride {
  emoji?: string;
  bgColor?: string;
}

// Subtle pastel defaults per plant category
export const DEFAULT_PLANT_BG: Record<string, string> = {
  vegetable: "#dcfce7",
  herb:      "#d1fae5",
  flower:    "#fce7f3",
};

// Curated light-only palette for admin picker
export const BG_COLOR_OPTIONS = [
  // Greens
  "#dcfce7", "#bbf7d0", "#d1fae5", "#a7f3d0", "#ccfbf1", "#99f6e4",
  // Blues
  "#dbeafe", "#bfdbfe", "#e0f2fe", "#bae6fd", "#cffafe", "#a5f3fc",
  // Purples & pinks
  "#f3e8ff", "#e9d5ff", "#fce7f3", "#fbcfe8", "#fdf4ff", "#fae8ff",
  // Yellows & oranges
  "#fef9c3", "#fef3c7", "#ffedd5", "#fed7aa",
  // Reds
  "#fee2e2", "#fecaca",
  // Neutrals
  "#f8fafc", "#f1f5f9", "#fafaf9", "#f5f5f4",
];
