"use client";

import { useState } from "react";
import type { Plan } from "@/lib/plans";

interface PricingCardsProps {
  currentPlan?: string;
  /** If true, shows compact layout suitable for embedding in account page */
  compact?: boolean;
  isLoggedIn?: boolean;
}

const TIERS = [
  {
    id: "seedling" as Plan,
    emoji: "🌱",
    name: "Seedling",
    price: "Free",
    tagline: "Start growing",
    features: [
      "1 saved garden",
      "Gardens up to 12×12 ft",
      "AI-generated layout",
      "Zone-aware plant picker",
      "Companion planting notes",
    ],
    missing: [
      "Regenerate designs",
      "Quantity controls (more/less)",
      "Estimated yield info",
      "Save garden preferences",
      "12-month care calendar",
    ],
    cta: "Current plan",
    highlight: false,
  },
  {
    id: "grower" as Plan,
    emoji: "🌿",
    name: "Grower",
    price: "$5.99",
    tagline: "/ month",
    features: [
      "3 saved gardens",
      "Gardens up to 40×40 ft",
      "Regenerate designs",
      "Quantity controls (more/less)",
      "Estimated yield info",
      "Save garden preferences",
      "Everything in Seedling",
    ],
    missing: ["12-month care calendar"],
    cta: "Upgrade to Grower",
    highlight: true,
  },
  {
    id: "harvest" as Plan,
    emoji: "🌻",
    name: "Harvest",
    price: "$9.99",
    tagline: "/ month",
    features: [
      "5 saved gardens",
      "Gardens up to 60×60 ft",
      "12-month care calendar",
      "Everything in Grower",
    ],
    missing: [],
    cta: "Upgrade to Harvest",
    highlight: false,
  },
];

export function PricingCards({ currentPlan = "seedling", compact = false, isLoggedIn = true }: PricingCardsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async (plan: "grower" | "harvest") => {
    if (!isLoggedIn) {
      window.location.href = "/auth/signin?callbackUrl=/pricing";
      return;
    }
    setLoading(plan);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  };

  const handleManage = async () => {
    setLoading("portal");
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Portal access failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  };

  const isCurrent = (id: string) => id === currentPlan;
  const isPaid = currentPlan !== "seedling";

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      <div className={`grid gap-4 ${compact ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 md:grid-cols-3"}`}>
        {TIERS.map((tier) => {
          const current = isCurrent(tier.id);
          return (
            <div
              key={tier.id}
              className={`relative rounded-2xl border-2 p-5 flex flex-col gap-4 transition-shadow
                ${current
                  ? "border-primary bg-primary/5 shadow-md"
                  : tier.highlight
                  ? "border-harvest shadow-lg"
                  : "border-sage/30 bg-white"
                }`}
            >
              {current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                  Your plan
                </div>
              )}
              {tier.highlight && !current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-harvest text-primary text-xs font-bold rounded-full">
                  Most popular
                </div>
              )}

              {/* Header */}
              <div>
                <div className="text-2xl mb-1">{tier.emoji}</div>
                <div className="font-serif font-bold text-lg text-gray-900">{tier.name}</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-primary">{tier.price}</span>
                  {tier.tagline !== "Start growing" && (
                    <span className="text-sm text-gray-500">{tier.tagline}</span>
                  )}
                  {tier.price === "Free" && (
                    <span className="text-sm text-gray-500">forever</span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-1.5 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
                {!compact && tier.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="mt-0.5 flex-shrink-0">✗</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {current ? (
                <div className="space-y-2">
                  <div className="w-full py-2 text-center text-sm font-semibold text-primary bg-primary/10 rounded-xl">
                    ✓ Active plan
                  </div>
                  {isPaid && (
                    <button
                      onClick={handleManage}
                      disabled={loading === "portal"}
                      className="w-full py-2 text-center text-xs text-gray-500 hover:text-primary underline transition-colors disabled:opacity-50"
                    >
                      {loading === "portal" ? "Opening portal…" : "Manage or cancel subscription"}
                    </button>
                  )}
                </div>
              ) : tier.id === "seedling" ? (
                <div className="w-full py-2 text-center text-sm text-gray-400 bg-gray-50 rounded-xl border border-gray-200">
                  Free forever
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(tier.id as "grower" | "harvest")}
                  disabled={!!loading}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    ${tier.highlight
                      ? "bg-harvest text-primary hover:bg-harvest/90 shadow-md"
                      : "bg-primary text-white hover:bg-primary/90"
                    }`}
                >
                  {loading === tier.id ? "Redirecting…" : tier.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
