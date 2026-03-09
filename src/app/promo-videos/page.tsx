"use client";

import { useRef, useState, useCallback } from "react";

// ─── Canvas dimensions ────────────────────────────────────────────────────────
const W = 1280, H = 720;
const DURATION = 18; // seconds per video

// ─── Brand palette ───────────────────────────────────────────────────────────
const C = {
  green:    "#2d6a35",
  greenMid: "#3d8b45",
  greenLt:  "#6db87a",
  mint:     "#f0fdf4",
  mintDark: "#dcfce7",
  harvest:  "#d4a820",
  harvestLt:"#fef3c7",
  white:    "#ffffff",
  gray:     "#6b7280",
  grayLt:   "#f9fafb",
  pink:     "#fce7f3",
  pinkDark: "#f9a8d4",
  yellow:   "#fef9c3",
  red:      "#fee2e2",
  redDark:  "#fca5a5",
};

// ─── Animation math ───────────────────────────────────────────────────────────
const easeOut  = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut= (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
const clamp    = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const prog     = (t: number, s: number, e: number) => easeInOut(clamp((t-s)/(e-s), 0, 1));
const progOut  = (t: number, s: number, e: number) => easeOut(clamp((t-s)/(e-s), 0, 1));
const lerp     = (a: number, b: number, p: number) => a + (b - a) * p;
const lerpColor= (hex1: string, hex2: string, p: number) => {
  const parse = (h: string) => [
    parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)
  ];
  const [r1,g1,b1] = parse(hex1), [r2,g2,b2] = parse(hex2);
  const r = Math.round(lerp(r1,r2,p)), g = Math.round(lerp(g1,g2,p)), b = Math.round(lerp(b1,b2,p));
  return `rgb(${r},${g},${b})`;
};

// ─── Drawing helpers ──────────────────────────────────────────────────────────
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill?: string, stroke?: string, sw = 2) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw; ctx.stroke(); }
}

function text(ctx: CanvasRenderingContext2D, str: string, x: number, y: number, size: number, color: string, font = "serif", align: CanvasTextAlign = "center", alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.font = `${size}px ${font === "serif" ? '"Georgia", serif' : '"Arial", sans-serif'}`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(str, x, y);
  ctx.restore();
}

