"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { GardenDesign, PlantCell, PathCell } from "@/types/garden";

function isPathCell(cell: PlantCell | PathCell | null): cell is PathCell {
  return cell !== null && "isPath" in cell;
}
function isPlantCell(cell: PlantCell | PathCell | null): cell is PlantCell {
  return cell !== null && "plantId" in cell;
}

const CELL_SIZE = 60;
const PADDING = 40;

interface GardenCanvasProps {
  design: GardenDesign;
  widthFt: number;
  lengthFt: number;
  orientation: string;
  onCapture?: (svgString: string) => void;
}

interface TooltipState {
  cell: PlantCell;
  x: number;
  y: number;
}

export function GardenCanvas({ design, widthFt, lengthFt, orientation, onCapture }: GardenCanvasProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const gridCols = Math.floor(widthFt / 2);
  const gridRows = Math.floor(lengthFt / 2);

  const svgWidth = gridCols * CELL_SIZE + PADDING * 2;
  const svgHeight = gridRows * CELL_SIZE + PADDING * 2;

  const handleMouseEnter = useCallback((cell: PlantCell, col: number, row: number) => {
    const x = PADDING + col * CELL_SIZE + CELL_SIZE / 2;
    const y = PADDING + row * CELL_SIZE;
    setTooltip({ cell, x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <div className="relative rounded-2xl border-2 border-sage/30 bg-white shadow-inner">
      {/* Compass rose — outside the grid, anchored to top-right corner of the card */}
      <div className="absolute -top-7 right-2">
        <CompassRose orientation={orientation} />
      </div>
      <svg
        width="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="block"
        id="garden-canvas-svg"
      >
        {/* Background */}
        <rect width={svgWidth} height={svgHeight} fill="#f8fdf8" />

        {/* Path cells + zone color fills */}
        {design.grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const x = PADDING + colIdx * CELL_SIZE;
            const y = PADDING + rowIdx * CELL_SIZE;
            if (isPathCell(cell)) {
              const pathColor =
                cell.pathStyle === "straight" ? "#c8a96e" :
                cell.pathStyle === "curved"   ? "#b89a60" :
                                                "#a08878"; // stepping-stones
              return (
                <g key={`path-${rowIdx}-${colIdx}`}>
                  <rect x={x} y={y} width={CELL_SIZE} height={CELL_SIZE}
                    fill={pathColor} fillOpacity={0.55} />
                  {/* subtle dotted texture */}
                  <circle cx={x + CELL_SIZE / 2} cy={y + CELL_SIZE / 2}
                    r={cell.pathStyle === "stepping-stones" ? 18 : 4}
                    fill={pathColor} fillOpacity={cell.pathStyle === "stepping-stones" ? 0.4 : 0.3} />
                </g>
              );
            }
            if (isPlantCell(cell)) {
              return (
                <rect key={`zone-${rowIdx}-${colIdx}`}
                  x={x} y={y} width={CELL_SIZE} height={CELL_SIZE}
                  fill={cell.zoneColor} fillOpacity={0.25} />
              );
            }
            return null;
          })
        )}

        {/* Grid lines */}
        {Array.from({ length: gridCols + 1 }, (_, i) => (
          <line
            key={`vl-${i}`}
            x1={PADDING + i * CELL_SIZE}
            y1={PADDING}
            x2={PADDING + i * CELL_SIZE}
            y2={PADDING + gridRows * CELL_SIZE}
            stroke="#cbd5e1"
            strokeWidth={0.5}
          />
        ))}
        {Array.from({ length: gridRows + 1 }, (_, i) => (
          <line
            key={`hl-${i}`}
            x1={PADDING}
            y1={PADDING + i * CELL_SIZE}
            x2={PADDING + gridCols * CELL_SIZE}
            y2={PADDING + i * CELL_SIZE}
            stroke="#cbd5e1"
            strokeWidth={0.5}
          />
        ))}

        {/* Outer border */}
        <rect
          x={PADDING}
          y={PADDING}
          width={gridCols * CELL_SIZE}
          height={gridRows * CELL_SIZE}
          fill="none"
          stroke="#2d6a4f"
          strokeWidth={2}
          rx={4}
        />

        {/* Plant emojis (skip path cells) */}
        {design.grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            if (!isPlantCell(cell)) return null;
            const cx = PADDING + colIdx * CELL_SIZE + CELL_SIZE / 2;
            const cy = PADDING + rowIdx * CELL_SIZE + CELL_SIZE / 2;

            return (
              <g key={`plant-${rowIdx}-${colIdx}`}>
                {/* Zone color dot */}
                <circle cx={cx} cy={cy} r={CELL_SIZE / 2 - 4}
                  fill={cell.zoneColor} fillOpacity={0.15}
                  stroke={cell.zoneColor} strokeWidth={1} strokeOpacity={0.4}
                />
                {/* Plant emoji */}
                <text x={cx} y={cy + 8} textAnchor="middle"
                  fontSize={CELL_SIZE * 0.5} className="select-none"
                  style={{ userSelect: "none" }}
                >
                  {cell.emoji}
                </text>
                {/* Invisible hit area for hover */}
                <rect
                  x={PADDING + colIdx * CELL_SIZE} y={PADDING + rowIdx * CELL_SIZE}
                  width={CELL_SIZE} height={CELL_SIZE}
                  fill="transparent"
                  onMouseEnter={() => handleMouseEnter(cell, colIdx, rowIdx)}
                  onMouseLeave={handleMouseLeave}
                  className="cursor-pointer"
                />
              </g>
            );
          })
        )}

        {/* Axis labels */}
        <text x={PADDING - 8} y={PADDING + gridRows * CELL_SIZE / 2} textAnchor="middle"
          fontSize={10} fill="#64748b" transform={`rotate(-90, ${PADDING - 20}, ${PADDING + gridRows * CELL_SIZE / 2})`}>
          {lengthFt} ft
        </text>
        <text x={PADDING + gridCols * CELL_SIZE / 2} y={PADDING + gridRows * CELL_SIZE + 20}
          textAnchor="middle" fontSize={10} fill="#64748b">
          {widthFt} ft
        </text>

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect
              x={Math.min(tooltip.x - 60, svgWidth - 140)}
              y={Math.max(tooltip.y - 65, 8)}
              width={130}
              height={55}
              rx={8}
              fill="white"
              stroke="#2d6a4f"
              strokeWidth={1.5}
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
            />
            <text
              x={Math.min(tooltip.x - 60, svgWidth - 140) + 10}
              y={Math.max(tooltip.y - 65, 8) + 18}
              fontSize={13}
              fontWeight="600"
              fill="#1a3d2e"
            >
              {tooltip.cell.emoji} {tooltip.cell.plantName}
            </text>
            {tooltip.cell.note && (
              <text
                x={Math.min(tooltip.x - 60, svgWidth - 140) + 10}
                y={Math.max(tooltip.y - 65, 8) + 36}
                fontSize={10}
                fill="#64748b"
              >
                {tooltip.cell.note.substring(0, 25)}
              </text>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}

function CompassRose({ orientation }: { orientation: string }) {
  const [label, setLabel] = useState<string | null>(null);
  const rotation = orientation === "south" ? 0 : orientation === "west" ? 90 :
    orientation === "north" ? 180 : 270;

  return (
    <div className="relative">
      <svg width={54} height={54} viewBox="-27 -27 54 54">
        {/* Compass ring */}
        <circle r={22} fill="white" stroke="#94a3b8" strokeWidth={1.5} />
        {/* Small dot markers at cardinal points on the ring (fixed, don't rotate) */}
        {[0, 90, 180, 270].map((a) => (
          <circle
            key={a}
            cx={Math.round(21 * Math.sin((a * Math.PI) / 180))}
            cy={Math.round(-21 * Math.cos((a * Math.PI) / 180))}
            r={1.5}
            fill="#94a3b8"
          />
        ))}
        <g transform={`rotate(${rotation})`}>
          {/* North half — long green diamond */}
          <path d="M0,-21 L6,0 L0,0 L-6,0 Z" fill="#2d6a4f" />
          {/* South half — short grey diamond */}
          <path d="M0,13 L5,0 L0,0 L-5,0 Z" fill="#cbd5e1" />
          {/* Centre pin */}
          <circle r={3} fill="white" stroke="#64748b" strokeWidth={1} />
          {/* Invisible hit areas — rotate with needle so hover always matches the right half */}
          <rect x={-8} y={-22} width={16} height={22} fill="transparent" className="cursor-help"
            onMouseEnter={() => setLabel("North")} onMouseLeave={() => setLabel(null)} />
          <rect x={-7} y={0} width={14} height={14} fill="transparent" className="cursor-help"
            onMouseEnter={() => setLabel("South")} onMouseLeave={() => setLabel(null)} />
        </g>
      </svg>
      {label && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-0.5 text-xs font-semibold bg-white border border-gray-200 rounded shadow text-primary whitespace-nowrap pointer-events-none z-10">
          {label}
        </div>
      )}
    </div>
  );
}
