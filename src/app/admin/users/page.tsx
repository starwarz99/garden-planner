import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { UsersClient } from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      isAdmin: true,
      createdAt: true,
      lastLoginAt: true,
      stripeSubscriptionId: true,
      stripeCancelAtPeriodEnd: true,
      _count: { select: { gardens: true } },
    },
  });

  const serialized = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    plan: u.plan,
    isAdmin: u.isAdmin,
    createdAt: u.createdAt.toISOString(),
    lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
    gardenCount: u._count.gardens,
    stripeSubscriptionId: u.stripeSubscriptionId,
    stripeCancelAtPeriodEnd: u.stripeCancelAtPeriodEnd,
  }));

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{users.length} users total</p>
      <UsersClient users={serialized} currentUserId={session?.user?.id ?? ""} />
    </div>
  );
}
