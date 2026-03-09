import Link from "next/link";

interface PageEntry {
  path: string;
  label: string;
  description: string;
  access: "public" | "auth" | "admin";
  external?: boolean;
}

interface Section {
  heading: string;
  pages: PageEntry[];
}

const SECTIONS: Section[] = [
  {
    heading: "Public",
    pages: [
      { path: "/",              label: "Home",          description: "Landing page with hero, features, pricing CTA",                access: "public" },
      { path: "/pricing",       label: "Pricing",       description: "Plan comparison — Seedling, Grower, Harvest",                  access: "public" },
      { path: "/privacy",       label: "Privacy Policy",description: "Privacy policy page",                                          access: "public" },
      { path: "/data-deletion", label: "Data Deletion", description: "Instructions for requesting account/data deletion",            access: "public" },
    ],
  },
  {
    heading: "Auth",
    pages: [
      { path: "/auth/register", label: "Register",   description: "Create a new account (email + password)",  access: "public" },
      { path: "/auth/signin",   label: "Sign In",    description: "Sign in with email/password or Google",    access: "public" },
      { path: "/auth/error",    label: "Auth Error", description: "Displayed when authentication fails",      access: "public" },
    ],
  },
  {
    heading: "App (requires login)",
    pages: [
      { path: "/dashboard",      label: "My Gardens",    description: "Lists all saved garden designs; create / open / delete",   access: "auth" },
      { path: "/wizard",         label: "Garden Wizard", description: "10-step guided wizard to configure a new garden",          access: "auth" },
      { path: "/wizard/result",  label: "Wizard Result", description: "AI-generated garden grid + care calendar, auto-saved",     access: "auth" },
      { path: "/garden/[id]",    label: "Garden Detail", description: "View / edit a saved garden; zoom modal; regenerate",       access: "auth" },
      { path: "/account",        label: "Account",       description: "Profile, plan status, billing portal, delete account",     access: "auth" },
    ],
  },
  {
    heading: "Admin (admin users only)",
    pages: [
      { path: "/admin/users",    label: "Users",    description: "All users — plan badges, garden count, last login, cancel sub / delete", access: "admin" },
      { path: "/admin/icons",    label: "Icons",    description: "Override plant emojis site-wide; changes apply everywhere instantly",    access: "admin" },
      { path: "/admin/visitors", label: "Visitors", description: "Session-grouped site visit log — referrer, UTM, country, pages viewed", access: "admin" },
      { path: "/admin/sitemap",  label: "Site Map", description: "This page — full route inventory",                                      access: "admin" },
    ],
  },
  {
    heading: "Other",
    pages: [
      { path: "/promo-videos",   label: "Promo Videos",  description: "Canvas-rendered promo videos; record + download as MP4",   access: "public" },
      { path: "/icon-download",  label: "Icon Download",  description: "Download the app icon at various sizes",                   access: "public" },
    ],
  },
];

const API_ROUTES: { method: string; path: string; description: string }[] = [
  { method: "POST",   path: "/api/auth/register",        description: "Register new user (email + hashed password)" },
  { method: "ANY",    path: "/api/auth/[...nextauth]",   description: "NextAuth v5 handler — sign-in, sign-out, session, OAuth" },
  { method: "GET/PUT/DELETE", path: "/api/account",      description: "Fetch profile, update name/email, delete account" },
  { method: "GET/POST",       path: "/api/gardens",      description: "List gardens for current user; create new garden" },
  { method: "GET/PUT/DELETE", path: "/api/gardens/[id]", description: "Fetch, update (name/svg/design), or delete a garden" },
  { method: "POST",   path: "/api/generate",             description: "Send wizard answers to Claude AI; stream back garden JSON" },
  { method: "POST",   path: "/api/track",                description: "Fire-and-forget page visit logger (sessionId, UTM, geo)" },
  { method: "POST",   path: "/api/stripe/checkout",      description: "Create Stripe Checkout session for plan upgrade" },
  { method: "POST",   path: "/api/stripe/portal",        description: "Create Stripe Billing Portal session" },
  { method: "POST",   path: "/api/stripe/webhook",       description: "Handle Stripe events — subscription updates, cancellations" },
  { method: "GET/POST", path: "/api/admin/plant-icons",  description: "Get all icon overrides; upsert/delete overrides (admin only)" },
  { method: "POST/DELETE", path: "/api/admin/users/[id]","description": "Cancel subscription or delete user (admin only)" },
];

const accessBadge: Record<string, string> = {
  public: "bg-gray-100 text-gray-600",
  auth:   "bg-blue-50 text-blue-700",
  admin:  "bg-primary/10 text-primary",
};

const methodColor: Record<string, string> = {
  GET:    "bg-green-50 text-green-700",
  POST:   "bg-blue-50 text-blue-700",
  PUT:    "bg-amber-50 text-amber-700",
  DELETE: "bg-red-50 text-red-600",
  ANY:    "bg-gray-100 text-gray-600",
  "GET/POST":        "bg-purple-50 text-purple-700",
  "GET/PUT/DELETE":  "bg-orange-50 text-orange-700",
  "POST/DELETE":     "bg-red-50 text-red-600",
};

export default function SitemapPage() {
  return (
    <div className="space-y-10">
      {/* Pages */}
      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.heading}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              {section.heading}
            </h2>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  {section.pages.map((page) => (
                    <tr key={page.path} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap w-48">
                        {page.path}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap w-40">
                        <Link
                          href={page.path.includes("[") ? "#" : page.path}
                          className={page.path.includes("[") ? "cursor-default" : "hover:text-primary transition-colors"}
                          target={page.access === "public" ? "_blank" : undefined}
                        >
                          {page.label}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{page.description}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${accessBadge[page.access]}`}>
                          {page.access}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* API Routes */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          API Routes
        </h2>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600 text-xs w-36">Method</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600 text-xs w-64">Path</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600 text-xs">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {API_ROUTES.map((r) => (
                <tr key={r.path} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${methodColor[r.method] ?? "bg-gray-100 text-gray-600"}`}>
                      {r.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.path}</td>
                  <td className="px-4 py-3 text-gray-500">{r.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
