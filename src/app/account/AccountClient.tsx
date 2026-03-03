"use client";

import { useState } from "react";
import { usdaZones } from "@/data/usda-zones";
import type { GardenGoal } from "@/types/garden";
import { getPlanConfig } from "@/lib/plans";

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  plan: string;
  zipCode: string | null;
  usdaZone: string | null;
  soilType: string | null;
  experience: string | null;
  waterPref: string | null;
  sunExposure: string | null;
  orientation: string | null;
  goals: string[];
}

interface AccountClientProps {
  user: UserData;
}

const goalOptions: Array<{ id: GardenGoal; label: string }> = [
  { id: "maximize-yield",      label: "Maximize Yield" },
  { id: "low-maintenance",     label: "Low Maintenance" },
  { id: "pollinator-friendly", label: "Pollinator-Friendly" },
  { id: "cut-flowers",         label: "Cut Flowers" },
  { id: "culinary-herbs",      label: "Culinary Herbs" },
  { id: "year-round",          label: "Year-Round Harvest" },
  { id: "organic",             label: "Organic Growing" },
  { id: "kids-garden",         label: "Kid-Friendly" },
];

export function AccountClient({ user }: AccountClientProps) {
  const planConfig = getPlanConfig(user.plan);
  const [form, setForm] = useState({
    name:        user.name ?? "",
    zipCode:     user.zipCode ?? "",
    usdaZone:    user.usdaZone ?? "",
    soilType:    user.soilType ?? "",
    experience:  user.experience ?? "",
    waterPref:   user.waterPref ?? "",
    sunExposure: user.sunExposure ?? "",
    orientation: user.orientation ?? "",
    goals:       user.goals as GardenGoal[],
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const initials = (form.name || user.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const toggleGoal = (goal: GardenGoal) => {
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleSave = async () => {
    setStatus("saving");
    setErrorMsg("");

    const prefs: Record<string, unknown> = {};
    if (form.zipCode)     prefs.zipCode = form.zipCode;
    if (form.usdaZone)    prefs.usdaZone = form.usdaZone;
    if (form.soilType)    prefs.soilType = form.soilType;
    if (form.experience)  prefs.experience = form.experience;
    if (form.waterPref)   prefs.waterPref = form.waterPref;
    if (form.sunExposure) prefs.sunExposure = form.sunExposure;
    if (form.orientation) prefs.orientation = form.orientation;
    prefs.goals = form.goals;

    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name || undefined, prefs }),
    });

    if (res.ok) {
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      const err = await res.json().catch(() => ({}));
      setErrorMsg(err.error ?? "Save failed");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-mint/20 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-serif font-bold text-primary">My Account</h1>

        {/* Profile section */}
        <div className="card space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">Profile</h2>

          <div className="flex items-center gap-4">
            {user.image ? (
              <img
                src={user.image}
                alt={form.name || "Avatar"}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {initials}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">{form.name || "—"}</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {planConfig.emoji} {planConfig.name}
                </span>
              </div>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl focus:border-primary focus:outline-none transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user.email ?? ""}
              readOnly
              className="w-full px-4 py-3 border-2 border-sage/20 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Garden preferences section */}
        <div className="card space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Garden Preferences</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                These defaults pre-fill the wizard whenever you start a new garden.
              </p>
            </div>
            {!planConfig.canSavePreferences && (
              <span className="flex-shrink-0 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
                🌿 Grower feature
              </span>
            )}
          </div>

          {!planConfig.canSavePreferences && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              Upgrade to <strong>🌿 Grower</strong> to save your garden preferences and have the wizard pre-filled automatically every time.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code <span className="text-gray-400 font-normal">(for zone lookup)</span>
              </label>
              <input
                type="text"
                value={form.zipCode}
                onChange={(e) => setForm((prev) => ({ ...prev, zipCode: e.target.value }))}
                maxLength={10}
                className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl focus:border-primary focus:outline-none transition-colors"
                placeholder="e.g. 60601"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">USDA Zone</label>
              <select
                value={form.usdaZone}
                onChange={(e) => setForm((prev) => ({ ...prev, usdaZone: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl focus:border-primary focus:outline-none transition-colors bg-white"
              >
                <option value="">— select —</option>
                {usdaZones.map((z) => (
                  <option key={z.id} value={z.id}>{z.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
              <select
                value={form.soilType}
                onChange={(e) => setForm((prev) => ({ ...prev, soilType: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl focus:border-primary focus:outline-none transition-colors bg-white"
              >
                <option value="">— select —</option>
                <option value="loamy">Loamy</option>
                <option value="sandy">Sandy</option>
                <option value="clay">Clay</option>
                <option value="raised-bed">Raised Bed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
              <select
                value={form.experience}
                onChange={(e) => setForm((prev) => ({ ...prev, experience: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl focus:border-primary focus:outline-none transition-colors bg-white"
              >
                <option value="">— select —</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Water Preference</label>
              <select
                value={form.waterPref}
                onChange={(e) => setForm((prev) => ({ ...prev, waterPref: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl focus:border-primary focus:outline-none transition-colors bg-white"
              >
                <option value="">— select —</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sun Exposure</label>
              <select
                value={form.sunExposure}
                onChange={(e) => setForm((prev) => ({ ...prev, sunExposure: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl focus:border-primary focus:outline-none transition-colors bg-white"
              >
                <option value="">— select —</option>
                <option value="full-sun">Full Sun</option>
                <option value="partial-sun">Partial Sun</option>
                <option value="partial-shade">Partial Shade</option>
                <option value="full-shade">Full Shade</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Garden typically faces...
              </label>
              <select
                value={form.orientation}
                onChange={(e) => setForm((prev) => ({ ...prev, orientation: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl focus:border-primary focus:outline-none transition-colors bg-white"
              >
                <option value="">— select —</option>
                <option value="south">South</option>
                <option value="north">North</option>
                <option value="east">East</option>
                <option value="west">West</option>
              </select>
            </div>
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Garden Goals</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {goalOptions.map((goal) => {
                const checked = form.goals.includes(goal.id);
                return (
                  <label
                    key={goal.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 cursor-pointer transition-all text-sm
                      ${checked
                        ? "bg-primary/10 border-primary text-primary font-medium"
                        : "border-sage/30 text-gray-700 hover:border-primary/40"
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleGoal(goal.id)}
                    />
                    <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center
                      ${checked ? "bg-primary border-primary" : "border-gray-300"}`}
                    >
                      {checked && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {goal.label}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Save button */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={status === "saving" || !planConfig.canSavePreferences}
              className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === "saving" ? "Saving…" : "Save Preferences"}
            </button>
            {status === "saved" && (
              <p className="mt-2 text-sm text-green-600 font-medium">Preferences saved!</p>
            )}
            {status === "error" && (
              <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
