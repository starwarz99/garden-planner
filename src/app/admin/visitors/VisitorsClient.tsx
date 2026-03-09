"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { relativeTime, formatDuration, shortTime } from "./helpers";

export interface SessionSummary {
  sessionId: string;
  firstSeen: string;
  lastSeen: string;
  durationMs: number;
  pageCount: number;
  sourceIcon: string;
  sourceLabel: string;
  sourceSub?: string;
  locationFlag: string;
  locationLabel: string;
  deviceIcon: string;
  deviceLabel: string;
  ipAddress: string | null;
  userName: string | null;
  userEmail: string | null;
  userPlan: string | null;
  pages: { id: string; createdAt: string; path: string }[];
}

const planBadge: Record<string, string> = {
  seedling: "bg-gray-100 text-gray-600",
  grower:   "bg-green-100 text-green-700",
  harvest:  "bg-amber-100 text-amber-700",
};

export function VisitorsClient({ sessions }: { sessions: SessionSummary[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const refresh = () => startTransition(() => router.refresh());

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div>
      {/* Header with refresh button */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">
          Sessions
          <span className="ml-2 text-xs font-normal text-gray-400">
            (last 5 days · click a row to see pages visited)
          </span>
        </h2>
        <button
          onClick={refresh}
          disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
        >
          <span className={isPending ? "animate-spin inline-block" : ""}>↻</span>
          {isPending ? "Refreshing…" : "Refresh"}
        </button>
      </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
            <th className="w-6 px-3 py-2" />
            <th className="text-left px-3 py-2 font-medium">Last Active</th>
            <th className="text-left px-3 py-2 font-medium">Duration</th>
            <th className="text-left px-3 py-2 font-medium">Pages</th>
            <th className="text-left px-3 py-2 font-medium">Source</th>
            <th className="text-left px-3 py-2 font-medium">User</th>
            <th className="text-left px-3 py-2 font-medium">Location</th>
            <th className="text-left px-3 py-2 font-medium">Device</th>
            <th className="text-left px-3 py-2 font-medium">IP</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => {
            const isOpen = expanded.has(s.sessionId);
            return (
              <>
                {/* Session summary row */}
                <tr
                  key={s.sessionId}
                  onClick={() => toggle(s.sessionId)}
                  className="border-b border-gray-100 hover:bg-sage/5 cursor-pointer select-none"
                >
                  {/* Chevron */}
                  <td className="px-3 py-2.5 text-gray-400 text-xs">
                    {isOpen ? "▼" : "▶"}
                  </td>

                  {/* Last active */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="text-gray-800">{relativeTime(s.lastSeen)}</div>
                    <div className="text-[10px] text-gray-400">
                      {new Date(s.firstSeen).toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
                      {shortTime(s.firstSeen)}
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="px-3 py-2.5 whitespace-nowrap text-gray-600">
                    {s.pageCount > 1 ? formatDuration(s.durationMs) : "—"}
                  </td>

                  {/* Page count */}
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                      {s.pageCount} {s.pageCount === 1 ? "page" : "pages"}
                    </span>
                  </td>

                  {/* Source */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-gray-700">
                      <span>{s.sourceIcon}</span>
                      <span>{s.sourceLabel}</span>
                    </div>
                    {s.sourceSub && (
                      <div className="text-[10px] text-gray-400 truncate max-w-[130px]">{s.sourceSub}</div>
                    )}
                  </td>

                  {/* User */}
                  <td className="px-3 py-2.5">
                    {s.userEmail ? (
                      <div>
                        <div className="text-gray-800 truncate max-w-[150px]" title={s.userEmail}>
                          {s.userName ?? s.userEmail}
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${planBadge[s.userPlan ?? "seedling"] ?? planBadge.seedling}`}>
                          {s.userPlan ?? "seedling"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">Anonymous</span>
                    )}
                  </td>

                  {/* Location */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    {s.locationLabel ? (
                      <span className="flex items-center gap-1 text-gray-700">
                        <span>{s.locationFlag}</span>
                        <span>{s.locationLabel}</span>
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* Device */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="flex items-center gap-1 text-gray-700">
                      <span>{s.deviceIcon}</span>
                      <span className="text-xs">{s.deviceLabel}</span>
                    </span>
                  </td>

                  {/* IP */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="font-mono text-xs text-gray-500">{s.ipAddress ?? "—"}</span>
                  </td>
                </tr>

                {/* Expanded page list */}
                {isOpen && (
                  <tr key={`${s.sessionId}-detail`} className="bg-sage/5 border-b border-gray-100">
                    <td />
                    <td colSpan={8} className="px-3 py-3">
                      <div className="rounded-lg border border-sage/30 overflow-hidden">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-sage/10 text-gray-500 uppercase">
                              <th className="text-left px-3 py-1.5 font-medium">#</th>
                              <th className="text-left px-3 py-1.5 font-medium">Time</th>
                              <th className="text-left px-3 py-1.5 font-medium">Page</th>
                            </tr>
                          </thead>
                          <tbody>
                            {s.pages.map((p, i) => (
                              <tr key={p.id} className="border-t border-sage/20 bg-white">
                                <td className="px-3 py-1.5 text-gray-400">{i + 1}</td>
                                <td className="px-3 py-1.5 text-gray-500 whitespace-nowrap">
                                  {shortTime(p.createdAt)}
                                  {i > 0 && (
                                    <span className="ml-1.5 text-gray-300">
                                      +{formatDuration(new Date(p.createdAt).getTime() - new Date(s.pages[i - 1].createdAt).getTime())}
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-1.5 font-mono text-gray-700">{p.path}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
          {sessions.length === 0 && (
            <tr>
              <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                No sessions recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div> {/* overflow-x-auto */}
    </div>
  );
}
