import { prisma } from "@/lib/prisma";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countryFlag(code: string | null): string {
  if (!code || code.length !== 2) return "🌐";
  try {
    return String.fromCodePoint(
      ...code.toUpperCase().split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
    );
  } catch {
    return "🌐";
  }
}

function parseDevice(ua: string | null): { icon: string; label: string } {
  if (!ua) return { icon: "❓", label: "Unknown" };
  if (/bot|crawler|spider|headless/i.test(ua)) return { icon: "🤖", label: "Bot" };
  const mobile = /mobile|android|iphone|ipad/i.test(ua);
  let browser = "Browser";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR|Opera/.test(ua)) browser = "Opera";
  else if (/Chrome/.test(ua)) browser = "Chrome";
  else if (/Firefox/.test(ua)) browser = "Firefox";
  else if (/Safari/.test(ua)) browser = "Safari";
  let os = "";
  if (/Windows/.test(ua)) os = "Win";
  else if (/Macintosh|Mac OS X/.test(ua)) os = "Mac";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad/.test(ua)) os = "iOS";
  else if (/Linux/.test(ua)) os = "Linux";
  return { icon: mobile ? "📱" : "🖥️", label: [browser, os].filter(Boolean).join(" · ") };
}

function parseSource(visit: {
  fbclid: string | null;
  gclid: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
}): { icon: string; label: string; sub?: string } {
  if (visit.fbclid) {
    return {
      icon: "📘",
      label: "Facebook Ad",
      sub: visit.utmCampaign ?? undefined,
    };
  }
  if (visit.gclid) {
    return {
      icon: "🔍",
      label: "Google Ad",
      sub: visit.utmCampaign ?? undefined,
    };
  }
  if (visit.utmSource) {
    const src = visit.utmSource;
    const icon =
      src.includes("facebook") || src.includes("fb") ? "📘" :
      src.includes("google") ? "🔍" :
      src.includes("instagram") ? "📷" :
      src.includes("twitter") || src.includes("x.com") ? "🐦" :
      src.includes("email") || src.includes("newsletter") ? "📧" :
      "📣";
    return { icon, label: src, sub: visit.utmCampaign ?? undefined };
  }
  if (visit.referrer) {
    try {
      const host = new URL(visit.referrer).hostname.replace(/^www\./, "");
      const icon =
        host.includes("google") ? "🔍" :
        host.includes("facebook") || host.includes("fb.com") ? "📘" :
        host.includes("instagram") ? "📷" :
        host.includes("twitter") || host.includes("x.com") ? "🐦" :
        host.includes("bing") ? "🔍" :
        "🔗";
      return { icon, label: host };
    } catch {
      return { icon: "🔗", label: visit.referrer.slice(0, 40) };
    }
  }
  return { icon: "➡️", label: "Direct" };
}

function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const metadata = { title: "Visitors — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminVisitorsPage() {
  const [visits, totalCount] = await Promise.all([
    prisma.siteVisit.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      include: {
        user: { select: { id: true, name: true, email: true, plan: true } },
      },
    }),
    prisma.siteVisit.count(),
  ]);

  // Summary stats
  const uniqueIPs = new Set(visits.map((v) => v.ipAddress).filter(Boolean)).size;
  const loggedInCount = visits.filter((v) => v.userId).length;
  const campaignCount = visits.filter((v) => v.fbclid || v.gclid || v.utmSource).length;

  const planBadge: Record<string, string> = {
    seedling: "bg-gray-100 text-gray-600",
    grower:   "bg-green-100 text-green-700",
    harvest:  "bg-amber-100 text-amber-700",
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total visits", value: totalCount, icon: "👣" },
          { label: "Unique IPs", value: uniqueIPs, icon: "🌐" },
          { label: "Logged-in", value: loggedInCount, icon: "👤" },
          { label: "Via campaign", value: campaignCount, icon: "📣" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="card text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">
            Recent visits
            <span className="ml-2 text-xs font-normal text-gray-400">(last 5 days · newest first)</span>
          </h2>
          <span className="text-xs text-gray-400">showing {visits.length} of {totalCount}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                <th className="text-left px-4 py-2 font-medium">Time</th>
                <th className="text-left px-4 py-2 font-medium">Page</th>
                <th className="text-left px-4 py-2 font-medium">Source</th>
                <th className="text-left px-4 py-2 font-medium">Location</th>
                <th className="text-left px-4 py-2 font-medium">User</th>
                <th className="text-left px-4 py-2 font-medium">Device</th>
                <th className="text-left px-4 py-2 font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v) => {
                const device = parseDevice(v.userAgent);
                const source = parseSource(v);
                return (
                  <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    {/* Time */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-gray-800">{relativeTime(v.createdAt)}</div>
                      <div className="text-[10px] text-gray-400">
                        {v.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
                        {v.createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>

                    {/* Page */}
                    <td className="px-4 py-2.5 max-w-[180px]">
                      <span className="block truncate text-gray-700 font-mono text-xs" title={v.path}>
                        {v.path}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-gray-700">
                        <span>{source.icon}</span>
                        <span>{source.label}</span>
                      </div>
                      {source.sub && (
                        <div className="text-[10px] text-gray-400 truncate max-w-[140px]" title={source.sub}>
                          {source.sub}
                        </div>
                      )}
                    </td>

                    {/* Location */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {v.country || v.city ? (
                        <div className="flex items-center gap-1 text-gray-700">
                          <span>{countryFlag(v.country)}</span>
                          <span>{v.city ? `${v.city}${v.country ? `, ${v.country}` : ""}` : v.country}</span>
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* User */}
                    <td className="px-4 py-2.5">
                      {v.user ? (
                        <div>
                          <div className="text-gray-800 truncate max-w-[160px]" title={v.user.email ?? ""}>
                            {v.user.name ?? v.user.email}
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${planBadge[v.user.plan] ?? planBadge.seedling}`}>
                            {v.user.plan}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">Anonymous</span>
                      )}
                    </td>

                    {/* Device */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-gray-700">
                        <span>{device.icon}</span>
                        <span className="text-xs">{device.label}</span>
                      </div>
                    </td>

                    {/* IP */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="font-mono text-xs text-gray-500">{v.ipAddress ?? "—"}</span>
                    </td>
                  </tr>
                );
              })}
              {visits.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    No visits recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
