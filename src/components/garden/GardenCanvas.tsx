"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { GardenDesign, PlantCell } from "@/types/garden";

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
    <div className="relative overflow-auto rounded-2xl border-2 border-sage/30 bg-white shadow-inner">
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="block"
        id="garden-canvas-svg"
      >
        {/* Background */}
        <rect width={svgWidth} height={svgHeight} fill="#f8fdf8" />

        {/* Zone color fills */}
        {design.grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            if (!cell) return null;
            return (
              <rect
                key={`zone-${rowIdx}-${colIdx}`}
                x={PADDING + colIdx * CELL_SIZE}
                y={PADDING + rowIdx * CELL_SIZE}
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill={cell.zoneColor}
                fillOpacity={0.25}
              />
            );
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

        {/* Plant emojis */}
        {design.grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            if (!cell) return null;
            const cx = PADDING + colIdx * CELL_SIZE + CELL_SIZE / 2;
            const cy = PADDING + rowIdx * CELL_SIZE + CELL_SIZE / 2;

            return (
              <g key={`plant-${rowIdx}-${colIdx}`}>
                {/* Zone color dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={CELL_SIZE / 2 - 4}
                  fill={cell.zoneColor}
                  fillOpacity={0.15}
                  stroke={cell.zoneColor}
                  strokeWidth={1}
                  strokeOpacity={0.4}
                />
                {/* Plant emoji */}
                <text
                  x={cx}
                  y={cy + 8}
                  textAnchor="middle"
                  fontSize={CELL_SIZE * 0.5}
                  className="select-none"
                  style={{ userSelect: "none" }}
                >
                  {cell.emoji}
                </text>
                {/* Invisible hit area for hover */}
                <rect
                  x={PADDING + colIdx * CELL_SIZE}
                  y={PADDING + rowIdx * CELL_SIZE}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
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

        {/* Compass rose in top-right */}
        <CompassRoseSVG
          x={svgWidth - PADDING - 30}
          y={PADDING + 30}
          orientation={orientation}
        />

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

function CompassRoseSVG({ x, y, orientation }: { x: number; y: number; orientation: string }) {
  const rotation = orientation === "north" ? 0 : orientation === "east" ? 90 :
    orientation === "south" ? 180 : 270;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={22} fill="white" stroke="#cbd5e1" strokeWidth={1} />
      <g transform={`rotate(${rotation})`}>
        <path d="M0,-18 L4,0 L0,6 L-4,0 Z" fill="#2d6a4f" />
        <path d="M0,18 L4,0 L0,-6 L-4,0 Z" fill="#94a3b8" />
      </g>
      <text y={-5} textAnchor="middle" fontSize={8} fontWeight="bold" fill="#1e293b">N</text>
    </g>
  );
}
