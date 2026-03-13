"use client";

import { useEffect, useRef, useState } from "react";

// ── Ad Copy ───────────────────────────────────────────────────────────────────

const COPY_SECTIONS = [
  {
    label: "Top of Funnel — Awareness",
    items: [
      {
        label: "Primary Text 1 (Story / Curiosity)",
        text: `I used to guess which vegetables to plant next to each other.\n\nThen I tried AI.\n\nNow my garden actually produces. 🌱\n\nPlanters Blueprint uses AI to design a companion-planted garden layout — sized for your space, your growing zone, and your experience level.\n\nFree to start. No credit card required.\n\n👉 plantersblueprint.com`,
      },
      {
        label: "Primary Text 2 (Benefit-led)",
        text: `Your backyard has more potential than you think.\n\nPlanters Blueprint uses AI to:\n✓ Match plants that grow better together\n✓ Fit your exact garden dimensions\n✓ Account for your USDA growing zone\n✓ Generate a full care calendar\n\nDesign your personalized garden plan — free.\n\n🌱 plantersblueprint.com`,
      },
      {
        label: "Primary Text 3 (Pain-point hook)",
        text: `Stop planting tomatoes next to the wrong neighbors.\n\nCompanion planting can dramatically increase your yields — but most gardeners are just guessing.\n\nPlanters Blueprint uses AI to design a scientifically-informed garden layout tailored to YOUR space, plants, and growing zone.\n\nFree plan available. No credit card. 🌿\n\n👉 plantersblueprint.com`,
      },
      {
        label: "Headline",
        text: "Plan Your Dream Garden in 2 Minutes",
      },
      {
        label: "Description",
        text: "AI-powered layout + companion planting. Free to start.",
      },
    ],
  },
  {
    label: "Middle of Funnel — Consideration (Carousel)",
    items: [
      {
        label: "Primary Text",
        text: `Here's exactly how Planters Blueprint works:\n\n① Tell us your garden size and growing zone\n② Pick the vegetables, herbs, and flowers you want to grow\n③ Our AI designs a companion-planted layout optimized for your space\n④ Download your plan and start planting\n\nNo gardening degree required. Free plan available.\n\n🌱 plantersblueprint.com`,
      },
      {
        label: "Carousel Slide 1 Headline",
        text: "Step 1: Pick Your Plants",
      },
      {
        label: "Carousel Slide 2 Headline",
        text: "Step 2: AI Designs Your Layout",
      },
      {
        label: "Carousel Slide 3 Headline",
        text: "Step 3: Companion Planting, Done for You",
      },
      {
        label: "CTA Button",
        text: "Try It Free",
      },
    ],
  },
  {
    label: "Bottom of Funnel — Conversion (Retargeting)",
    items: [
      {
        label: "Primary Text 1 (Site Visitors)",
        text: `You checked out Planters Blueprint. 👀\n\nJust so you know — the free Seedling plan includes:\n✓ AI-generated garden layout\n✓ Companion planting recommendations\n✓ Zone-aware plant suggestions\n✓ No credit card required\n\nSpring doesn't wait. Start your free garden plan today.\n\n🌱 plantersblueprint.com`,
      },
      {
        label: "Primary Text 2 (Pricing Page Visitors)",
        text: `Still on the fence? Here's the deal:\n\nThe Seedling plan is completely free. Always.\n\nWhen you're ready to unlock unlimited gardens, the Grower plan is just $4/month.\n\nMost gardeners see their first plan in under 3 minutes.\n\nGive it a try — your seeds are waiting. 🌿\n\n👉 plantersblueprint.com`,
      },
      {
        label: "Headline",
        text: "Your Garden Plan Is Waiting",
      },
      {
        label: "Description",
        text: "Free plan · No credit card · Ready in minutes.",
      },
    ],
  },
];

// ── Canvas helpers ────────────────────────────────────────────────────────────

