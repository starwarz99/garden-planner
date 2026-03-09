import { prisma } from "@/lib/prisma";
import { countryFlag, parseDevice, parseSource } from "./helpers";
import { VisitorsClient } from "./VisitorsClient";
import type { SessionSummary } from "./VisitorsClient";

export const metadata = { title: "Visitors — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminVisitorsPage() {
  const visits = await prisma.siteVisit.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { id: true, name: true, email: true, plan: true } },
    },
  });

  // Group by sessionId — fall back to visit.id so old rows each get their own row
  const sessionMap = new Map<string, typeof visits>();
  for (const v of visits) {
    const key = v.sessionId ?? v.id;
    if (!sessionMap.has(key)) sessionMap.set(key, []);
    sessionMap.get(key)!.push(v);
  }

  // Build SessionSummary for each group, sorted newest-first
  const sessions: SessionSummary[] = Array.from(sessionMap.values())
    .map((pages) => {
      // Pages are already asc by createdAt from the query
      const first = pages[0];
      const last  = pages[pages.length - 1];
      const source = parseSource(first);
      const device = parseDevice(first.userAgent);

      // Use the authenticated user from any page in the session
      const authedPage = pages.find((p) => p.user);
      const user = authedPage?.user ?? null;

      const locationLabel = first.city
        ? `${first.city}${first.country ? `, ${first.country}` : ""}`
        : (first.country ?? "");

      return {
        sessionId:     first.sessionId ?? first.id,
        firstSeen:     first.createdAt.toISOString(),
        lastSeen:      last.createdAt.toISOString(),
        durationMs:    last.createdAt.getTime() - first.createdAt.getTime(),
        pageCount:     pages.length,
        sourceIcon:    source.icon,
        sourceLabel:   source.label,
        sourceSub:     source.sub,
        locationFlag:  countryFlag(first.country),
        locationLabel,
        deviceIcon:    device.icon,
        deviceLabel:   device.label,
        ipAddress:     first.ipAddress,
        userName:      user?.name ?? null,
        userEmail:     user?.email ?? null,
        userPlan:      user?.plan ?? null,
        pages: pages.map((p) => ({
          id:        p.id,
          createdAt: p.createdAt.toISOString(),
          path:      p.path,
        })),
      } satisfies SessionSummary;
    })
    .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());

  // Stats
  const totalPageViews = visits.length;
  const totalSessions  = sessions.length;
  const uniqueIPs      = new Set(visits.map((v) => v.ipAddress).filter(Boolean)).size;
  const campaignCount  = sessions.filter(
    (s) => s.sourceLabel !== "Direct" && !s.sourceLabel.match(/^[a-z0-9.-]+\.[a-z]{2,}$/i)
  ).length;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Sessions",    value: totalSessions,  icon: "👤" },
          { label: "Page views",  value: totalPageViews, icon: "👣" },
          { label: "Unique IPs",  value: uniqueIPs,      icon: "🌐" },
          { label: "Via campaign",value: campaignCount,  icon: "📣" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="card text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">
            Sessions
            <span className="ml-2 text-xs font-normal text-gray-400">
              (last 5 days · click a row to see pages visited)
            </span>
          </h2>
        </div>
        <VisitorsClient sessions={sessions} />
      </div>
    </div>
  );
}
