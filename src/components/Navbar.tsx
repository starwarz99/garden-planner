import Link from "next/link";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPlanConfig } from "@/lib/plans";
import { NavDropdown } from "@/components/NavDropdown";

export async function Navbar() {
  const session = await auth();

  let gardensFull = false;
  let userPlan = "seedling";
  if (session?.user?.id) {
    const [gardenCount, dbUser] = await Promise.all([
      prisma.garden.count({ where: { userId: session.user.id } }),
      prisma.user.findUnique({ where: { id: session.user.id }, select: { plan: true } }),
    ]);
    userPlan = dbUser?.plan ?? "seedling";
    const planConfig = getPlanConfig(userPlan);
    gardensFull = gardenCount >= planConfig.maxGardens;
  }

  const signOutAction = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-sage/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-serif font-bold text-xl text-primary">
          <span className="text-2xl">🌱</span>
          <span>Planters Blueprint</span>
        </Link>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              {userPlan !== "harvest" && (
                <Link
                  href="/pricing"
                  className="px-4 py-1.5 bg-harvest text-primary text-sm font-bold rounded-lg hover:bg-harvest/90 transition-colors"
                >
                  ⬆ Upgrade
                </Link>
              )}
              <Link
                href="/dashboard"
                className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-primary border border-sage/30 rounded-lg hover:border-primary transition-colors"
              >
                🌿 My Gardens
              </Link>
              <NavDropdown
                userName={session.user.name}
                userImage={session.user.image}
                isAdmin={session.user.isAdmin}
                gardensFull={gardensFull}
                signOutAction={signOutAction}
              />
            </>
          ) : (
            <>
              <Link
                href="/pricing"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Subscription
              </Link>
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
