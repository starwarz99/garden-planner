"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { GardenCanvas } from "@/components/garden/GardenCanvas";
import { GardenLegend } from "@/components/garden/GardenLegend";
import { CareCalendar } from "@/components/garden/CareCalendar";
import { GeneratingOverlay } from "@/components/GeneratingOverlay";
import type { GardenDesign, WizardData } from "@/types/garden";
import { getPlanConfig } from "@/lib/plans";

export default function WizardResultPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const planConfig = getPlanConfig(session?.user?.plan ?? "seedling");
  const [design, setDesign] = useState<GardenDesign | null>(null);
  const [wizardData, setWizardData] = useState<WizardData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);
  const [diagramHeight, setDiagramHeight] = useState<number | undefined>(undefined);
  const hasSavedRef = useRef(false);

  useEffect(() => {
    const el = diagramRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setDiagramHeight(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, [design]);

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

  const captureSvg = (): string | null => {
    const svgEl = document.getElementById("garden-canvas-svg") as SVGSVGElement | null;
    if (!svgEl) return null;
    const { width, height } = svgEl.getBoundingClientRect();
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("width", String(Math.round(width)));
    clone.setAttribute("height", String(Math.round(height)));
    return new XMLSerializer().serializeToString(clone);
  };

  const doSave = async (d: GardenDesign, w: WizardData, existingId?: string | null) => {
    setIsSaving(true);
    setError(null);
    try {
      const svgSnapshot = captureSvg();

      if (existingId) {
        const res = await fetch(`/api/gardens/${existingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ designJson: d, svgSnapshot }),
        });
        if (!res.ok) throw new Error("Update failed — please try again.");
      } else {
        const res = await fetch("/api/gardens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: w.name, wizardData: w, designJson: d, svgSnapshot }),
        });
        if (!res.ok) {
          let msg = "Save failed — please try again.";
          try { const err = await res.json(); if (err.error) msg = err.error; } catch {}
          throw new Error(msg);
        }
        const result = await res.json();
        setSavedId(result.garden.id);
      }
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      hasSavedRef.current = false; // allow retry on next render
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save when design first loads from sessionStorage
  useEffect(() => {
    if (!design || !wizardData || hasSavedRef.current) return;
    hasSavedRef.current = true;
    void doSave(design, wizardData);
    // doSave is intentionally omitted from deps — hasSavedRef guards against re-runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design, wizardData]);

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
        try { const err = await res.json(); if (err.error) errorMsg = err.error; } catch {}
        throw new Error(errorMsg);
      }

      const result = await res.json();
      const newDesign: GardenDesign = result.design;
      setDesign(newDesign);
      sessionStorage.setItem("gardenDesign", JSON.stringify(newDesign));

      // Update the already-saved garden with the new design
      await doSave(newDesign, wizardData, savedId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Regeneration failed");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!design || !wizardData) return null;

  return (
    <div className="min-h-screen bg-mint/20">
      <GeneratingOverlay isVisible={isGenerating} />

      {/* Zoom Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex flex-col"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="flex items-center justify-between px-4 py-3 shrink-0">
            <span className="text-white font-semibold text-sm">{wizardData.name}</span>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-white/70 hover:text-white text-3xl leading-none px-2"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div
            className="flex-1 overflow-auto p-4"
            style={{ touchAction: "manipulation" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ minWidth: 640 }}>
              <GardenCanvas
                design={design}
                widthFt={wizardData.widthFt}
                lengthFt={wizardData.lengthFt}
                orientation={wizardData.orientation}
              />
            </div>
          </div>
        </div>
      )}

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
          <div className="flex gap-3 items-center">
            {planConfig.canRegenerate ? (
              <button
                onClick={handleRegenerate}
                className="px-4 py-2 border-2 border-primary text-primary font-medium rounded-xl hover:bg-primary hover:text-white transition-all"
              >
                🔄 Regenerate
              </button>
            ) : (
              <div className="group relative">
                <button
                  disabled
                  className="px-4 py-2 border-2 border-gray-200 text-gray-400 font-medium rounded-xl cursor-not-allowed"
                >
                  🔄 Regenerate
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 text-center text-xs bg-gray-800 text-white rounded-lg px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Upgrade to 🌿 Grower to regenerate
                </div>
              </div>
            )}
            {isSaving ? (
              <span className="text-sm text-gray-400 animate-pulse">Saving…</span>
            ) : saved && savedId ? (
              <a
                href={`/garden/${savedId}`}
                className="px-4 py-2 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors"
              >
                ✓ View Garden
              </a>
            ) : null}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Main layout: canvas + legend */}
        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6 items-start">
          <div ref={diagramRef}>
            <GardenCanvas
              design={design}
              widthFt={wizardData.widthFt}
              lengthFt={wizardData.lengthFt}
              orientation={wizardData.orientation}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
            >
              🔍 View larger / zoom
            </button>
          </div>
          <div style={{ height: diagramHeight ?? "auto" }} className="card overflow-hidden">
            <div className="h-full overflow-y-auto">
              <GardenLegend design={design} showYield={planConfig.canSeeYield} />
            </div>
          </div>
        </div>

        {/* Care Calendar — Harvest plan only */}
        {planConfig.canSeeCareCalendar ? (
          <div className="mt-8 card">
            <CareCalendar design={design} />
          </div>
        ) : (
          <div className="mt-8 card bg-gray-50 text-center py-8">
            <div className="text-2xl mb-2">📅</div>
            <div className="font-semibold text-gray-700">12-Month Care Calendar</div>
            <div className="text-sm text-gray-500 mt-1">
              Upgrade to <span className="text-primary font-semibold">Harvest</span> to unlock the full year-round care schedule.
            </div>
          </div>
        )}

        {/* Bottom nav */}
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
