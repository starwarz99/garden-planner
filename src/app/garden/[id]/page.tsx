import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { GardenLayout } from "./GardenLayout";
import { CareCalendar } from "@/components/garden/CareCalendar";
import Link from "next/link";
import type { GardenDesign } from "@/types/garden";
import { getPlanConfig } from "@/lib/plans";

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
  const planConfig = getPlanConfig(session.user.plan ?? "seedling");
  const gardenCount = await prisma.garden.count({ where: { userId: session.user.id } });
  const atLimit = gardenCount >= planConfig.maxGardens;

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
          {atLimit ? (
            <Link
              href="/account"
              className="px-4 py-2 bg-gray-100 text-gray-500 font-bold rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:text-primary transition-colors text-sm"
            >
              🔒 Upgrade to add more
            </Link>
          ) : (
            <Link
              href="/wizard"
              className="px-4 py-2 bg-harvest text-primary font-bold rounded-xl hover:bg-harvest/90 transition-colors"
            >
              🌻 New Garden
            </Link>
          )}
        </div>

        {/* Canvas + Legend */}
        <GardenLayout
          design={design}
          widthFt={garden.widthFt}
          lengthFt={garden.lengthFt}
          orientation={garden.orientation}
          showYield={planConfig.canSeeYield}
        />

        {/* Care Calendar — Harvest plan only */}
        {planConfig.canSeeCareCalendar ? (
          <div className="mt-8 card">
            <CareCalendar design={design} />
          </div>
        ) : (
          <div className="mt-8 card bg-gray-50 text-center py-8">
            <div className="text-2xl mb-2">📅</div>
            <div className="font-semibold text-gray-700">12-Month Care Calendar</div>
            <div className="text-sm text-gray-500 mt-1">
              Upgrade to <span className="text-primary font-semibold">Harvest</span> to unlock the full year-round care schedule.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
