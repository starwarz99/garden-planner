import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { GardenLayout } from "./GardenLayout";
import { CareCalendar } from "@/components/garden/CareCalendar";
import Link from "next/link";
import type { GardenDesign } from "@/types/garden";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GardenPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const garden = await prisma.garden.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!garden) notFound();

  const design = garden.designJson as unknown as GardenDesign;

  return (
    <div className="min-h-screen bg-mint/20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Link href="/dashboard" className="hover:text-primary transition-colors">
                My Gardens
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">{garden.name}</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-primary">{garden.name}</h1>
            <p className="text-gray-600 mt-1">
              {garden.widthFt}×{garden.lengthFt} ft · Zone {garden.usdaZone} ·{" "}
              <span className="capitalize">{garden.style.replace("-", " ")} style</span>
            </p>
          </div>
          <Link
            href="/wizard"
            className="px-4 py-2 bg-harvest text-primary font-bold rounded-xl hover:bg-harvest/90 transition-colors"
          >
            🌻 New Garden
          </Link>
        </div>

        {/* Canvas + Legend */}
        <GardenLayout
          design={design}
          widthFt={garden.widthFt}
          lengthFt={garden.lengthFt}
          orientation={garden.orientation}
        />

        {/* Care Calendar */}
        <div className="mt-8 card">
          <CareCalendar design={design} />
        </div>
      </div>
    </div>
  );
}
