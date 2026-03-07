import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
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
      _count: { select: { gardens: true } },
    },
  });

  const planBadge: Record<string, string> = {
    seedling: "bg-gray-100 text-gray-600",
    grower:   "bg-green-100 text-green-700",
    harvest:  "bg-amber-100 text-amber-700",
  };

  const fmt = (d: Date | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{users.length} users total</p>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Plan</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-700">Gardens</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Last Login</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {u.name ?? <span className="text-gray-400 italic">—</span>}
                  {u.isAdmin && (
                    <span className="ml-2 text-[10px] bg-primary/10 text-primary rounded px-1 py-0.5 font-semibold">admin</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planBadge[u.plan] ?? planBadge.seedling}`}>
                    {u.plan}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{u._count.gardens}</td>
                <td className="px-4 py-3 text-gray-500">{fmt(u.lastLoginAt)}</td>
                <td className="px-4 py-3 text-gray-500">{fmt(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
