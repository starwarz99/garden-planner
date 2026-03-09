"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  plan: string;
  isAdmin: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  gardenCount: number;
  stripeSubscriptionId: string | null;
  stripeCancelAtPeriodEnd: boolean;
}

const planBadge: Record<string, string> = {
  seedling: "bg-gray-100 text-gray-600",
  grower:   "bg-green-100 text-green-700",
  harvest:  "bg-amber-100 text-amber-700",
};

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function UserRow({ user, currentUserId }: { user: AdminUser; currentUserId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSelf = user.id === currentUserId;
  const hasSub = !!user.stripeSubscriptionId;
  const alreadyCancelling = user.stripeCancelAtPeriodEnd;

  const handleCancelSub = async () => {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Failed to cancel subscription");
        return;
      }
      router.refresh();
    });
  };

  const handleDelete = async () => {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Failed to delete user");
        setConfirmDelete(false);
        return;
      }
      router.refresh();
    });
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 font-medium text-gray-900">
        {user.name ?? <span className="text-gray-400 italic">—</span>}
        {user.isAdmin && (
          <span className="ml-2 text-[10px] bg-primary/10 text-primary rounded px-1 py-0.5 font-semibold">admin</span>
        )}
      </td>
      <td className="px-4 py-3 text-gray-600">{user.email}</td>
      <td className="px-4 py-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planBadge[user.plan] ?? planBadge.seedling}`}>
          {user.plan}
        </span>
        {alreadyCancelling && (
          <span className="ml-1.5 text-[10px] text-orange-500 font-medium">cancelling</span>
        )}
      </td>
      <td className="px-4 py-3 text-right text-gray-600">{user.gardenCount}</td>
      <td className="px-4 py-3 text-gray-500">{fmt(user.lastLoginAt)}</td>
      <td className="px-4 py-3 text-gray-500">{fmt(user.createdAt)}</td>
      <td className="px-4 py-3">
        {error && <p className="text-xs text-red-500 mb-1">{error}</p>}
        <div className="flex items-center gap-2">
          {/* Cancel subscription */}
          {hasSub && !alreadyCancelling && (
            <button
              onClick={handleCancelSub}
              disabled={isPending}
              className="text-xs px-2.5 py-1 rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {isPending ? "…" : "Cancel sub"}
            </button>
          )}

          {/* Delete user */}
          {!isSelf && (
            confirmDelete ? (
              <span className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Sure?</span>
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="text-xs px-2 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {isPending ? "…" : "Yes"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={isPending}
                  className="text-xs px-2 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  No
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={isPending}
                className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
              >
                Delete
              </button>
            )
          )}
        </div>
      </td>
    </tr>
  );
}

export function UsersClient({ users, currentUserId }: { users: AdminUser[]; currentUserId: string }) {
  return (
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
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((u) => (
            <UserRow key={u.id} user={u} currentUserId={currentUserId} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
