"use client";

import { useEffect, useRef } from "react";

const SIZES = [1024, 512, 256, 192, 180, 152, 144, 120, 114, 76, 72, 57];

function drawIcon(canvas: HTMLCanvasElement, size: number) {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#2d6a35";
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.195);
  ctx.fill();

  ctx.font = `${Math.round(size * 0.586)}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🌱", size / 2, size * 0.518);
}

function IconCard({ size }: { size: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) drawIcon(canvasRef.current, size);
  }, [size]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `planters-blueprint-icon-${size}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const previewSize = Math.min(size, 120);

  return (
    <div className="flex flex-col items-center gap-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
      <canvas
        ref={canvasRef}
        style={{
          width: previewSize,
          height: previewSize,
          borderRadius: previewSize * 0.195,
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        }}
      />
      <div className="text-sm font-semibold text-gray-700">{size} × {size}</div>
      <button
        onClick={handleDownload}
        className="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
      >
        Download PNG
      </button>
    </div>
  );
}

export default function IconDownloadPage() {
  const handleDownloadAll = async () => {
    for (const size of SIZES) {
      const canvas = document.createElement("canvas");
      drawIcon(canvas, size);
      await new Promise<void>((resolve) => {
        const link = document.createElement("a");
        link.download = `planters-blueprint-icon-${size}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        setTimeout(resolve, 150);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif font-bold text-gray-800">App Icon Downloads</h1>
          <p className="text-sm text-gray-500">All sizes rendered at full resolution from canvas</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleDownloadAll}
            className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm"
          >
            Download All Sizes
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {SIZES.map((size) => (
            <IconCard key={size} size={size} />
          ))}
        </div>

        <p className="text-center text-xs text-gray-400">
          Sizes: {SIZES.join(", ")} px — all rendered at native resolution
        </p>
      </div>
    </div>
  );
}
