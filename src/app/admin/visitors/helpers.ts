// Pure helpers shared between server page and client component

export function countryFlag(code: string | null): string {
  if (!code || code.length !== 2) return "🌐";
  try {
    return String.fromCodePoint(
      ...code.toUpperCase().split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
    );
  } catch {
    return "🌐";
  }
}

export function parseDevice(ua: string | null): { icon: string; label: string } {
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

export interface SourceInfo {
  icon: string;
  label: string;
  sub?: string;
}

export function parseSource(visit: {
  fbclid: string | null;
  gclid: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
}): SourceInfo {
  if (visit.fbclid) return { icon: "📘", label: "Facebook Ad", sub: visit.utmCampaign ?? undefined };
  if (visit.gclid)  return { icon: "🔍", label: "Google Ad",   sub: visit.utmCampaign ?? undefined };
  if (visit.utmSource) {
    const src = visit.utmSource;
    const icon =
      /facebook|fb/.test(src)              ? "📘" :
      /google/.test(src)                   ? "🔍" :
      /instagram/.test(src)                ? "📷" :
      /twitter|x\.com/.test(src)           ? "🐦" :
      /email|newsletter/.test(src)         ? "📧" : "📣";
    return { icon, label: src, sub: visit.utmCampaign ?? undefined };
  }
  if (visit.referrer) {
    try {
      const host = new URL(visit.referrer).hostname.replace(/^www\./, "");
      const icon =
        /google/.test(host)          ? "🔍" :
        /facebook|fb\.com/.test(host)? "📘" :
        /instagram/.test(host)       ? "📷" :
        /twitter|x\.com/.test(host)  ? "🐦" :
        /bing/.test(host)            ? "🔍" : "🔗";
      return { icon, label: host };
    } catch {
      return { icon: "🔗", label: visit.referrer.slice(0, 40) };
    }
  }
  return { icon: "➡️", label: "Direct" };
}

export function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diffMs / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function formatDuration(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  const m = Math.floor(ms / 60_000);
  const s = Math.round((ms % 60_000) / 1000);
  if (m < 60) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
}

export function shortTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}
