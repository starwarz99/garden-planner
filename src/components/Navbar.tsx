import Link from "next/link";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPlanConfig } from "@/lib/plans";
import { NavDropdown } from "@/components/NavDropdown";

export async function Navbar() {
  const session = await auth();

  let gardensFull = false;
  if (session?.user?.id) {
    const [gardenCount, dbUser] = await Promise.all([
      prisma.garden.count({ where: { userId: session.user.id } }),
      prisma.user.findUnique({ where: { id: session.user.id }, select: { plan: true } }),
    ]);
    const planConfig = getPlanConfig(dbUser?.plan ?? "seedling");
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
              {gardensFull ? (
                <div className="relative group">
                  <span className="px-4 py-2 bg-gray-300 text-gray-500 text-sm font-semibold rounded-lg cursor-not-allowed select-none">
                    + New Garden
                  </span>
                  <div className="absolute right-0 top-full mt-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    No more gardens available
                    <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-800 rotate-45" />
                  </div>
                </div>
              ) : (
                <Link
                  href="/wizard"
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  + New Garden
                </Link>
              )}
              <NavDropdown
                userName={session.user.name}
                userImage={session.user.image}
                isAdmin={session.user.isAdmin}
                signOutAction={signOutAction}
              />
            </>
          ) : (
            <>
              <Link
                href="/pricing"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Pricing
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
