import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getPlanConfig } from "@/lib/plans";

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 50);
  return `${base}-${Date.now().toString(36)}`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gardens = await prisma.garden.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      widthFt: true,
      lengthFt: true,
      usdaZone: true,
      style: true,
      svgSnapshot: true,
      isPublic: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ gardens });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, wizardData, designJson, svgSnapshot } = body;

    if (!name || !wizardData || !designJson) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Enforce per-plan garden limit
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });
    const planConfig = getPlanConfig(dbUser?.plan ?? "seedling");
    const gardenCount = await prisma.garden.count({ where: { userId: session.user.id } });
    if (gardenCount >= planConfig.maxGardens) {
      return NextResponse.json(
        { error: `Your ${planConfig.name} plan allows up to ${planConfig.maxGardens} saved garden${planConfig.maxGardens === 1 ? "" : "s"}. Upgrade to save more.` },
        { status: 403 }
      );
    }

    const slug = generateSlug(name);

    const allPlants = [
      ...(wizardData.selectedVegetables ?? []),
      ...(wizardData.selectedHerbs ?? []),
      ...(wizardData.selectedFlowers ?? []),
    ];

    const garden = await prisma.garden.create({
      data: {
        userId: session.user.id,
        name,
        slug,
        widthFt: wizardData.widthFt,
        lengthFt: wizardData.lengthFt,
        usdaZone: wizardData.usdaZone,
        soilType: wizardData.soilType,
        sunExposure: wizardData.sunExposure,
        orientation: wizardData.orientation,
        style: wizardData.style,
        experience: wizardData.experience,
        goals: wizardData.goals ?? [],
        waterPref: wizardData.waterPref,
        wantedPlants: allPlants,
        designJson,
        svgSnapshot: svgSnapshot ?? null,
      },
    });

    // Create GardenPlant entries for the grid
    const gridPlants: Array<{
      gardenId: string;
      plantId: string;
      plantName: string;
      emoji: string;
      gridX: number;
      gridY: number;
      zoneColor: string | null;
    }> = [];

    if (Array.isArray(designJson.grid)) {
      designJson.grid.forEach((row: unknown[], rowIdx: number) => {
        row.forEach((cell: unknown, colIdx: number) => {
          if (cell && typeof cell === "object" && "plantId" in cell) {
            const c = cell as { plantId: string; plantName: string; emoji: string; zoneColor?: string };
            gridPlants.push({
              gardenId: garden.id,
              plantId: c.plantId,
              plantName: c.plantName,
              emoji: c.emoji,
              gridX: colIdx,
              gridY: rowIdx,
              zoneColor: c.zoneColor ?? null,
            });
          }
        });
      });
    }

    if (gridPlants.length > 0) {
      await prisma.gardenPlant.createMany({ data: gridPlants });
    }

    return NextResponse.json({ success: true, garden }, { status: 201 });
  } catch (error) {
    console.error("Save garden error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save garden" },
      { status: 500 }
    );
  }
}
