"use client";

import type { WizardData } from "@/types/garden";

interface StepProps {
  data: WizardData;
  updateData: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}

export function Step1Dimensions({ data, updateData }: StepProps) {
  const area = data.widthFt * data.lengthFt;
  const gridCols = Math.floor(data.widthFt / 2);
  const gridRows = Math.floor(data.lengthFt / 2);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-primary mb-2">How big is your garden?</h2>
        <p className="text-gray-600">Enter your garden&apos;s dimensions. The planner works best between 8×8 and 40×60 ft.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Width (feet)
          </label>
          <input
            type="number"
            min={4}
            max={200}
            value={data.widthFt}
            onChange={(e) => updateData("widthFt", Math.max(4, Number(e.target.value)))}
            className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl text-lg font-semibold text-center focus:border-primary focus:outline-none transition-colors"
          />
          <div className="flex gap-2">
            {[8, 12, 16, 20].map((w) => (
              <button
                key={w}
                onClick={() => updateData("widthFt", w)}
                className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                  data.widthFt === w
                    ? "bg-primary text-white border-primary"
                    : "border-sage/30 text-gray-600 hover:border-primary"
                }`}
              >
                {w} ft
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Length (feet)
          </label>
          <input
            type="number"
            min={4}
            max={200}
            value={data.lengthFt}
            onChange={(e) => updateData("lengthFt", Math.max(4, Number(e.target.value)))}
            className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl text-lg font-semibold text-center focus:border-primary focus:outline-none transition-colors"
          />
          <div className="flex gap-2">
            {[12, 20, 30, 40].map((l) => (
              <button
                key={l}
                onClick={() => updateData("lengthFt", l)}
                className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                  data.lengthFt === l
                    ? "bg-primary text-white border-primary"
                    : "border-sage/30 text-gray-600 hover:border-primary"
                }`}
              >
                {l} ft
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live preview */}
      <div className="card text-center space-y-2">
        <div className="text-4xl font-serif font-bold text-primary">{area} sq ft</div>
        <div className="text-sm text-gray-500">
          {data.widthFt} × {data.lengthFt} ft · {gridCols} × {gridRows} grid cells (2 ft each)
        </div>
        <div className="flex justify-center mt-3">
          <div
            className="border-2 border-primary/50 bg-mint rounded-lg flex items-center justify-center"
            style={{
              width: Math.min(data.widthFt * 8, 240),
              height: Math.min(data.lengthFt * 8, 240),
              minWidth: 60,
              minHeight: 60,
            }}
          >
            <span className="text-2xl">🌱</span>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          {area < 100 ? "Compact garden — great for beginners!" :
           area < 400 ? "Medium garden — plenty of variety!" :
           "Large garden — a full farm!"}
        </p>
      </div>
    </div>
  );
}
