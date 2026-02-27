"use client";

import { useState } from "react";
import { usdaZones } from "@/data/usda-zones";
import type { WizardData } from "@/types/garden";

interface StepProps {
  data: WizardData;
  updateData: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}

export function Step2Zone({ data, updateData }: StepProps) {
  const [search, setSearch] = useState("");

  const filtered = usdaZones.filter(
    (z) =>
      z.label.toLowerCase().includes(search.toLowerCase()) ||
      z.description.toLowerCase().includes(search.toLowerCase())
  );

  const selectedZone = usdaZones.find((z) => z.id === data.usdaZone);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-primary mb-2">What&apos;s your USDA hardiness zone?</h2>
        <p className="text-gray-600">Your zone determines which plants will thrive and when to plant them.</p>
      </div>

      {selectedZone && (
        <div className="card bg-mint border-primary/20">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🌡️</div>
            <div>
              <div className="font-bold text-primary text-lg">{selectedZone.label}</div>
              <div className="text-sm text-gray-600">{selectedZone.description}</div>
              <div className="text-xs text-gray-500 mt-1">
                Min temp: {selectedZone.minTemp}°F · First frost: {selectedZone.firstFrost} · Last frost: {selectedZone.lastFrost}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          placeholder="Search zones (e.g. '6b', 'Chicago', 'tropical')…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 pl-10 border-2 border-sage/30 rounded-xl focus:border-primary focus:outline-none transition-colors"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto pr-1">
        {filtered.map((zone) => (
          <button
            key={zone.id}
            onClick={() => updateData("usdaZone", zone.id)}
            title={zone.description}
            className={`
              py-2 px-1 rounded-lg text-xs font-bold border-2 transition-all
              ${data.usdaZone === zone.id
                ? "bg-primary text-white border-primary shadow-md scale-105"
                : "border-sage/30 text-gray-700 hover:border-primary hover:bg-mint"
              }
            `}
          >
            {zone.label.replace("Zone ", "")}
          </button>
        ))}
      </div>

      <p className="text-xs text-center text-gray-500">
        Not sure? Look up your ZIP code at{" "}
        <span className="text-primary font-medium">planthardiness.ars.usda.gov</span>
      </p>
    </div>
  );
}