function emoji(ctx: CanvasRenderingContext2D, em: string, x: number, y: number, size: number, alpha = 1, scale = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `${size * scale}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(em, x, y);
  ctx.restore();
}

// ─── VIDEO 1: Garden Designer ─────────────────────────────────────────────────
const GRID_COLS = 6, GRID_ROWS = 5;
const GRID: { em: string; bg: string; zone: string }[][] = [
  [
    { em:"🍅", bg:"#bbf7d0", zone:"Tomato Zone" },
    { em:"🍅", bg:"#bbf7d0", zone:"Tomato Zone" },
    { em:"🌿", bg:"#d1fae5", zone:"Herb Border" },
    { em:"🌿", bg:"#d1fae5", zone:"Herb Border" },
    { em:"🌿", bg:"#d1fae5", zone:"Herb Border" },
    { em:"🌿", bg:"#d1fae5", zone:"Herb Border" },
  ],[
    { em:"🍅", bg:"#bbf7d0", zone:"Tomato Zone" },
    { em:"🍅", bg:"#bbf7d0", zone:"Tomato Zone" },
    { em:"🌱", bg:"#d1fae5", zone:"Herb Border" },
    { em:"🌱", bg:"#d1fae5", zone:"Herb Border" },
    { em:"🌿", bg:"#d1fae5", zone:"Herb Border" },
    { em:"🌿", bg:"#d1fae5", zone:"Herb Border" },
  ],[
    { em:"🥕", bg:"#fef9c3", zone:"Root Veg" },
    { em:"🥕", bg:"#fef9c3", zone:"Root Veg" },
    { em:"🥕", bg:"#fef9c3", zone:"Root Veg" },
    { em:"🥦", bg:"#fef9c3", zone:"Root Veg" },
    { em:"🥦", bg:"#fef9c3", zone:"Root Veg" },
    { em:"🌻", bg:"#fce7f3", zone:"Pollinator" },
  ],[
    { em:"🧅", bg:"#fef9c3", zone:"Root Veg" },
    { em:"🧅", bg:"#fef9c3", zone:"Root Veg" },
    { em:"🌶️", bg:"#fee2e2", zone:"Pepper Row" },
    { em:"🌶️", bg:"#fee2e2", zone:"Pepper Row" },
    { em:"🌸", bg:"#fce7f3", zone:"Pollinator" },
    { em:"🌸", bg:"#fce7f3", zone:"Pollinator" },
  ],[
    { em:"",   bg:"#f3f4f6", zone:"" },
    { em:"",   bg:"#f3f4f6", zone:"" },
    { em:"🌶️", bg:"#fee2e2", zone:"Pepper Row" },
    { em:"🌶️", bg:"#fee2e2", zone:"Pepper Row" },
    { em:"🌸", bg:"#fce7f3", zone:"Pollinator" },
    { em:"🌸", bg:"#fce7f3", zone:"Pollinator" },
  ],
];

const PLANTS_ORDER: [number,number][] = GRID.flatMap((row, r) =>
  row.map((_, c) => [r, c] as [number,number])
).filter(([r,c]) => GRID[r][c].em !== "");

const ZONES = [
  { name:"🍅 Tomato Zone",  color:"#bbf7d0", accent:"#16a34a" },
  { name:"🌿 Herb Border",  color:"#d1fae5", accent:"#059669" },
  { name:"🥕 Root Veg",     color:"#fef9c3", accent:"#ca8a04" },
  { name:"🌶️ Pepper Row",   color:"#fee2e2", accent:"#dc2626" },
  { name:"🌸 Pollinator",   color:"#fce7f3", accent:"#db2777" },
];

const COMPANION_NOTES = [
  "Basil next to tomatoes repels aphids",
  "Marigolds deter nematodes near peppers",
  "Carrots loosen soil for brassicas",
  "Onions keep away carrot fly",
];

function drawVideo1(ctx: CanvasRenderingContext2D, t: number) {
  ctx.clearRect(0, 0, W, H);

  // ── Scene 1: Brand intro (0-3s) ──────────────────────────────────────────
  const introProg = prog(t, 0, 2.8);
  const introOut  = 1 - prog(t, 2.5, 3.2);
  const introAlpha = Math.min(introProg, introOut);

  if (t < 3.2) {
    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, C.green);
    bg.addColorStop(1, C.greenMid);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Decorative circles
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = C.white;
    ctx.beginPath(); ctx.arc(200, 150, 180, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(1100, 580, 220, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    const scale = lerp(0.3, 1, easeOut(prog(t, 0, 1.2)));
    ctx.save();
    ctx.translate(W/2, H/2 - 60);
    ctx.scale(scale, scale);
    emoji(ctx, "🌱", 0, 0, 130, introAlpha);
    ctx.restore();

    text(ctx, "Planters Blueprint", W/2, H/2 + 55, 72, C.white, "serif", "center", introAlpha * prog(t, 0.4, 1.5));
    text(ctx, "AI-Powered Garden Designer", W/2, H/2 + 120, 32, C.mintDark, "sans", "center", introAlpha * prog(t, 0.8, 1.8));
  }

  // ── Scene 2 & 3: Garden grid (3-15s) ─────────────────────────────────────
  if (t >= 2.8 && t < 18) {
    const sceneP = prog(t, 2.8, 3.6);

    // Background
    ctx.fillStyle = lerpColor(C.green, C.mint, sceneP);
    ctx.fillRect(0, 0, W, H);

    // Title
    const titleA = prog(t, 3.2, 4.2);
    text(ctx, "Your AI-designed garden layout", W/2, 54, 30, C.green, "serif", "center", titleA);

    // Grid setup
    const cellSize = 96;
    const gridW = GRID_COLS * cellSize;
    const gridH = GRID_ROWS * cellSize;
    const gx = 80;
    const gy = (H - gridH) / 2 + 10;

    // Grid shadow
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.12)";
    ctx.shadowBlur = 30;
    rr(ctx, gx - 4, gy - 4, gridW + 8, gridH + 8, 16, C.white);
    ctx.restore();

    // Draw cells
    const plantRevealStart = 4.2;
    const plantRevealEnd   = 13.5;
    const plantsPerSecond  = PLANTS_ORDER.length / (plantRevealEnd - plantRevealStart);

    GRID.forEach((row, r) => {
      row.forEach((cell, c) => {
        const cx = gx + c * cellSize, cy = gy + r * cellSize;

        // Zone color bg (fades in after plants appear)
        const zoneA = prog(t, 13.2, 14.5);
        rr(ctx, cx, cy, cellSize, cellSize, 0, cell.bg.length ? lerpColor("#ffffff", cell.bg, zoneA) : "#f3f4f6");

        // Grid lines
        ctx.strokeStyle = "rgba(0,0,0,0.06)";
        ctx.lineWidth = 1;
        ctx.strokeRect(cx, cy, cellSize, cellSize);

        if (!cell.em) return;

        // Plant appearance
        const idx = PLANTS_ORDER.findIndex(([pr,pc]) => pr===r && pc===c);
        const plantT = plantRevealStart + idx / plantsPerSecond;
        const plantA = progOut(t, plantT, plantT + 0.5);
        const plantScale = lerp(0.2, 1, easeOut(plantA));

        if (plantA > 0) {
          ctx.save();
          ctx.translate(cx + cellSize/2, cy + cellSize/2);
          ctx.scale(plantScale, plantScale);
          emoji(ctx, cell.em, 0, 0, 48, plantA);
          ctx.restore();
        }
      });
    });

    // Grid outer border
    rr(ctx, gx, gy, gridW, gridH, 12, undefined, C.greenLt, 2);

    // Dimension label
    const dimA = prog(t, 5, 6);
    text(ctx, "12 × 10 ft garden", gx + gridW/2, gy + gridH + 30, 18, C.gray, "sans", "center", dimA);

    // ── Right panel: zones + companion notes ─────────────────────────────
    const panelX = gx + gridW + 40;
    const panelW = W - panelX - 40;
    const panelA = prog(t, 13.5, 14.8);

    if (panelA > 0) {
      rr(ctx, panelX, gy, panelW, gridH, 16, C.white, C.mintDark, 1.5);

      text(ctx, "Garden Zones", panelX + panelW/2, gy + 32, 20, C.green, "serif", "center", panelA);

      ZONES.forEach(({ name, color, accent }, i) => {
        const zA = prog(t, 13.5 + i*0.18, 14.5 + i*0.18);
        const rowY = gy + 72 + i * 52;
        rr(ctx, panelX+16, rowY, panelW-32, 40, 8, color, undefined, 0);
        ctx.save();
        ctx.globalAlpha = zA;
        ctx.fillStyle = accent;
        ctx.font = "15px Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(name, panelX + 32, rowY + 20);
        ctx.restore();
      });

      text(ctx, "Companion Planting Notes", panelX + panelW/2, gy + 360, 17, C.green, "serif", "center", panelA * prog(t, 14.2, 15));

      COMPANION_NOTES.forEach((note, i) => {
        const nA = prog(t, 14.5 + i*0.25, 15.5 + i*0.25);
        const ny = gy + 390 + i * 38;
        rr(ctx, panelX+16, ny, panelW-32, 30, 6, C.mintDark, undefined, 0);
        ctx.save();
        ctx.globalAlpha = nA;
        ctx.fillStyle = C.gray;
        ctx.font = "13px Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(`• ${note}`, panelX + 26, ny + 15);
        ctx.restore();
      });
    }
  }

  // ── Scene 4: CTA (15.5-18s) ──────────────────────────────────────────────
  if (t >= 15.5) {
    const ctaA = prog(t, 15.5, 16.8);

    // Bottom bar
    rr(ctx, 0, H - 100, W, 100, 0, C.green);
    ctx.save();
    ctx.globalAlpha = ctaA;
    text(ctx, "✨  Generated in seconds  •  30 plants  •  8 companion pairings  •  Zone 7b", W/2, H-64, 22, C.white, "sans", "center");
    text(ctx, "plantersblueprint.com", W/2, H-28, 18, C.harvestLt, "sans", "center");
    ctx.restore();
  }
}

// ─── VIDEO 2: Features Showcase ───────────────────────────────────────────────
const WIZARD_STEPS = [
  { icon:"📍", q:"What's your USDA zone?",      a:"Zone 7b — Maryland" },
  { icon:"📐", q:"How big is your garden?",      a:"12 × 10 ft" },
  { icon:"☀️", q:"How much sun does it get?",    a:"Full sun (6+ hrs)" },
  { icon:"🌱", q:"What plants do you want?",     a:"Tomatoes, herbs, peppers…" },
  { icon:"🎯", q:"What are your goals?",         a:"High yield + pollinators" },
];

const CALENDAR_MONTHS = [
  { month:"Jan", tasks:["Order seeds","Plan layout"] },
  { month:"Feb", tasks:["Start peppers indoors","Prep beds"] },
  { month:"Mar", tasks:["Sow tomatoes indoors","Direct sow greens"] },
  { month:"Apr", tasks:["Harden off seedlings","Plant cool crops"] },
  { month:"May", tasks:["Transplant tomatoes","Direct sow beans"] },
  { month:"Jun", tasks:["First harvest","Side-dress with compost"] },
  { month:"Jul", tasks:["Deep watering","Succession planting"] },
  { month:"Aug", tasks:["Peak harvest","Save seeds"] },
  { month:"Sep", tasks:["Plant fall crops","Collect herbs"] },
  { month:"Oct", tasks:["Clear beds","Plant garlic"] },
  { month:"Nov", tasks:["Mulch beds","Review season"] },
  { month:"Dec", tasks:["Plan next year","Clean tools"] },
];

const SEASON_COLORS: Record<string,string> = {
  Jan:"#e0f2fe", Feb:"#e0f2fe", Mar:"#d1fae5", Apr:"#d1fae5",
  May:"#bbf7d0", Jun:"#fef9c3", Jul:"#fde68a", Aug:"#fde68a",
  Sep:"#fed7aa", Oct:"#fee2e2", Nov:"#e0f2fe", Dec:"#e0f2fe",
};

const FEATURES = [
  { icon:"🤖", label:"AI-Powered Design" },
  { icon:"🗺️", label:"Interactive Garden Map" },
  { icon:"🌡️", label:"All 26 USDA Zones" },
  { icon:"📅", label:"12-Month Care Calendar" },
  { icon:"🌿", label:"Companion Planting Science" },
  { icon:"💾", label:"Save Multiple Designs" },
];

function drawVideo2(ctx: CanvasRenderingContext2D, t: number) {
  ctx.clearRect(0, 0, W, H);

  // ── Scene 1: Intro (0-3s) ────────────────────────────────────────────────
  const introOut = 1 - prog(t, 2.5, 3.2);
  if (t < 3.2) {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#1e5128");
    bg.addColorStop(1, C.greenMid);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = C.white;
    ctx.beginPath(); ctx.arc(950, 100, 250, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(150, 600, 200, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    const logoA = prog(t, 0, 1) * introOut;
    emoji(ctx, "🌱", W/2, H/2 - 80, 100, logoA);
    text(ctx, "Planters Blueprint", W/2, H/2 + 20, 72, C.white, "serif", "center", logoA);
    text(ctx, "Everything your garden needs to thrive", W/2, H/2 + 90, 32, C.mintDark, "sans", "center", logoA * prog(t, 0.6, 1.6));
  }

  // ── Scene 2: Wizard Questions (3-8.5s) ──────────────────────────────────
  if (t >= 2.8 && t < 10) {
    ctx.fillStyle = C.mint;
    ctx.fillRect(0, 0, W, H);

    const titleA = prog(t, 3.0, 4.0);
    text(ctx, "10 personalized questions", W/2, 54, 30, C.green, "serif", "center", titleA);
    text(ctx, "We tailor the design to your exact conditions", W/2, 92, 20, C.gray, "sans", "center", titleA * prog(t, 3.3, 4.3));

    const stepW = W - 160, stepH = 80;
    const stepX = 80;

    WIZARD_STEPS.forEach((step, i) => {
      const sA = prog(t, 3.5 + i*0.55, 4.5 + i*0.55) * (1 - prog(t, 8.8, 9.5));
      if (sA <= 0) return;

      const sy = 130 + i * (stepH + 14);
      const slideX = lerp(W + 60, stepX, easeOut(prog(t, 3.5 + i*0.55, 4.2 + i*0.55)));

      ctx.save();
      ctx.globalAlpha = sA;
      ctx.shadowColor = "rgba(0,0,0,0.08)";
      ctx.shadowBlur = 16;
      rr(ctx, slideX, sy, stepW, stepH, 14, C.white);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = sA;
      // Icon badge
      rr(ctx, slideX + 12, sy + 14, 52, 52, 10, C.mintDark);
      emoji(ctx, step.icon, slideX + 38, sy + 40, 28);

      ctx.fillStyle = C.green;
      ctx.font = 'bold 18px "Arial", sans-serif';
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(step.q, slideX + 76, sy + 28);

      ctx.fillStyle = C.gray;
      ctx.font = '15px "Arial", sans-serif';
      ctx.fillText(`→ ${step.a}`, slideX + 76, sy + 55);
      ctx.restore();
    });
  }

  // ── Scene 3: Care Calendar (9-16s) ───────────────────────────────────────
  if (t >= 8.8) {
    const sceneA = prog(t, 8.8, 9.8);

    ctx.fillStyle = lerpColor(C.mint, C.white, prog(t, 8.8, 10));
    ctx.fillRect(0, 0, W, H);

    const titleA = sceneA;
    text(ctx, "12-Month Care Calendar", W/2, 54, 32, C.green, "serif", "center", titleA);
    text(ctx, "Month-by-month tasks tailored to your zone and plants", W/2, 92, 20, C.gray, "sans", "center", titleA);

    const cols = 6, colW = (W - 80) / cols, rowH = 116;
    const startX = 40, startY = 120;

    CALENDAR_MONTHS.forEach((m, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const mx = startX + col * colW;
      const my = startY + row * (rowH + 10);
      const mA = prog(t, 9.2 + i * 0.22, 10.2 + i * 0.22) * (1 - prog(t, 16.5, 17.2));

      if (mA <= 0) return;

      const bg = SEASON_COLORS[m.month] ?? C.mintDark;

      ctx.save();
      ctx.globalAlpha = mA;
      ctx.shadowColor = "rgba(0,0,0,0.07)";
      ctx.shadowBlur = 10;
      rr(ctx, mx + 4, my, colW - 8, rowH, 12, bg);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = mA;
      ctx.fillStyle = C.green;
      ctx.font = 'bold 16px "Arial", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(m.month, mx + colW/2, my + 18);

      ctx.fillStyle = C.gray;
      ctx.font = '12px "Arial", sans-serif';
      ctx.textAlign = "left";
      m.tasks.forEach((task, ti) => {
        ctx.fillText(`• ${task}`, mx + 12, my + 42 + ti * 22);
      });
      ctx.restore();
    });

    // ── Scene 4: Feature pills + CTA (15.5-18s) ──────────────────────────
    if (t >= 15.5) {
      const ctaA = prog(t, 15.5, 16.5);

      // Dark overlay
      ctx.fillStyle = `rgba(45,106,53,${ctaA * 0.92})`;
      ctx.fillRect(0, 0, W, H);

      text(ctx, "Everything you need to grow", W/2, H/2 - 140, 48, C.white, "serif", "center", ctaA);

      const pillW = 280, pillH = 62;
      const pillCols = 3;
      const totalPillW = pillCols * pillW + (pillCols-1) * 20;
      const pillStartX = (W - totalPillW) / 2;

      FEATURES.forEach((f, i) => {
        const col = i % pillCols, row = Math.floor(i / pillCols);
        const px = pillStartX + col * (pillW + 20);
        const py = H/2 - 65 + row * (pillH + 14);
        const fA = ctaA * prog(t, 15.7 + i*0.1, 16.5 + i*0.1);

        ctx.save();
        ctx.globalAlpha = fA;
        ctx.shadowColor = "rgba(0,0,0,0.25)";
        ctx.shadowBlur = 12;
        rr(ctx, px, py, pillW, pillH, 14, "rgba(255,255,255,0.15)");
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = fA;
        emoji(ctx, f.icon, px + 36, py + pillH/2, 26);
        ctx.fillStyle = C.white;
        ctx.font = 'bold 17px "Arial", sans-serif';
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(f.label, px + 62, py + pillH/2);
        ctx.restore();
      });

      rr(ctx, W/2 - 220, H/2 + 160, 440, 64, 32, C.harvest, undefined, 0);
      text(ctx, "🌱  Start free at plantersblueprint.com", W/2, H/2 + 192, 22, C.green, "sans", "center", ctaA * prog(t, 16.2, 17));
    }
  }
}

// ─── Recorder hook ────────────────────────────────────────────────────────────
type Status = "idle" | "recording" | "done";

function useVideoRecorder(canvasRef: React.RefObject<HTMLCanvasElement | null>, drawFn: (ctx: CanvasRenderingContext2D, t: number) => void) {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const rafRef = useRef<number>(0);

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setStatus("recording");
    setProgress(0);
    setUrl(null);

    const fps = 30;
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";

    const stream = canvas.captureStream(fps);
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setUrl(URL.createObjectURL(blob));
      setStatus("done");
    };

    recorder.start();
    const startTime = performance.now();

    const tick = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      const t = Math.min(elapsed, DURATION);
      drawFn(ctx, t);
      setProgress(t / DURATION);

      if (t < DURATION) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        recorder.stop();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [canvasRef, drawFn]);

  return { status, progress, url, start };
}

// ─── VideoCard component ──────────────────────────────────────────────────────
function VideoCard({ title, desc, drawFn, filename }: {
  title: string;
  desc: string;
  drawFn: (ctx: CanvasRenderingContext2D, t: number) => void;
  filename: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { status, progress, url, start } = useVideoRecorder(canvasRef, drawFn);

  return (
    <div className="card flex flex-col gap-4">
      <div>
        <h2 className="font-serif font-bold text-xl text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{desc}</p>
      </div>

      {/* Preview canvas — rendered at 50% scale */}
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100" style={{ lineHeight: 0 }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ width: "100%", display: "block" }}
        />
      </div>

      {/* Progress bar */}
      {status === "recording" && (
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={start}
          disabled={status === "recording"}
          className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm"
        >
          {status === "idle" ? "▶ Record Video" : status === "recording" ? `Recording… ${Math.round(progress*100)}%` : "▶ Re-record"}
        </button>

        {url && (
          <a
            href={url}
            download={filename}
            className="px-5 py-2.5 bg-harvest text-primary font-semibold rounded-xl hover:bg-harvest/90 transition-colors text-sm"
          >
            ⬇ Download WebM
          </a>
        )}
      </div>

      {status === "idle" && (
        <p className="text-xs text-gray-400">Click Record — the animation renders in real time (~{DURATION}s) then saves as a downloadable video.</p>
      )}
      {status === "done" && (
        <p className="text-xs text-gray-400">Ready! Click Download to save the {DURATION}-second WebM video (1280×720).</p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PromoVideosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Promo Videos</h1>
          <p className="text-gray-500">Click <strong>Record Video</strong> on each card — it renders the 18-second animation live, then gives you a download link.</p>
        </div>

        <div className="flex flex-col gap-10">
          <VideoCard
            title="Video 1 — AI Garden Designer"
            desc="Shows the AI generating a companion-planting garden layout, with zones and planting notes. Best for top-of-funnel ads."
            drawFn={drawVideo1}
            filename="planters-blueprint-garden-designer.webm"
          />
          <VideoCard
            title="Video 2 — Full Feature Showcase"
            desc="Walks through the wizard questions, care calendar, and complete feature set. Best for remarketing and feature highlights."
            drawFn={drawVideo2}
            filename="planters-blueprint-features.webm"
          />
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          Videos export as WebM (VP9). Convert to MP4 with Handbrake or CloudConvert for broader compatibility.
        </p>
      </div>
    </div>
  );
}
