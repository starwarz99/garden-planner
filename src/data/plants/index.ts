export { vegetables } from "./vegetables";
export { herbs } from "./herbs";
export { flowers } from "./flowers";

import { vegetables } from "./vegetables";
import { herbs } from "./herbs";
import { flowers } from "./flowers";
import type { Plant } from "@/types/garden";

export const allPlants: Plant[] = [...vegetables, ...herbs, ...flowers];

export function getPlantById(id: string): Plant | undefined {
  return allPlants.find((p) => p.id === id);
}
