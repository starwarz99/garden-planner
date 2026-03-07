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

    // ── Background: deep garden green circle ──────────────────────────────────
    const bg = ctx.createRadialGradient(512, 460, 80, 512, 512, 560);
    bg.addColorStop(0, "#2d7a3a");
    bg.addColorStop(1, "#1a4d24");
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, 160);
    ctx.fill();

    // ── Subtle texture ring ───────────────────────────────────────────────────
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 40;
    ctx.beginPath();
    ctx.arc(512, 512, 420, 0, Math.PI * 2);
    ctx.stroke();

    // ── Stem ──────────────────────────────────────────────────────────────────
    ctx.strokeStyle = "#a3e8b0";
    ctx.lineWidth = 28;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(512, 750);
    ctx.bezierCurveTo(512, 680, 512, 600, 512, 440);
    ctx.stroke();

    // ── Left leaf ─────────────────────────────────────────────────────────────
    ctx.fillStyle = "#6dd97d";
    ctx.beginPath();
    ctx.moveTo(512, 560);
    ctx.bezierCurveTo(430, 500, 320, 510, 310, 430);
    ctx.bezierCurveTo(350, 430, 460, 470, 512, 560);
    ctx.closePath();
    ctx.fill();

    // Left leaf vein
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(512, 556);
    ctx.bezierCurveTo(460, 510, 370, 478, 320, 440);
    ctx.stroke();

    // ── Right leaf ────────────────────────────────────────────────────────────
    ctx.fillStyle = "#52c762";
    ctx.beginPath();
    ctx.moveTo(512, 480);
    ctx.bezierCurveTo(590, 420, 710, 420, 720, 340);
    ctx.bezierCurveTo(680, 350, 560, 400, 512, 480);
    ctx.closePath();
    ctx.fill();

    // Right leaf vein
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(512, 476);
    ctx.bezierCurveTo(565, 430, 648, 392, 706, 352);
    ctx.stroke();

    // ── Top bud ───────────────────────────────────────────────────────────────
    ctx.fillStyle = "#a3e8b0";
    ctx.beginPath();
    ctx.ellipse(512, 390, 38, 58, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#6dd97d";
    ctx.beginPath();
    ctx.ellipse(512, 390, 22, 44, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Soil / pot base ───────────────────────────────────────────────────────
    ctx.fillStyle = "#7a4f2e";
    ctx.beginPath();
    ctx.roundRect(400, 740, 224, 36, 8);
    ctx.fill();

    ctx.fillStyle = "#5c3820";
    ctx.beginPath();
    ctx.roundRect(420, 772, 184, 28, [0, 0, 10, 10]);
    ctx.fill();

    // ── Soil top with small soil dots ────────────────────────────────────────
    ctx.fillStyle = "#8B6340";
    ctx.beginPath();
    ctx.roundRect(408, 730, 208, 14, 4);
    ctx.fill();

    // ── "PB" wordmark ────────────────────────────────────────────────────────
    ctx.fillStyle = "rgba(255,255,255,0.90)";
    ctx.font = "bold 72px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Planters", 512, 860);

    ctx.font = "bold 44px Georgia, serif";
    ctx.fillStyle = "rgba(163,232,176,0.85)";
    ctx.fillText("Blueprint", 512, 922);

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-8 py-16 px-4">
      <h1 className="text-2xl font-serif font-bold text-gray-800">App Icon — 1024 × 1024</h1>

      <canvas
        ref={canvasRef}
        style={{ width: 256, height: 256, borderRadius: 40, boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }}
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
