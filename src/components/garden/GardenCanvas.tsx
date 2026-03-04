"use client";

import { useState, useCallback } from "react";
import type { GardenDesign, PlantCell, PathCell } from "@/types/garden";

function isPathCell(cell: PlantCell | PathCell | null): cell is PathCell {
  return cell !== null && "isPath" in cell;
}
function isPlantCell(cell: PlantCell | PathCell | null): cell is PlantCell {
  return cell !== null && "plantId" in cell;
}

const CELL_SIZE = 44;
const PADDING = 32;

// Returns the cardinal letter for each side of the diagram given the garden orientation.
// orientation = direction the garden faces (where the sun comes from).
// The compass needle rotation maps:
//   south→N at top, west→N at right, north→N at bottom, east→N at left
const CARDINAL_LABELS: Record<string, { top: string; bottom: string; left: string; right: string }> = {
  south: { top: "N", bottom: "S", left: "W", right: "E" },
  north: { top: "S", bottom: "N", left: "E", right: "W" },
  east:  { top: "E", bottom: "W", left: "N", right: "S" },
  west:  { top: "W", bottom: "E", left: "S", right: "N" },
};

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

  const labels = CARDINAL_LABELS[orientation] ?? CARDINAL_LABELS.south;
  const midX = PADDING + (gridCols * CELL_SIZE) / 2;
  const midY = PADDING + (gridRows * CELL_SIZE) / 2;
  const gridRight = PADDING + gridCols * CELL_SIZE;
  const gridBottom = PADDING + gridRows * CELL_SIZE;

  return (
    <div className="relative rounded-2xl border-2 border-sage/30 bg-white shadow-inner">
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
                    r={cell.pathStyle === "stepping-stones" ? 13 : 3}
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
                <text x={cx} y={cy + 6} textAnchor="middle"
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

        {/* Cardinal direction labels + dimensions around the border */}

        {/* Top — cardinal */}
        <text x={midX} y={PADDING - 8} textAnchor="middle"
          fontSize={10} fontWeight="bold" fill="#2d6a4f">
          {labels.top}
        </text>

        {/* Bottom — cardinal + width dimension */}
        <text x={midX} y={gridBottom + 13} textAnchor="middle"
          fontSize={10} fontWeight="bold" fill="#2d6a4f">
          {labels.bottom}
        </text>
        <text x={midX} y={gridBottom + 24} textAnchor="middle"
          fontSize={8} fill="#64748b">
          {widthFt} ft
        </text>

        {/* Left — length dimension (further left) then cardinal (closer to grid) */}
        <text x={8} y={midY} textAnchor="middle"
          fontSize={8} fill="#64748b"
          transform={`rotate(-90, 8, ${midY})`}>
          {lengthFt} ft
        </text>
        <text x={22} y={midY + 3} textAnchor="middle"
          fontSize={10} fontWeight="bold" fill="#2d6a4f">
          {labels.left}
        </text>

        {/* Right — cardinal only */}
        <text x={gridRight + 13} y={midY + 3} textAnchor="middle"
          fontSize={10} fontWeight="bold" fill="#2d6a4f">
          {labels.right}
        </text>

        {/* Tooltip */}
        {tooltip && (() => {
          const tooltipW = 165;
          const pad = 10;
          const availW = tooltipW - pad * 2;

          // Scale font down for long names rather than clipping
          const nameText = `${tooltip.cell.emoji} ${tooltip.cell.plantName}`;
          const estNameW = nameText.length * 7.5;
          const nameFontSize = estNameW > availW
            ? Math.max(9, Math.floor(13 * availW / estNameW))
            : 13;

          // Wrap note across up to 2 lines (~28 chars each at fontSize 10)
          const noteLines: string[] = [];
          if (tooltip.cell.note) {
            const words = tooltip.cell.note.split(" ");
            let line = "";
            for (const word of words) {
              if ((line + " " + word).trim().length > 28) {
                if (line) noteLines.push(line);
                line = word;
                if (noteLines.length === 1) { noteLines.push(line); break; }
              } else {
                line = (line + " " + word).trim();
              }
            }
            if (noteLines.length === 0 && line) noteLines.push(line);
          }

          const tooltipH = 32 + (noteLines.length > 0 ? noteLines.length * 14 + 4 : 0);
          const rectX = Math.min(Math.max(tooltip.x - tooltipW / 2, 4), svgWidth - tooltipW - 4);
          const rectY = tooltip.y - 8 >= tooltipH + 4
            ? tooltip.y - tooltipH - 4
            : tooltip.y + CELL_SIZE + 4;

          return (
            <g pointerEvents="none">
              <rect x={rectX} y={rectY} width={tooltipW} height={tooltipH} rx={8}
                fill="white" stroke="#2d6a4f" strokeWidth={1.5}
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
              <text x={rectX + pad} y={rectY + 20} fontSize={nameFontSize} fontWeight="600" fill="#1a3d2e">
                {nameText}
              </text>
              {noteLines.map((line, i) => (
                <text key={i} x={rectX + pad} y={rectY + 34 + i * 14} fontSize={10} fill="#64748b">
                  {line}
                </text>
              ))}
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
