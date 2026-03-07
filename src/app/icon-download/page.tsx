"use client";

import { useEffect, useRef } from "react";

export default function IconDownloadPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 1024;
    canvas.width = size;
    canvas.height = size;

    // Background: brand green
    ctx.fillStyle = "#2d6a35";
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, 200);
    ctx.fill();

    // Draw 🌱 emoji centered
    ctx.font = "600px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🌱", 512, 530);

  }, []);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "planters-blueprint-icon-1024.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center gap-8 py-16 px-4">
      <h1 className="text-2xl font-serif font-bold text-gray-800">App Icon — 1024 × 1024</h1>

      <canvas
        ref={canvasRef}
        style={{ width: 256, height: 256, borderRadius: 50, boxShadow: "0 12px 48px rgba(0,0,0,0.22)" }}
      />

      <button
        onClick={handleDownload}
        className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm"
      >
        Download PNG (1024 × 1024)
      </button>

      <p className="text-xs text-gray-400">
        Canvas renders at 1024×1024 px — preview above is scaled to 256px for display.
      </p>
    </div>
  );
}
