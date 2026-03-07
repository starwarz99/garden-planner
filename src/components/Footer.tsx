import Link from "next/link";
import { auth } from "@/auth";

export async function Footer() {
  const session = await auth();

  return (
    <footer className="border-t border-sage/20 bg-white/60 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-primary font-serif font-bold">
            <span className="text-xl">🌱</span>
            <span>Planters Blueprint</span>
          </div>
          <p className="text-sm text-gray-500">
            AI-powered companion planting · Personalized for your zone
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Powered by AI</span>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">
              Privacy Policy
            </Link>
            {session?.user?.isAdmin && (
              <Link href="/admin" className="hover:text-gray-600 transition-colors">
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
