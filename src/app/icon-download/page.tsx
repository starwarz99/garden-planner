"use client";

import { useEffect, useRef } from "react";

// ─── Icon ─────────────────────────────────────────────────────────────────────

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

// ─── Facebook Banner ───────────────────────────────────────────────────────────

const BW = 1640;
const BH = 624;

function drawBanner(canvas: HTMLCanvasElement) {
  canvas.width = BW;
  canvas.height = BH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background: radial gradient — bright centre, dark edges
  const bg = ctx.createRadialGradient(BW / 2, BH / 2, 80, BW / 2, BH / 2, 900);
  bg.addColorStop(0, "#3e8a48");
  bg.addColorStop(0.55, "#2d6a35");
  bg.addColorStop(1, "#1b4220");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, BW, BH);

  // Scattered decorative emojis (very faint texture)
  const deco = ["🍅", "🥦", "🌻", "🥕", "🌿", "🧅", "🌸", "🥬", "🫑", "🥒", "🌾", "🪴"];
  const spots = [
    [60, 55, 15], [1580, 60, -20], [120, 560, 25], [1510, 540, -15],
    [340, 40, 40], [1300, 580, -40], [820, 20, 10], [820, 604, -10],
    [500, 580, 30], [1140, 40, -30], [200, 310, 60], [1440, 310, -60],
  ];
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.font = "72px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  spots.forEach(([x, y, deg], i) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(deco[i % deco.length], 0, 0);
    ctx.restore();
  });
  ctx.restore();

  // Subtle horizontal vignette strips (top + bottom dark fade)
  const topFade = ctx.createLinearGradient(0, 0, 0, 120);
  topFade.addColorStop(0, "rgba(0,0,0,0.30)");
  topFade.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = topFade;
  ctx.fillRect(0, 0, BW, 120);

  const btmFade = ctx.createLinearGradient(0, BH - 120, 0, BH);
  btmFade.addColorStop(0, "rgba(0,0,0,0)");
  btmFade.addColorStop(1, "rgba(0,0,0,0.30)");
  ctx.fillStyle = btmFade;
  ctx.fillRect(0, BH - 120, BW, 120);

  // ── Content (centred) ──────────────────────────────────────────────────────
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";

  // Large seedling emoji
  ctx.font = "220px serif";
  ctx.fillText("🌱", BW / 2, 185);

  // Thin divider line
  const lineW = 480;
  ctx.strokeStyle = "rgba(255,255,255,0.30)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(BW / 2 - lineW / 2, 302);
  ctx.lineTo(BW / 2 + lineW / 2, 302);
  ctx.stroke();

  // Brand name
  ctx.font = "bold 92px Georgia, serif";
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 18;
  ctx.fillText("Planters Blueprint", BW / 2, 370);
  ctx.shadowBlur = 0;

  // Tagline
  ctx.globalAlpha = 0.85;
  ctx.font = "38px Arial, sans-serif";
  ctx.fillText("AI-Powered Garden Planner  ·  Companion Planting  ·  Zone-Aware Layouts", BW / 2, 448);
  ctx.globalAlpha = 1;

  // URL
  ctx.globalAlpha = 0.55;
  ctx.font = "26px Arial, sans-serif";
  ctx.fillText("plantersblueprint.com", BW / 2, 512);
  ctx.globalAlpha = 1;
}

function BannerSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) drawBanner(canvasRef.current);
  }, []);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "planters-blueprint-facebook-cover.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Canvas preview — scaled to fit container */}
      <div className="w-full overflow-hidden rounded-2xl shadow-lg border border-gray-200">
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-gray-400">
          1640 × 624 px @ 2× — Facebook recommends 820 × 312 dp minimum
        </p>
        <button
          onClick={handleDownload}
          className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm"
        >
          Download PNG (1640 × 624)
        </button>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

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
      <div className="max-w-5xl mx-auto space-y-14">

        {/* Facebook Cover Banner */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-800">Facebook Cover Photo</h1>
            <p className="text-sm text-gray-500 mt-1">Rendered at 1640 × 624 px (2× for retina displays)</p>
          </div>
          <BannerSection />
        </div>

        {/* Divider */}
        <hr className="border-gray-300" />

        {/* App Icons */}
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-800">App Icons</h2>
              <p className="text-sm text-gray-500 mt-1">All sizes rendered at full resolution from canvas</p>
            </div>
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
    </div>
  );
}
