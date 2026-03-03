"use client";

import { useEffect, useRef, useState } from "react";
import { GardenCanvas } from "@/components/garden/GardenCanvas";
import { GardenLegend } from "@/components/garden/GardenLegend";
import type { GardenDesign } from "@/types/garden";

interface GardenLayoutProps {
  design: GardenDesign;
  widthFt: number;
  lengthFt: number;
  orientation: string;
  showYield?: boolean;
}

export function GardenLayout({ design, widthFt, lengthFt, orientation, showYield = true }: GardenLayoutProps) {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [diagramHeight, setDiagramHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = diagramRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setDiagramHeight(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6 items-start">
      <div ref={diagramRef}>
        <GardenCanvas
          design={design}
          widthFt={widthFt}
          lengthFt={lengthFt}
          orientation={orientation}
        />
      </div>
      <div style={{ height: diagramHeight ?? "auto" }} className="card overflow-hidden">
        <div className="h-full overflow-y-auto">
          <GardenLegend design={design} showYield={showYield} />
        </div>
      </div>
    </div>
  );
}
