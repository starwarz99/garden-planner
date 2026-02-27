"use client";

import type { GardenDesign } from "@/types/garden";

interface CareCalendarProps {
  design: GardenDesign;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTH_COLORS = [
  "bg-blue-50",   // Jan
  "bg-blue-50",   // Feb
  "bg-green-50",  // Mar
  "bg-green-100", // Apr
  "bg-green-200", // May
  "bg-yellow-50", // Jun
  "bg-yellow-100",// Jul
  "bg-orange-50", // Aug
  "bg-orange-100",// Sep
  "bg-amber-50",  // Oct
  "bg-amber-100", // Nov
  "bg-blue-50",   // Dec
];

export function CareCalendar({ design }: CareCalendarProps) {
  const currentMonth = new Date().getMonth();

  return (
    <div>
      <h3 className="font-serif font-bold text-gray-800 text-lg mb-4">12-Month Care Calendar</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {MONTHS.map((month, i) => {
          const tasks = design.careCalendar[month] ?? [];
          const isCurrentMonth = i === currentMonth;
          return (
            <div
              key={month}
              className={`
                rounded-xl p-3 border-2
                ${isCurrentMonth ? "border-primary ring-2 ring-primary/20" : "border-transparent"}
                ${MONTH_COLORS[i]}
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-gray-800">{month}</span>
                {isCurrentMonth && (
                  <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full font-medium">
                    NOW
                  </span>
                )}
              </div>
              {tasks.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Rest & plan</p>
              ) : (
                <ul className="space-y-1">
                  {tasks.map((task, j) => (
                    <li key={j} className="text-xs text-gray-600 flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      {task}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
