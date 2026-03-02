"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GardenCanvas } from "@/components/garden/GardenCanvas";
import { GardenLegend } from "@/components/garden/GardenLegend";
import { CareCalendar } from "@/components/garden/CareCalendar";
import { GeneratingOverlay } from "@/components/GeneratingOverlay";
import type { GardenDesign, WizardData } from "@/types/garden";

export default function WizardResultPage() {
  const router = useRouter();
  const [design, setDesign] = useState<GardenDesign | null>(null);
  const [wizardData, setWizardData] = useState<WizardData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedDesign = sessionStorage.getItem("gardenDesign");
    const storedWizard = sessionStorage.getItem("wizardData");

    if (!storedDesign || !storedWizard) {
      router.push("/wizard");
      return;
    }

    try {
      setDesign(JSON.parse(storedDesign));
      setWizardData(JSON.parse(storedWizard));
    } catch {
      router.push("/wizard");
    }
  }, [router]);

  const handleRegenerate = async () => {
    if (!wizardData) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wizardData }),
      });

      if (!res.ok) {
        let errorMsg = "Generation failed — please try again.";
        try {
          const err = await res.json();
          if (err.error) errorMsg = err.error;
        } catch {}
        throw new Error(errorMsg);
      }

      const result = await res.json();
      setDesign(result.design);
      sessionStorage.setItem("gardenDesign", JSON.stringify(result.design));
      setSaved(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Regeneration failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!design || !wizardData) return;
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/gardens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: wizardData.name,
          wizardData,
          designJson: design,
        }),
      });

      if (!res.ok) {
        let errorMsg = "Save failed — please try again.";
        try {
          const err = await res.json();
          if (err.error) errorMsg = err.error;
        } catch {}
        throw new Error(errorMsg);
      }

      const result = await res.json();
      setSaved(true);
      setSavedId(result.garden.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (!design || !wizardData) return null;

  return (
    <div className="min-h-screen bg-mint/20">
      <GeneratingOverlay isVisible={isGenerating} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">
              {wizardData.name}
            </h1>
            <p className="text-gray-600 mt-1">
              {wizardData.widthFt}×{wizardData.lengthFt} ft · Zone {wizardData.usdaZone} · {wizardData.style} style
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRegenerate}
              className="px-4 py-2 border-2 border-primary text-primary font-medium rounded-xl hover:bg-primary hover:text-white transition-all"
            >
              🔄 Regenerate
            </button>
            {saved && savedId ? (
              <a
                href={`/garden/${savedId}`}
                className="px-4 py-2 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors"
              >
                ✓ Saved — View Garden
              </a>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-harvest text-primary font-bold rounded-xl hover:bg-harvest/90 disabled:opacity-50 transition-colors"
              >
                {isSaving ? "Saving…" : "💾 Save Garden"}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Main layout: canvas + legend */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <GardenCanvas
              design={design}
              widthFt={wizardData.widthFt}
              lengthFt={wizardData.lengthFt}
              orientation={wizardData.orientation}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="card sticky top-4 max-h-[80vh] overflow-y-auto">
              <GardenLegend design={design} />
            </div>
          </div>
        </div>

        {/* Care Calendar */}
        <div className="mt-8 card">
          <CareCalendar design={design} />
        </div>

        {/* Back to wizard */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => router.push("/wizard")}
            className="text-sm text-gray-500 hover:text-primary transition-colors"
          >
            ← Start over with new settings
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-gray-500 hover:text-primary transition-colors"
          >
            Go to Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
