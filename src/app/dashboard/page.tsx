import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";
import { getPlanConfig } from "@/lib/plans";

export const metadata = { title: "My Gardens — Planters Blueprint" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

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

  const planConfig = getPlanConfig(session.user.plan ?? "seedling");

  return (
    <DashboardClient
      initialGardens={gardens}
      userName={session.user.name ?? "Gardener"}
      maxGardens={planConfig.maxGardens}
      planName={planConfig.name}
    />
  );
}
