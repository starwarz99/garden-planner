import { auth } from "@/auth";
import { generateGardenDesign } from "@/lib/claude";
import { getPlanConfig } from "@/lib/plans";
import { wizardDataSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = wizardDataSchema.safeParse(body.wizardData);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid wizard data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const planConfig = getPlanConfig(session.user.plan ?? "seedling");
    const design = await generateGardenDesign(parsed.data, planConfig.canSeeCareCalendar);

    return NextResponse.json({ success: true, design });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    const name = error instanceof Error ? error.constructor.name : "UnknownError";
    console.error("Garden generation error:", name, message, error);
    return NextResponse.json({ error: message, type: name }, { status: 500 });
  }
}
