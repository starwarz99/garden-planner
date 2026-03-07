import { allPlants } from "@/data/plants";
import { getPlantIconOverrides } from "@/lib/plant-icons";
import { IconsClient } from "./IconsClient";

export default async function AdminIconsPage() {
  const overrides = await getPlantIconOverrides();
  return <IconsClient plants={allPlants} overrides={overrides} />;
}
