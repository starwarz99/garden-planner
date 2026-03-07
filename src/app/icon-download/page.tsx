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

    const cx = 512;
    const cy = 512;

    // ── Background: warm cream-to-white ──────────────────────────────────────
    const bg = ctx.createLinearGradient(0, 0, 0, size);
    bg.addColorStop(0, "#f0faf2");
    bg.addColorStop(1, "#dff2e3");
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, 180);
    ctx.fill();

    // ── Outer ring accent ────────────────────────────────────────────────────
    ctx.strokeStyle = "rgba(74,160,90,0.15)";
    ctx.lineWidth = 36;
    ctx.beginPath();
    ctx.arc(cx, cy, 460, 0, Math.PI * 2);
    ctx.stroke();

    // ── Soil mound ────────────────────────────────────────────────────────────
    // Dark soil base
    const soilGrad = ctx.createRadialGradient(cx, 720, 20, cx, 740, 220);
    soilGrad.addColorStop(0, "#6b4423");
    soilGrad.addColorStop(1, "#3d2210");
    ctx.fillStyle = soilGrad;
    ctx.beginPath();
    ctx.ellipse(cx, 730, 260, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    // Soil highlight
    ctx.fillStyle = "rgba(160,100,50,0.35)";
    ctx.beginPath();
    ctx.ellipse(cx, 700, 180, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Main stem ────────────────────────────────────────────────────────────
    ctx.strokeStyle = "#3a8c48";
    ctx.lineWidth = 32;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(cx, 720);
    ctx.bezierCurveTo(cx, 640, cx - 10, 560, cx, 290);
    ctx.stroke();

    // Stem highlight
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(cx + 6, 700);
    ctx.bezierCurveTo(cx + 6, 620, cx - 4, 540, cx + 6, 300);
    ctx.stroke();

    // ── Large left leaf ──────────────────────────────────────────────────────
    const leftLeafGrad = ctx.createLinearGradient(280, 460, 520, 600);
    leftLeafGrad.addColorStop(0, "#5ec96e");
    leftLeafGrad.addColorStop(1, "#3a9e4a");
    ctx.fillStyle = leftLeafGrad;
    ctx.beginPath();
    ctx.moveTo(cx, 590);
    ctx.bezierCurveTo(480, 520, 360, 480, 280, 390);
    ctx.bezierCurveTo(300, 390, 420, 430, cx, 590);  // return arc
    ctx.closePath();
    ctx.fill();

    // Left leaf center vein
    ctx.strokeStyle = "rgba(255,255,255,0.30)";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx, 586);
    ctx.bezierCurveTo(430, 510, 340, 456, 292, 402);
    ctx.stroke();
    // Left leaf side veins
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(430, 530); ctx.lineTo(385, 510); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(370, 490); ctx.lineTo(330, 472); ctx.stroke();

    // ── Large right leaf ─────────────────────────────────────────────────────
    const rightLeafGrad = ctx.createLinearGradient(520, 420, 760, 540);
    rightLeafGrad.addColorStop(0, "#4ab558");
    rightLeafGrad.addColorStop(1, "#2e8a3c");
    ctx.fillStyle = rightLeafGrad;
    ctx.beginPath();
    ctx.moveTo(cx, 500);
    ctx.bezierCurveTo(560, 440, 680, 400, 760, 310);
    ctx.bezierCurveTo(730, 330, 600, 390, cx, 500);
    ctx.closePath();
    ctx.fill();

    // Right leaf center vein
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx, 496);
    ctx.bezierCurveTo(580, 438, 690, 388, 748, 320);
    ctx.stroke();
    // Right leaf side veins
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(600, 448); ctx.lineTo(640, 432); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(660, 408); ctx.lineTo(700, 390); ctx.stroke();

    // ── Small upper-left sprout leaf ─────────────────────────────────────────
    ctx.fillStyle = "#82d98f";
    ctx.beginPath();
    ctx.moveTo(cx, 420);
    ctx.bezierCurveTo(466, 384, 400, 354, 372, 310);
    ctx.bezierCurveTo(390, 316, 448, 362, cx, 420);
    ctx.closePath();
    ctx.fill();

    // ── Top bud ───────────────────────────────────────────────────────────────
    // Outer bud
    const budGrad = ctx.createRadialGradient(cx, 268, 8, cx, 280, 68);
    budGrad.addColorStop(0, "#c8f0ce");
    budGrad.addColorStop(1, "#6dd97d");
    ctx.fillStyle = budGrad;
    ctx.beginPath();
    ctx.ellipse(cx, 278, 46, 76, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner bud depth
    ctx.fillStyle = "#3da84a";
    ctx.beginPath();
    ctx.ellipse(cx, 296, 22, 46, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bud highlight
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.beginPath();
    ctx.ellipse(cx - 10, 258, 10, 22, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // ── Small dew drops ───────────────────────────────────────────────────────
    const drops = [
      { x: 360, y: 450, r: 10 },
      { x: 660, y: 370, r: 8 },
      { x: 418, y: 350, r: 6 },
    ];
    for (const d of drops) {
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }

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
        style={{ width: 256, height: 256, borderRadius: 46, boxShadow: "0 12px 48px rgba(0,0,0,0.22)" }}
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
