"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Plant } from "@/types/garden";

interface IconsClientProps {
  plants: Plant[];
  overrides: Record<string, string>;
}

export function IconsClient({ plants, overrides }: IconsClientProps) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(plants.map((p) => [p.id, overrides[p.id] ?? p.emoji]))
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const categories = ["vegetable", "herb", "flower"] as const;
  const categoryLabel: Record<string, string> = {
    vegetable: "Vegetables",
    herb: "Herbs",
    flower: "Flowers",
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const updates = plants.map((p) => ({ plantId: p.id, emoji: values[p.id] ?? p.emoji }));
      const res = await fetch("/api/admin/plant-icons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (!res.ok) throw new Error("Save failed");
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{plants.length} plants — edit emoji to override display</p>
        <div className="flex items-center gap-3">
          {status === "saved" && <span className="text-sm text-green-600 font-medium">Saved!</span>}
          {status === "error" && <span className="text-sm text-red-600 font-medium">Save failed</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save All"}
          </button>
        </div>
      </div>

      {categories.map((cat) => {
        const group = plants.filter((p) => p.category === cat);
        if (group.length === 0) return null;
        return (
          <div key={cat}>
            <h2 className="font-serif font-bold text-gray-800 mb-3">{categoryLabel[cat]}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {group.map((plant) => (
                <div
                  key={plant.id}
                  className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white"
                >
                  <span className="text-2xl w-9 text-center">{values[plant.id] ?? plant.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-700 truncate">{plant.name}</div>
                    <input
                      type="text"
                      value={values[plant.id] ?? plant.emoji}
                      onChange={(e) => setValues((prev) => ({ ...prev, [plant.id]: e.target.value }))}
                      className="mt-0.5 w-full text-sm border border-gray-200 rounded px-1.5 py-0.5 focus:border-primary focus:outline-none"
                      maxLength={8}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
