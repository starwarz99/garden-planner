import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WizardPageClient } from "./WizardPageClient";
import type { WizardData } from "@/types/garden";

export default async function WizardPage() {
  const session = await auth();

  let initialData: Partial<WizardData> | undefined;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        usdaZone: true,
        soilType: true,
        experience: true,
        waterPref: true,
        sunExposure: true,
        orientation: true,
        goals: true,
      },
    });

    if (user) {
      const partial: Partial<WizardData> = {};
      if (user.usdaZone)    partial.usdaZone    = user.usdaZone as WizardData["usdaZone"];
      if (user.soilType)    partial.soilType    = user.soilType as WizardData["soilType"];
      if (user.experience)  partial.experience  = user.experience as WizardData["experience"];
      if (user.waterPref)   partial.waterPref   = user.waterPref as WizardData["waterPref"];
      if (user.sunExposure) partial.sunExposure = user.sunExposure as WizardData["sunExposure"];
      if (user.orientation) partial.orientation = user.orientation as WizardData["orientation"];
      if (user.goals?.length) partial.goals     = user.goals as WizardData["goals"];
      if (Object.keys(partial).length > 0) initialData = partial;
    }
  }

  return <WizardPageClient initialData={initialData} />;
}
