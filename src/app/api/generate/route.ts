import { auth } from "@/auth";
import { generateGardenDesign } from "@/lib/claude";
import { wizardDataSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export const maxDuration = 30;

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

    const design = await generateGardenDesign(parsed.data);

    return NextResponse.json({ success: true, design });
  } catch (error) {
    console.error("Garden generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
