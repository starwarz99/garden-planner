import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-4">Admin</h1>
        <nav className="flex gap-2 border-b border-gray-200">
          <Link
            href="/admin/users"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors"
          >
            Users
          </Link>
          <Link
            href="/admin/icons"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors"
          >
            Icons
          </Link>
          <Link
            href="/admin/visitors"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors"
          >
            Visitors
          </Link>
          <Link
            href="/admin/sitemap"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors"
          >
            Site Map
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