const C = {
  green:  "#2d6a35",
  greenL: "#3e8a48",
  greenD: "#1b4220",
  cream:  "#faf9f5",
  white:  "#ffffff",
  gray:   "#6b7280",
};

function rr(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number, fill: string
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

const PLANTS: { emoji: string; bg: string }[][] = [
  [
    { emoji: "🍅", bg: "#fee2e2" },
    { emoji: "🥕", bg: "#ffedd5" },
    { emoji: "🥬", bg: "#dcfce7" },
    { emoji: "🌿", bg: "#bbf7d0" },
  ],
  [
    { emoji: "🧅", bg: "#fef9c3" },
    { emoji: "🥒", bg: "#d1fae5" },
    { emoji: "🌻", bg: "#fef3c7" },
    { emoji: "🥬", bg: "#dcfce7" },
  ],
  [
    { emoji: "🌿", bg: "#bbf7d0" },
    { emoji: "🍅", bg: "#fee2e2" },
    { emoji: "🥕", bg: "#ffedd5" },
    { emoji: "🧅", bg: "#fef9c3" },
  ],
  [
    { emoji: "🥒", bg: "#d1fae5" },
    { emoji: "🌻", bg: "#fef3c7" },
    { emoji: "🥬", bg: "#dcfce7" },
    { emoji: "🍅", bg: "#fee2e2" },
  ],
];

function drawGardenGrid(
  ctx: CanvasRenderingContext2D,
  ox: number, oy: number,
  cellSize: number, gap: number, emojiSize: number
) {
  for (let row = 0; row < PLANTS.length; row++) {
    for (let col = 0; col < PLANTS[row].length; col++) {
      const x = ox + col * (cellSize + gap);
      const y = oy + row * (cellSize + gap);
      const plant = PLANTS[row][col];
      rr(ctx, x, y, cellSize, cellSize, 10, plant.bg);
      ctx.font = `${emojiSize}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(plant.emoji, x + cellSize / 2, y + cellSize / 2);
    }
  }
}

// ── Feed Ad 1200×628 ─────────────────────────────────────────────────────────

function drawFeedAd(canvas: HTMLCanvasElement) {
  const W = 1200, H = 628;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Left panel gradient
  const lg = ctx.createLinearGradient(0, 0, 480, H);
  lg.addColorStop(0, C.greenL);
  lg.addColorStop(1, C.greenD);
  ctx.fillStyle = lg;
  ctx.fillRect(0, 0, 480, H);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Seedling
  ctx.font = "90px serif";
  ctx.fillText("🌱", 240, 150);

  // Brand
  ctx.fillStyle = C.white;
  ctx.font = "bold 44px Georgia, serif";
  ctx.shadowColor = "rgba(0,0,0,0.2)"; ctx.shadowBlur = 8;
  ctx.fillText("Planters Blueprint", 240, 260);
  ctx.shadowBlur = 0;

  // Tagline
  ctx.globalAlpha = 0.75;
  ctx.font = "20px Arial, sans-serif";
  ctx.fillText("AI-Powered Garden Planner", 240, 302);
  ctx.globalAlpha = 1;

  // Divider
  ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(80, 330); ctx.lineTo(400, 330); ctx.stroke();

  // Features
  ctx.textAlign = "left";
  ctx.font = "19px Arial, sans-serif";
  const features = ["✓  Companion Planting", "✓  Zone-Aware Layouts", "✓  Free to Start"];
  features.forEach((f, i) => {
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = C.white;
    ctx.fillText(f, 100, 368 + i * 38);
  });
  ctx.globalAlpha = 1;

  // URL
  ctx.textAlign = "center";
  ctx.globalAlpha = 0.5;
  ctx.font = "15px Arial, sans-serif";
  ctx.fillStyle = C.white;
  ctx.fillText("plantersblueprint.com", 240, H - 28);
  ctx.globalAlpha = 1;

  // Right panel
  ctx.fillStyle = C.cream;
  ctx.fillRect(480, 0, W - 480, H);

  // Right panel label
  ctx.fillStyle = C.gray;
  ctx.font = "16px Arial, sans-serif";
  ctx.fillText("Your personalized garden plan", 840, 40);

  // Garden grid (4×4, cell=110, gap=10)
  const cellSize = 110, gap = 10;
  const gridW = 4 * cellSize + 3 * gap;
  const gridH = 4 * cellSize + 3 * gap;
  const gx = 840 - gridW / 2;
  const gy = (H - gridH) / 2 - 10;

  ctx.shadowColor = "rgba(0,0,0,0.08)"; ctx.shadowBlur = 20;
  rr(ctx, gx - 12, gy - 12, gridW + 24, gridH + 24, 16, C.white);
  ctx.shadowBlur = 0;

  drawGardenGrid(ctx, gx, gy, cellSize, gap, 52);

  // Caption
  ctx.fillStyle = C.gray;
  ctx.font = "14px Arial, sans-serif";
  ctx.fillText("Generated in seconds · Companion-planted · Zone-aware", 840, gy + gridH + 30);

  // Panel divider
  ctx.strokeStyle = "rgba(0,0,0,0.06)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(480, 0); ctx.lineTo(480, H); ctx.stroke();
}

// ── Square Ad 1080×1080 ───────────────────────────────────────────────────────

function drawSquareAd(canvas: HTMLCanvasElement) {
  const S = 1080;
  canvas.width = S; canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createRadialGradient(S/2, S/2, 80, S/2, S/2, 700);
  bg.addColorStop(0, C.greenL);
  bg.addColorStop(1, C.greenD);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  ctx.textAlign = "center"; ctx.textBaseline = "middle";

  // Brand label
  ctx.fillStyle = C.white;
  ctx.globalAlpha = 0.55;
  ctx.font = "22px Arial, sans-serif";
  ctx.fillText("PLANTERS BLUEPRINT", S/2, 62);
  ctx.globalAlpha = 1;

  // Seedling
  ctx.font = "120px serif";
  ctx.fillText("🌱", S/2, 200);

  // Headline
  ctx.fillStyle = C.white;
  ctx.font = "bold 72px Georgia, serif";
  ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 16;
  ctx.fillText("Plan Your Garden", S/2, 334);
  ctx.fillText("With AI", S/2, 418);
  ctx.shadowBlur = 0;

  // Sub
  ctx.globalAlpha = 0.8;
  ctx.font = "30px Arial, sans-serif";
  ctx.fillText("Companion planting · Zone-aware · Free", S/2, 488);
  ctx.globalAlpha = 1;

  // Grid card
  const cellSize = 90, gap = 8;
  const gridW = 4 * cellSize + 3 * gap;
  const gx = S/2 - gridW/2;
  const gy = 540;

  ctx.shadowColor = "rgba(0,0,0,0.15)"; ctx.shadowBlur = 24;
  rr(ctx, gx - 16, gy - 16, gridW + 32, 4 * cellSize + 3 * gap + 32, 20, "rgba(255,255,255,0.14)");
  ctx.shadowBlur = 0;

  drawGardenGrid(ctx, gx, gy, cellSize, gap, 44);

  // CTA pill
  ctx.shadowColor = "rgba(0,0,0,0.2)"; ctx.shadowBlur = 16;
  rr(ctx, S/2 - 180, 962, 360, 70, 35, C.white);
  ctx.shadowBlur = 0;
  ctx.fillStyle = C.green;
  ctx.font = "bold 28px Arial, sans-serif";
  ctx.fillText("Try It Free →", S/2, 997);
}

// ── Carousel Slide 1: Pick Your Plants ───────────────────────────────────────

function drawCarousel1(canvas: HTMLCanvasElement) {
  const S = 1080;
  canvas.width = S; canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = C.cream;
  ctx.fillRect(0, 0, S, S);

  // Top bar
  const topH = 310;
  const tg = ctx.createLinearGradient(0, 0, 0, topH);
  tg.addColorStop(0, C.greenL);
  tg.addColorStop(1, C.green);
  ctx.fillStyle = tg;
  ctx.fillRect(0, 0, S, topH);

  ctx.textAlign = "center"; ctx.textBaseline = "middle";

  // Ghost number
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.font = "bold 200px Georgia, serif";
  ctx.fillText("01", S/2, topH/2);

  // Solid number
  ctx.fillStyle = C.white;
  ctx.font = "bold 56px Georgia, serif";
  ctx.fillText("01", S/2, topH/2);

  // Title
  ctx.fillStyle = C.green;
  ctx.font = "bold 58px Georgia, serif";
  ctx.fillText("Pick Your Plants", S/2, topH + 76);

  // Plant grid (2 rows × 6)
  const plants2 = ["🍅","🥕","🥬","🌿","🧅","🥒","🌻","🫑","🌾","🪴","🌸","🥦"];
  const cols = 6, sz = 108, gp = 14;
  const rowW = cols * sz + (cols - 1) * gp;
  const ox2 = S/2 - rowW/2;
  const oy2 = topH + 156;

  for (let i = 0; i < 12; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = ox2 + col * (sz + gp);
    const y = oy2 + row * (sz + gp);
    ctx.shadowColor = "rgba(0,0,0,0.06)"; ctx.shadowBlur = 8;
    rr(ctx, x, y, sz, sz, 16, C.white);
    ctx.shadowBlur = 0;
    ctx.font = "60px serif";
    ctx.fillText(plants2[i], x + sz/2, y + sz/2);
  }

  // Selected border + badge on first 3
  ctx.strokeStyle = C.green; ctx.lineWidth = 4;
  for (let i = 0; i < 3; i++) {
    const x = ox2 + i * (sz + gp);
    ctx.beginPath(); ctx.roundRect(x, oy2, sz, sz, 16); ctx.stroke();
    rr(ctx, x + sz - 28, oy2 + 4, 24, 24, 12, C.green);
    ctx.fillStyle = C.white;
    ctx.font = "bold 14px Arial";
    ctx.fillText("✓", x + sz - 16, oy2 + 16);
  }

  // Subtext
  ctx.fillStyle = C.gray;
  ctx.font = "25px Arial, sans-serif";
  ctx.fillText("Choose from 50+ vegetables, herbs & flowers", S/2, oy2 + 2*(sz+gp) + 64);

  // Step dots
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(S/2 + (i-1)*28, S - 50, i === 0 ? 12 : 8, 0, Math.PI*2);
    ctx.fillStyle = i === 0 ? C.green : "#d1d5db";
    ctx.fill();
  }
}

// ── Carousel Slide 2: AI Builds Your Layout ───────────────────────────────────

function drawCarousel2(canvas: HTMLCanvasElement) {
  const S = 1080;
  canvas.width = S; canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createRadialGradient(S/2, S/2, 50, S/2, S/2, 700);
  bg.addColorStop(0, "#1e3a22");
  bg.addColorStop(1, "#0d1f10");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  ctx.textAlign = "center"; ctx.textBaseline = "middle";

  // Ghost number
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.font = "bold 320px Georgia, serif";
  ctx.fillText("02", S/2, S/2);

  // Title
  ctx.fillStyle = C.white;
  ctx.font = "bold 60px Georgia, serif";
  ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 20;
  ctx.fillText("AI Builds Your Layout", S/2, 138);
  ctx.shadowBlur = 0;

  // Grid (4×4, larger)
  const cellSize = 112, gap = 12;
  const gridW = 4 * cellSize + 3 * gap;
  const gridH = 4 * cellSize + 3 * gap;
  const gx = S/2 - gridW/2;
  const gy = S/2 - gridH/2 + 20;

  ctx.shadowColor = C.greenL; ctx.shadowBlur = 50;
  rr(ctx, gx - 10, gy - 10, gridW + 20, gridH + 20, 22, "rgba(45,106,53,0.3)");
  ctx.shadowBlur = 0;

  drawGardenGrid(ctx, gx, gy, cellSize, gap, 58);

  // Generating badge
  rr(ctx, S/2 - 170, gy - 58, 340, 44, 22, "rgba(45,106,53,0.85)");
  ctx.fillStyle = C.white;
  ctx.font = "bold 20px Arial, sans-serif";
  ctx.fillText("✨  Generating your plan…", S/2, gy - 36);

  // Companion badge below grid
  ctx.globalAlpha = 0.9;
  rr(ctx, gx - 20, gy + gridH + 18, gridW + 40, 52, 26, C.greenL);
  ctx.fillStyle = C.white;
  ctx.font = "bold 21px Arial, sans-serif";
  ctx.fillText("🌿  Companion planting optimized automatically", S/2, gy + gridH + 44);
  ctx.globalAlpha = 1;

  // Footer
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "21px Arial, sans-serif";
  ctx.fillText("Powered by Claude AI · Results in seconds", S/2, S - 94);

  // Step dots
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(S/2 + (i-1)*28, S - 50, i === 1 ? 12 : 8, 0, Math.PI*2);
    ctx.fillStyle = i === 1 ? C.greenL : "rgba(255,255,255,0.2)";
    ctx.fill();
  }
}

// ── Carousel Slide 3: Companion Planting ──────────────────────────────────────

function drawCarousel3(canvas: HTMLCanvasElement) {
  const S = 1080;
  canvas.width = S; canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = C.cream;
  ctx.fillRect(0, 0, S, S);

  // Top bar
  const topH = 300;
  const tg = ctx.createLinearGradient(0, 0, 0, topH);
  tg.addColorStop(0, "#4a9e56");
  tg.addColorStop(1, C.green);
  ctx.fillStyle = tg;
  ctx.fillRect(0, 0, S, topH);

  ctx.textAlign = "center"; ctx.textBaseline = "middle";

  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.font = "bold 200px Georgia, serif";
  ctx.fillText("03", S/2, topH/2);

  ctx.fillStyle = C.white;
  ctx.font = "bold 56px Georgia, serif";
  ctx.fillText("03", S/2, topH/2);

  ctx.fillStyle = C.green;
  ctx.font = "bold 52px Georgia, serif";
  ctx.fillText("Companion Planting", S/2, topH + 68);
  ctx.fillText("Done for You", S/2, topH + 130);

  // Companion pair cards
  const pairs: [string, string, string][] = [
    ["🍅", "🌿", "Tomato + Basil"],
    ["🥕", "🧅", "Carrot + Onion"],
    ["🥒", "🌻", "Cucumber + Sunflower"],
  ];
  const cardW = 280, cardH = 158, cardGap = 28;
  const totalW = 3 * cardW + 2 * cardGap;
  const cx = S/2 - totalW/2;
  const cy = topH + 198;

  pairs.forEach(([a, b, label], i) => {
    const x = cx + i * (cardW + cardGap);
    ctx.shadowColor = "rgba(0,0,0,0.08)"; ctx.shadowBlur = 16;
    rr(ctx, x, cy, cardW, cardH, 20, C.white);
    ctx.shadowBlur = 0;

    ctx.font = "50px serif";
    ctx.fillText(a, x + cardW/2 - 32, cy + 58);
    ctx.fillText(b, x + cardW/2 + 32, cy + 58);

    ctx.fillStyle = C.green;
    ctx.font = "bold 22px serif";
    ctx.fillText("♥", x + cardW/2, cy + 58);

    ctx.fillStyle = C.gray;
    ctx.font = "17px Arial";
    ctx.fillText(label, x + cardW/2, cy + 118);
  });

  // Body copy
  ctx.fillStyle = "#374151";
  ctx.font = "25px Arial, sans-serif";
  const lines = [
    "Certain plants help each other grow.",
    "We automatically place them together —",
    "so you get better yields without the research.",
  ];
  lines.forEach((line, i) => ctx.fillText(line, S/2, topH + 434 + i * 44));

  // CTA
  ctx.shadowColor = "rgba(0,0,0,0.12)"; ctx.shadowBlur = 16;
  rr(ctx, S/2 - 200, 872, 400, 72, 36, C.green);
  ctx.shadowBlur = 0;
  ctx.fillStyle = C.white;
  ctx.font = "bold 28px Arial, sans-serif";
  ctx.fillText("Try It Free →", S/2, 908);

  ctx.fillStyle = C.gray;
  ctx.globalAlpha = 0.55;
  ctx.font = "19px Arial";
  ctx.fillText("plantersblueprint.com", S/2, 978);
  ctx.globalAlpha = 1;

  // Step dots
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(S/2 + (i-1)*28, S - 36, i === 2 ? 12 : 8, 0, Math.PI*2);
    ctx.fillStyle = i === 2 ? C.green : "#d1d5db";
    ctx.fill();
  }
}

// ── Story Ad 1080×1920 ────────────────────────────────────────────────────────

function drawStoryAd(canvas: HTMLCanvasElement) {
  const W = 1080, H = 1920;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#2a5f31");
  bg.addColorStop(0.5, C.green);
  bg.addColorStop(1, C.greenD);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Decorative emoji scatter
  const deco = ["🍅","🥕","🥬","🌿","🧅","🥒","🌻","🫑"];
  const positions = [
    [100,200],[980,300],[60,600],[1020,700],
    [150,1200],[930,1100],[80,1500],[1000,1400],
    [500,180],[580,1750],[200,920],[880,950],
  ];
  ctx.globalAlpha = 0.06;
  ctx.font = "80px serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  positions.forEach(([x, y], i) => ctx.fillText(deco[i % deco.length], x, y));
  ctx.globalAlpha = 1;

  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillStyle = C.white;

  // Brand
  ctx.globalAlpha = 0.55;
  ctx.font = "26px Arial, sans-serif";
  ctx.fillText("PLANTERS BLUEPRINT", W/2, 120);
  ctx.globalAlpha = 1;

  // Seedling
  ctx.font = "160px serif";
  ctx.fillText("🌱", W/2, 320);

  // Headline
  ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 20;
  ctx.font = "bold 88px Georgia, serif";
  ctx.fillText("Plan Your", W/2, 520);
  ctx.fillText("Dream Garden", W/2, 622);
  ctx.fillText("With AI", W/2, 724);
  ctx.shadowBlur = 0;

  // Divider
  ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W/2 - 240, 788); ctx.lineTo(W/2 + 240, 788); ctx.stroke();

  // Features
  ctx.textAlign = "left";
  ctx.font = "33px Arial, sans-serif";
  const feats = [
    "Companion planting, automatically",
    "Fits your exact garden size",
    "USDA zone-aware suggestions",
    "AI-generated in seconds",
    "Free plan — no credit card",
  ];
  const fx = W/2 - 310;
  feats.forEach((text, i) => {
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText("✓", fx, 856 + i * 60);
    ctx.fillStyle = C.white;
    ctx.fillText(`   ${text}`, fx, 856 + i * 60);
  });

  // Garden grid (4×4, cell=140)
  ctx.textAlign = "center";
  const cellSize = 140, gap = 12;
  const gridW = 4 * cellSize + 3 * gap;
  const gx = W/2 - gridW/2;
  const gy = 1196;

  ctx.shadowColor = "rgba(0,0,0,0.15)"; ctx.shadowBlur = 30;
  rr(ctx, gx - 16, gy - 16, gridW + 32, 4 * cellSize + 3 * gap + 32, 24, "rgba(255,255,255,0.12)");
  ctx.shadowBlur = 0;

  drawGardenGrid(ctx, gx, gy, cellSize, gap, 72);

  // CTA
  ctx.shadowColor = "rgba(0,0,0,0.2)"; ctx.shadowBlur = 20;
  rr(ctx, W/2 - 260, 1762, 520, 88, 44, C.white);
  ctx.shadowBlur = 0;
  ctx.fillStyle = C.green;
  ctx.font = "bold 36px Arial, sans-serif";
  ctx.fillText("Start Your Free Plan →", W/2, 1806);

  // URL
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "24px Arial";
  ctx.fillText("plantersblueprint.com", W/2, 1882);
}

// ── Components ────────────────────────────────────────────────────────────────

function AssetCard({
  title, subtitle, draw, previewH = 200, filename,
}: {
  title: string;
  subtitle: string;
  draw: (canvas: HTMLCanvasElement) => void;
  previewH?: number;
  filename: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => { if (ref.current) draw(ref.current); }, [draw]);

  const download = () => {
    if (!ref.current) return;
    const a = document.createElement("a");
    a.download = filename;
    a.href = ref.current.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="bg-gray-50 border-b border-gray-100 flex items-center justify-center overflow-hidden" style={{ height: previewH }}>
        <canvas ref={ref} style={{ maxWidth: "100%", maxHeight: "100%", display: "block" }} />
      </div>
      <div className="p-4 flex items-start justify-between gap-4">
        <div>
          <div className="font-semibold text-gray-800 text-sm">{title}</div>
          <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>
        </div>
        <button
          onClick={download}
          className="shrink-0 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          Download PNG
        </button>
      </div>
    </div>
  );
}

function CopyCard({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="text-xs font-semibold text-primary uppercase tracking-wide">{label}</div>
        <button
          onClick={copy}
          className="shrink-0 px-3 py-1 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{text}</pre>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FbAdsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-16">

        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-800">Facebook Ad Assets</h1>
          <p className="text-sm text-gray-500 mt-1">Download images and copy for each stage of your funnel</p>
        </div>

        {/* Ad Images */}
        <section className="space-y-6">
          <h2 className="text-xl font-serif font-semibold text-gray-800 border-b border-gray-200 pb-2">Ad Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AssetCard
              title="Feed Ad"
              subtitle="1200 × 628 px · Facebook & Instagram Feed"
              draw={drawFeedAd}
              previewH={220}
              filename="pb-feed-ad-1200x628.png"
            />
            <AssetCard
              title="Square Ad"
              subtitle="1080 × 1080 px · Versatile — works everywhere"
              draw={drawSquareAd}
              previewH={220}
              filename="pb-square-ad-1080x1080.png"
            />
            <AssetCard
              title="Carousel Slide 1 — Pick Your Plants"
              subtitle="1080 × 1080 px · Top of funnel"
              draw={drawCarousel1}
              previewH={220}
              filename="pb-carousel-1-pick-plants.png"
            />
            <AssetCard
              title="Carousel Slide 2 — AI Builds Your Layout"
              subtitle="1080 × 1080 px · Mid funnel"
              draw={drawCarousel2}
              previewH={220}
              filename="pb-carousel-2-ai-layout.png"
            />
            <AssetCard
              title="Carousel Slide 3 — Companion Planting"
              subtitle="1080 × 1080 px · Bottom of carousel"
              draw={drawCarousel3}
              previewH={220}
              filename="pb-carousel-3-companion.png"
            />
            <AssetCard
              title="Story Ad"
              subtitle="1080 × 1920 px · Facebook & Instagram Stories"
              draw={drawStoryAd}
              previewH={300}
              filename="pb-story-ad-1080x1920.png"
            />
          </div>
        </section>

        {/* Ad Copy */}
        <section className="space-y-10">
          <h2 className="text-xl font-serif font-semibold text-gray-800 border-b border-gray-200 pb-2">Ad Copy</h2>
          {COPY_SECTIONS.map((section) => (
            <div key={section.label} className="space-y-4">
              <h3 className="text-base font-semibold text-gray-700">{section.label}</h3>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <CopyCard key={item.label} label={item.label} text={item.text} />
                ))}
              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
