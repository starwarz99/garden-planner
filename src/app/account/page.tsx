import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AccountClient } from "./AccountClient";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      plan: true,
      stripeCurrentPeriodEnd: true,
      stripeCancelAtPeriodEnd: true,
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
    redirect("/auth/signin");
  }

  return <AccountClient user={user} />;
}
