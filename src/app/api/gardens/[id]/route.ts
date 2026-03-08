import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function getOwnedGarden(id: string, userId: string) {
  return prisma.garden.findFirst({
    where: { id, userId },
    include: { plants: true },
  });
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const garden = await getOwnedGarden(id, session.user.id);
  if (!garden) {
    return NextResponse.json({ error: "Garden not found" }, { status: 404 });
  }

  return NextResponse.json({ garden });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const garden = await getOwnedGarden(id, session.user.id);
  if (!garden) {
    return NextResponse.json({ error: "Garden not found" }, { status: 404 });
  }

  const body = await req.json();
  const { name, svgSnapshot, isPublic, designJson } = body;

  const updated = await prisma.garden.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(svgSnapshot !== undefined && { svgSnapshot }),
      ...(isPublic !== undefined && { isPublic }),
      ...(designJson !== undefined && { designJson }),
    },
  });

  return NextResponse.json({ garden: updated });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const garden = await getOwnedGarden(id, session.user.id);
  if (!garden) {
    return NextResponse.json({ error: "Garden not found" }, { status: 404 });
  }

  await prisma.garden.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
