import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { registerSchema, gardenPrefsSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Parse optional prefs — validation failures are non-blocking
    const parsedPrefs = gardenPrefsSchema.safeParse(body.prefs ?? {});
    const prefFields: Record<string, unknown> = {};
    if (parsedPrefs.success) {
      const p = parsedPrefs.data;
      if (p.zipCode)     prefFields.zipCode = p.zipCode;
      if (p.usdaZone)    prefFields.usdaZone = p.usdaZone;
      if (p.soilType)    prefFields.soilType = p.soilType;
      if (p.experience)  prefFields.experience = p.experience;
      if (p.waterPref)   prefFields.waterPref = p.waterPref;
      if (p.sunExposure) prefFields.sunExposure = p.sunExposure;
      if (p.orientation) prefFields.orientation = p.orientation;
      if (p.goals?.length) prefFields.goals = p.goals;
    }

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, ...prefFields },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
