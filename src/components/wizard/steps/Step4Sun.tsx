"use client";

import type { WizardData, SunExposure, Orientation } from "@/types/garden";

interface StepProps {
  data: WizardData;
  updateData: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}

const sunOptions: Array<{ id: SunExposure; label: string; emoji: string; hours: string; description: string }> = [
  { id: "full-sun", label: "Full Sun", emoji: "☀️", hours: "6+ hours", description: "Direct sunlight most of the day" },
  { id: "partial-sun", label: "Partial Sun", emoji: "🌤️", hours: "4–6 hours", description: "Morning sun, afternoon shade" },
  { id: "partial-shade", label: "Partial Shade", emoji: "⛅", hours: "2–4 hours", description: "Dappled light through trees" },
  { id: "full-shade", label: "Full Shade", emoji: "🌥️", hours: "< 2 hours", description: "North-facing or under canopy" },
];

const orientations: Array<{ id: Orientation; label: string; symbol: string }> = [
  { id: "north", label: "North", symbol: "N" },
  { id: "east", label: "East", symbol: "E" },
  { id: "south", label: "South", symbol: "S" },
  { id: "west", label: "West", symbol: "W" },
];

function CompassRosePicker({
  value,
  onChange,
}: {
  value: Orientation;
  onChange: (o: Orientation) => void;
}) {
  return (
    <div className="relative w-40 h-40 mx-auto">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-sage/30 bg-mint/50" />
      {/* Center dot */}
      <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full z-10" />
      {/* Direction buttons */}
      {orientations.map(({ id, label, symbol }) => {
        const positions: Record<Orientation, string> = {
          north: "top-1 left-1/2 -translate-x-1/2",
          south: "bottom-1 left-1/2 -translate-x-1/2",
          east: "right-1 top-1/2 -translate-y-1/2",
          west: "left-1 top-1/2 -translate-y-1/2",
        };
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`
              absolute w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
              transition-all duration-200 ${positions[id]}
              ${value === id
                ? "bg-primary text-white shadow-lg scale-110"
                : "bg-white border-2 border-sage/30 text-gray-600 hover:border-primary"
              }
            `}
            title={label}
          >
            {symbol}
          </button>
        );
      })}
      {/* Arrow showing selected direction */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          transform: `rotate(${
            value === "north" ? 0 : value === "east" ? 90 : value === "south" ? 180 : 270
          }deg)`,
          transition: "transform 0.3s ease",
        }}
      >
        <div className="w-0.5 h-12 bg-gradient-to-t from-transparent to-primary/60 mb-auto mt-2" />
      </div>
    </div>
  );
}

export function Step4Sun({ data, updateData }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-primary mb-2">Sun & Orientation</h2>
        <p className="text-gray-600">How much direct sunlight does your garden spot receive daily?</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sunOptions.map((sun) => (
          <button
            key={sun.id}
            onClick={() => updateData("sunExposure", sun.id)}
            className={`
              p-4 rounded-2xl border-2 text-left transition-all duration-200
              ${data.sunExposure === sun.id
                ? "bg-harvest/20 border-harvest shadow-md ring-2 ring-harvest/30"
                : "border-sage/30 hover:border-harvest/50 hover:bg-harvest/10"
              }
            `}
          >
            <div className="text-3xl mb-1">{sun.emoji}</div>
            <div className="font-bold text-gray-800">{sun.label}</div>
            <div className="text-xs text-primary font-medium">{sun.hours}</div>
            <div className="text-xs text-gray-500 mt-1">{sun.description}</div>
          </button>
        ))}
      </div>

      <div>
        <h3 className="text-center font-semibold text-gray-700 mb-4">Which direction does your garden face?</h3>
        <CompassRosePicker value={data.orientation} onChange={(o) => updateData("orientation", o)} />
        <p className="text-xs text-center text-gray-500 mt-3">
          South-facing gardens get the most sun in the Northern Hemisphere
        </p>
      </div>
    </div>
  );
}
