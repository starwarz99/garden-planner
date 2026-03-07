"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Plant } from "@/types/garden";
import { DEFAULT_PLANT_BG, BG_COLOR_OPTIONS } from "@/lib/plant-icon-config";
import type { PlantOverride } from "@/lib/plant-icon-config";

interface IconsClientProps {
  plants: Plant[];
  overrides: Record<string, PlantOverride>;
}

const EMOJI_OPTIONS = [
  // Common vegetables
  "🍅","🥕","🥦","🌽","🥬","🫑","🧅","🧄","🥔","🍆","🥒","🫛","🥑","🌶️","🍠","🫚",
  // More vegetables & legumes
  "🫘","🌰","🥜","🧆","🥗","🥙",
  // Mushrooms
  "🍄","🍄‍🟫",
  // Herbs & greens
  "🌿","🪴","🌱","🍃","🫙","🍵","🌾",
  // Flowers
  "🌸","🌻","🌺","🌹","🌷","💐","🪻","🌼","🏵️","💮",
  // Trees & shrubs
  "🌵","🌴","🌳","🌲","🎋","🎍","🪵",
  // Berries & small fruits
  "🍓","🫐","🍒","🍇","🫒","🍈","🥝",
  // Citrus & tropical
  "🍋","🍊","🍑","🥭","🍍","🥥","🍌","🍐","🍏","🍎",
  // Melons & squash
  "🍉","🎃",
  // Nature & pollinators
  "🍀","☘️","🍂","🍁","🐝","🦋","🐛","🪱","🐌","🐞","🦗","🪲","🐜",
  // Weather & garden tools
  "☀️","🌤️","💧","💦","🪣","🌡️","🪺","🪨",
];

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onClose]);
}

function EmojiPicker({ current, onSelect, onClose }: {
  current: string; onSelect: (e: string) => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);
  return (
    <div ref={ref} className="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-2 w-56">
      <div className="grid grid-cols-8 gap-0.5">
        {EMOJI_OPTIONS.map((emoji, i) => (
          <button key={i} onClick={() => { onSelect(emoji); onClose(); }}
            className={`text-lg rounded p-0.5 hover:bg-gray-100 transition-colors ${emoji === current ? "bg-primary/10 ring-1 ring-primary" : ""}`}>
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

function ColorPicker({ current, onSelect, onClose }: {
  current: string; onSelect: (c: string) => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);
  return (
    <div ref={ref} className="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-2.5 w-48">
      <div className="grid grid-cols-6 gap-1.5">
        {BG_COLOR_OPTIONS.map((color) => (
          <button key={color} onClick={() => { onSelect(color); onClose(); }}
            title={color}
            className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${color === current ? "border-gray-600 scale-110" : "border-gray-200 hover:border-gray-400"}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

export function IconsClient({ plants, overrides }: IconsClientProps) {
  const router = useRouter();
  const [emojis, setEmojis] = useState<Record<string, string>>(() =>
    Object.fromEntries(plants.map((p) => [p.id, overrides[p.id]?.emoji ?? p.emoji]))
  );
  const [bgColors, setBgColors] = useState<Record<string, string>>(() =>
    Object.fromEntries(plants.map((p) => [p.id, overrides[p.id]?.bgColor ?? DEFAULT_PLANT_BG[p.category] ?? "#f0fdf4"]))
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [openEmoji, setOpenEmoji] = useState<string | null>(null);
  const [openColor, setOpenColor] = useState<string | null>(null);

  const categories = ["vegetable", "herb", "flower"] as const;
  const categoryLabel: Record<string, string> = { vegetable: "Vegetables", herb: "Herbs", flower: "Flowers" };

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const updates = plants.map((p) => ({
        plantId: p.id,
        emoji: emojis[p.id] ?? p.emoji,
        bgColor: bgColors[p.id] ?? DEFAULT_PLANT_BG[p.category] ?? "#f0fdf4",
      }));
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
        <p className="text-sm text-gray-500">{plants.length} plants — click emoji to change icon, color dot to change background</p>
        <div className="flex items-center gap-3">
          {status === "saved" && <span className="text-sm text-green-600 font-medium">Saved!</span>}
          {status === "error" && <span className="text-sm text-red-600 font-medium">Save failed</span>}
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
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
              {group.map((plant) => {
                const bg = bgColors[plant.id] ?? DEFAULT_PLANT_BG[plant.category];
                return (
                  <div key={plant.id} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 transition-colors"
                    style={{ backgroundColor: bg }}>

                    {/* Emoji picker */}
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => { setOpenColor(null); setOpenEmoji(openEmoji === plant.id ? null : plant.id); }}
                        className="text-2xl w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/60 transition-colors"
                        title="Click to choose emoji">
                        {emojis[plant.id] ?? plant.emoji}
                      </button>
                      {openEmoji === plant.id && (
                        <EmojiPicker
                          current={emojis[plant.id] ?? plant.emoji}
                          onSelect={(e) => setEmojis((prev) => ({ ...prev, [plant.id]: e }))}
                          onClose={() => setOpenEmoji(null)}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        <div className="text-xs font-medium text-gray-700 truncate flex-1">{plant.name}</div>
                        {/* Color picker trigger */}
                        <div className="relative flex-shrink-0">
                          <button
                            onClick={() => { setOpenEmoji(null); setOpenColor(openColor === plant.id ? null : plant.id); }}
                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform flex-shrink-0"
                            style={{ backgroundColor: bg }}
                            title="Click to change background color"
                          />
                          {openColor === plant.id && (
                            <ColorPicker
                              current={bg}
                              onSelect={(c) => setBgColors((prev) => ({ ...prev, [plant.id]: c }))}
                              onClose={() => setOpenColor(null)}
                            />
                          )}
                        </div>
                      </div>
                      <input type="text"
                        value={emojis[plant.id] ?? plant.emoji}
                        onChange={(e) => setEmojis((prev) => ({ ...prev, [plant.id]: e.target.value }))}
                        className="w-full text-sm bg-white/70 border border-white/80 rounded px-1.5 py-0.5 focus:border-primary focus:outline-none"
                        maxLength={8}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
