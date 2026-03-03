import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { accountUpdateSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      zipCode: true,
      usdaZone: true,
      soilType: true,
      experience: true,
      waterPref: true,
      sunExposure: true,
      orientation: true,
      goals: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = accountUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, prefs } = parsed.data;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (prefs) {
      if (prefs.zipCode !== undefined)     updateData.zipCode = prefs.zipCode;
      if (prefs.usdaZone !== undefined)    updateData.usdaZone = prefs.usdaZone;
      if (prefs.soilType !== undefined)    updateData.soilType = prefs.soilType;
      if (prefs.experience !== undefined)  updateData.experience = prefs.experience;
      if (prefs.waterPref !== undefined)   updateData.waterPref = prefs.waterPref;
      if (prefs.sunExposure !== undefined) updateData.sunExposure = prefs.sunExposure;
      if (prefs.orientation !== undefined) updateData.orientation = prefs.orientation;
      if (prefs.goals !== undefined)       updateData.goals = prefs.goals;
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        zipCode: true,
        usdaZone: true,
        soilType: true,
        experience: true,
        waterPref: true,
        sunExposure: true,
        orientation: true,
        goals: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Account update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
