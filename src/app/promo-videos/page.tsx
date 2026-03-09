"use client";

import { useRef, useState, useCallback } from "react";

// ─── Animation helpers ────────────────────────────────────────────────────────
const easeOut   = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
const clamp     = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const prog      = (t: number, s: number, e: number) => easeInOut(clamp((t-s)/(e-s), 0, 1));
const progOut   = (t: number, s: number, e: number) => easeOut(clamp((t-s)/(e-s), 0, 1));
const lerp      = (a: number, b: number, p: number) => a + (b - a) * p;
const lerpHex   = (h1: string, h2: string, p: number) => {
  const parse = (h: string) => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  const [r1,g1,b1] = parse(h1), [r2,g2,b2] = parse(h2);
  return `rgb(${Math.round(lerp(r1,r2,p))},${Math.round(lerp(g1,g2,p))},${Math.round(lerp(b1,b2,p))})`;
};

const C = {
  green:   "#2d6a35", greenMid:"#3d8b45", greenLt:"#6db87a",
  mint:    "#f0fdf4", mintDark:"#dcfce7",
  harvest: "#d4a820", harvestLt:"#fef3c7",
  white:   "#ffffff", gray:"#6b7280", grayLt:"#f9fafb",
  pink:    "#fce7f3", yellow:"#fef9c3", red:"#fee2e2",
};

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill?: string, stroke?: string, sw = 2) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  if (fill)   { ctx.fillStyle   = fill;  ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw; ctx.stroke(); }
}
function txt(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, size: number, color: string, serif = false, align: CanvasTextAlign = "center", alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color;
  ctx.font = `${size}px ${serif ? '"Georgia",serif' : '"Arial",sans-serif'}`;
  ctx.textAlign = align; ctx.textBaseline = "middle"; ctx.fillText(s, x, y); ctx.restore();
}
function em(ctx: CanvasRenderingContext2D, e: string, x: number, y: number, size: number, alpha = 1, scl = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.font = `${size*scl}px serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(e, x, y); ctx.restore();
}

// ─── VIDEO 1  (1080 × 1350, 4:5 portrait) ────────────────────────────────────
const V1W = 1080, V1H = 1350;

const WIZARD_CARDS = [
  { icon:"📍", label:"USDA Zone",       val:"Zone 7b · Maryland"        },
  { icon:"📐", label:"Garden Size",     val:"10 × 12 ft"                },
  { icon:"☀️", label:"Sun Exposure",   val:"Full sun · 6+ hours"       },
  { icon:"🌱", label:"Plants Wanted",   val:"Tomatoes, herbs, peppers…" },
  { icon:"🎯", label:"Growing Goals",   val:"High yield + pollinators"  },
];

const V1_GRID: { em: string; bg: string }[][] = [
  [{ em:"🍅",bg:"#bbf7d0"},{em:"🍅",bg:"#bbf7d0"},{em:"🌿",bg:"#d1fae5"},{em:"🌿",bg:"#d1fae5"},{em:"🌿",bg:"#d1fae5"}],
  [{ em:"🍅",bg:"#bbf7d0"},{em:"🍅",bg:"#bbf7d0"},{em:"🌱",bg:"#d1fae5"},{em:"🌱",bg:"#d1fae5"},{em:"🌿",bg:"#d1fae5"}],
  [{ em:"🥕",bg:"#fef9c3"},{em:"🥕",bg:"#fef9c3"},{em:"🥕",bg:"#fef9c3"},{em:"🌻",bg:"#fce7f3"},{em:"🌻",bg:"#fce7f3"}],
  [{ em:"🧅",bg:"#fef9c3"},{em:"🧅",bg:"#fef9c3"},{em:"🌶️",bg:"#fee2e2"},{em:"🌶️",bg:"#fee2e2"},{em:"🌸",bg:"#fce7f3"}],
  [{ em:"🥦",bg:"#bbf7d0"},{em:"🥦",bg:"#bbf7d0"},{em:"🌶️",bg:"#fee2e2"},{em:"🌶️",bg:"#fee2e2"},{em:"🌸",bg:"#fce7f3"}],
];

const V1_ORDER = V1_GRID.flatMap((row,r)=>row.map((_,c)=>[r,c] as [number,number]));

function drawVideo1(ctx: CanvasRenderingContext2D, t: number) {
  ctx.clearRect(0, 0, V1W, V1H);

  // ── Scene 1: Intro 0-3s ────────────────────────────────────────────────────
  if (t < 3.2) {
    const bg = ctx.createLinearGradient(0, 0, 0, V1H);
    bg.addColorStop(0, "#1e5128"); bg.addColorStop(1, C.greenMid);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, V1W, V1H);

    // Decorative blobs
    ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = C.white;
    ctx.beginPath(); ctx.arc(150, 200, 250, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(950, 1150, 300, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    const fadeOut = 1 - prog(t, 2.6, 3.2);
    const logoP   = easeOut(prog(t, 0, 1));
    ctx.save(); ctx.translate(V1W/2, V1H/2 - 110);
    ctx.scale(lerp(0.2, 1, logoP), lerp(0.2, 1, logoP));
    em(ctx, "🌱", 0, 0, 160, fadeOut);
    ctx.restore();

    txt(ctx, "Planters Blueprint", V1W/2, V1H/2 + 60, 76, C.white, true, "center", fadeOut * prog(t, 0.3, 1.2));
    txt(ctx, "AI-Powered Garden Design", V1W/2, V1H/2 + 135, 34, C.mintDark, false, "center", fadeOut * prog(t, 0.7, 1.7));
  }

  // ── Scene 2: Wizard cards 3-9s ────────────────────────────────────────────
  if (t >= 2.8 && t < 10.5) {
    const bgP = prog(t, 2.8, 3.8);
    ctx.fillStyle = lerpHex(C.green, C.mint, bgP);
    ctx.fillRect(0, 0, V1W, V1H);

    // Background decoration
    if (bgP > 0.5) {
      ctx.save(); ctx.globalAlpha = 0.06; ctx.fillStyle = C.green;
      ctx.beginPath(); ctx.arc(V1W+100, -100, 400, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }

    const titleA = prog(t, 3.2, 4.2) * (1 - prog(t, 9.5, 10.2));
    rr(ctx, (V1W-420)/2, 90, 420, 56, 28, C.harvest + "30");
    txt(ctx, "✨  Just answer 10 questions", V1W/2, 118, 26, C.green, false, "center", titleA);
    txt(ctx, "We tailor every detail to your exact garden", V1W/2, 180, 22, C.gray, false, "center", titleA * prog(t, 3.5, 4.5));

    const cardW = 940, cardH = 96, cardX = (V1W - cardW) / 2;
    const cardBaseY = 230;

    WIZARD_CARDS.forEach((card, i) => {
      const appear = 3.8 + i * 0.5;
      const slideP = progOut(t, appear, appear + 0.55);
      const cardA  = slideP * (1 - prog(t, 9.2, 10));
      if (cardA <= 0) return;

      const cx = lerp(V1W + 80, cardX, slideP);
      const cy = cardBaseY + i * (cardH + 14);

      ctx.save(); ctx.globalAlpha = cardA;
      ctx.shadowColor = "rgba(0,0,0,0.09)"; ctx.shadowBlur = 18;
      rr(ctx, cx, cy, cardW, cardH, 16, C.white);
      ctx.restore();

      ctx.save(); ctx.globalAlpha = cardA;
      rr(ctx, cx+14, cy+14, 68, 68, 12, C.mintDark);
      em(ctx, card.icon, cx+48, cy+48, 36);

      ctx.fillStyle = C.green; ctx.font = 'bold 22px "Arial",sans-serif';
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(card.label, cx+96, cy+34);
      ctx.fillStyle = C.gray; ctx.font = '19px "Arial",sans-serif';
      ctx.fillText(`→ ${card.val}`, cx+96, cy+64);
      ctx.restore();
    });
  }

  // ── Scene 3: AI processing 9.8-12s ────────────────────────────────────────
  if (t >= 9.6 && t < 12.5) {
    const fadeIn  = prog(t, 9.6, 10.4);
    const fadeOut = 1 - prog(t, 11.8, 12.4);
    const a = Math.min(fadeIn, fadeOut);

    ctx.fillStyle = `rgba(30,81,40,${a * 0.96})`;
    ctx.fillRect(0, 0, V1W, V1H);

    em(ctx, "🤖", V1W/2, V1H/2 - 90, 110, a);
    txt(ctx, "AI is designing your garden…", V1W/2, V1H/2 + 20, 38, C.white, false, "center", a);

    // Animated progress bar
    const barW = 600, barH = 12, barX = (V1W-barW)/2, barY = V1H/2 + 80;
    rr(ctx, barX, barY, barW, barH, 6, "rgba(255,255,255,0.15)");
    const fillP = prog(t, 9.8, 11.8);
    rr(ctx, barX, barY, barW*fillP, barH, 6, C.harvest);

    // Floating plant emojis
    const plants = ["🍅","🌿","🥕","🌻","🌶️","🌸"];
    plants.forEach((p, i) => {
      const angle = (t * 0.8 + i * (Math.PI * 2 / plants.length));
      const ex = V1W/2 + Math.cos(angle) * 280;
      const ey = V1H/2 - 30 + Math.sin(angle) * 120;
      em(ctx, p, ex, ey, 36, a * 0.5);
    });
  }

  // ── Scene 4: Garden grid reveal 12-17s ────────────────────────────────────
  if (t >= 11.8) {
    const sceneA = prog(t, 11.8, 12.6);
    ctx.fillStyle = lerpHex(C.green, C.mint, prog(t, 11.8, 13));
    ctx.fillRect(0, 0, V1W, V1H);

    const titleA = sceneA * (1 - prog(t, 16.5, 17.2));
    txt(ctx, "Your AI-designed garden", V1W/2, 88, 44, C.green, true, "center", titleA);
    txt(ctx, "Companion-planted · Zone 7b · 10×12 ft", V1W/2, 148, 24, C.gray, false, "center", titleA * prog(t, 12.4, 13.2));

    const COLS = 5, ROWS = 5, CELL = 140;
    const gridW = COLS * CELL, gridH = ROWS * CELL;
    const gx = (V1W - gridW) / 2;
    const gy = 200;

    // Shadow card
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.12)"; ctx.shadowBlur = 30;
    rr(ctx, gx-6, gy-6, gridW+12, gridH+12, 18, C.white);
    ctx.restore();

    const plantRevStart = 12.8;
    const plantRevEnd   = 16.2;
    const perPlant = (plantRevEnd - plantRevStart) / V1_ORDER.length;
    const zoneA = prog(t, 16, 17);

    V1_GRID.forEach((row, r) => {
      row.forEach((cell, c) => {
        const cx = gx + c*CELL, cy = gy + r*CELL;
        const cellBg = lerpHex("#ffffff", cell.bg, zoneA);
        rr(ctx, cx, cy, CELL, CELL, 0, cellBg);
        ctx.strokeStyle = "rgba(0,0,0,0.06)"; ctx.lineWidth = 1; ctx.strokeRect(cx, cy, CELL, CELL);

        const idx = V1_ORDER.findIndex(([pr,pc])=>pr===r&&pc===c);
        const plantT = plantRevStart + idx*perPlant;
        const plantA = progOut(t, plantT, plantT+0.45);
        const scl = lerp(0.1, 1, easeOut(clamp((t-plantT)/0.45, 0, 1)));

        if (plantA > 0) {
          ctx.save(); ctx.translate(cx+CELL/2, cy+CELL/2); ctx.scale(scl,scl);
          em(ctx, cell.em, 0, 0, 64, plantA);
          ctx.restore();
        }
      });
    });

    // Grid border
    rr(ctx, gx, gy, gridW, gridH, 14, undefined, C.greenLt, 2);

    // Zone legend below grid
    const legendA = prog(t, 16, 17) * (1 - prog(t, 16.8, 17.5));
    const zones = [
      {label:"🍅 Tomato",   bg:"#bbf7d0", color:"#16a34a"},
      {label:"🌿 Herbs",    bg:"#d1fae5", color:"#059669"},
      {label:"🥕 Root Veg", bg:"#fef9c3", color:"#ca8a04"},
      {label:"🌶️ Pepper",  bg:"#fee2e2", color:"#dc2626"},
      {label:"🌸 Flowers",  bg:"#fce7f3", color:"#db2777"},
    ];
    const legY = gy + gridH + 28;
    const legW = 170;
    zones.forEach((z, i) => {
      const lx = gx + i * (legW + 8);
      ctx.save(); ctx.globalAlpha = legendA;
      rr(ctx, lx, legY, legW, 46, 10, z.bg);
      ctx.fillStyle = z.color; ctx.font = 'bold 17px "Arial",sans-serif';
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(z.label, lx + legW/2, legY + 23);
      ctx.restore();
    });
  }

  // ── Scene 5: CTA 17-18s ────────────────────────────────────────────────────
  if (t >= 16.8) {
    const ctaA = prog(t, 16.8, 17.6);
    ctx.fillStyle = `rgba(30,81,40,${ctaA})`;
    ctx.fillRect(0, 0, V1W, V1H);

    em(ctx, "🌱", V1W/2, V1H/2 - 170, 130, ctaA);
    txt(ctx, "Start planning for free", V1W/2, V1H/2 - 20, 56, C.white, true,  "center", ctaA);
    txt(ctx, "No credit card required", V1W/2, V1H/2 + 52, 26, C.mintDark, false, "center", ctaA);

    // CTA badge
    const badgeW = 700, badgeH = 84, badgeX = (V1W-badgeW)/2;
    ctx.save(); ctx.globalAlpha = ctaA;
    ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 24;
    rr(ctx, badgeX, V1H/2 + 110, badgeW, badgeH, 42, C.harvest);
    ctx.restore();
    txt(ctx, "plantersblueprint.com", V1W/2, V1H/2 + 152, 32, C.green, true, "center", ctaA);
  }
}

// ─── VIDEO 2  (1280 × 720, 16:9 landscape) ───────────────────────────────────
const V2W = 1280, V2H = 720;

const CALENDAR = [
  {month:"Jan",tasks:["Order seeds","Plan layout"],col:"#e0f2fe"},
  {month:"Feb",tasks:["Start peppers indoors","Prep beds"],col:"#e0f2fe"},
  {month:"Mar",tasks:["Sow tomatoes","Direct sow greens"],col:"#d1fae5"},
  {month:"Apr",tasks:["Harden off seedlings","Plant cool crops"],col:"#d1fae5"},
  {month:"May",tasks:["Transplant tomatoes","Direct sow beans"],col:"#bbf7d0"},
  {month:"Jun",tasks:["First harvest","Side-dress compost"],col:"#fef9c3"},
  {month:"Jul",tasks:["Deep watering","Succession planting"],col:"#fde68a"},
  {month:"Aug",tasks:["Peak harvest","Save seeds"],col:"#fde68a"},
  {month:"Sep",tasks:["Plant fall crops","Collect herbs"],col:"#fed7aa"},
  {month:"Oct",tasks:["Clear beds","Plant garlic"],col:"#fee2e2"},
  {month:"Nov",tasks:["Mulch beds","Review season"],col:"#e0f2fe"},
  {month:"Dec",tasks:["Plan next year","Clean tools"],col:"#e0f2fe"},
];

const V2_WIZARD = [
  {icon:"📍",q:"What's your USDA zone?",a:"Zone 7b — Maryland"},
  {icon:"📐",q:"How big is your garden?",a:"12 × 10 ft"},
  {icon:"☀️",q:"How much sun does it get?",a:"Full sun (6+ hrs)"},
  {icon:"🌱",q:"What plants do you want?",a:"Tomatoes, herbs, peppers…"},
  {icon:"🎯",q:"What are your goals?",a:"High yield + pollinators"},
];

const FEATURES = [
  {icon:"🤖",label:"AI-Powered Design"},
  {icon:"🗺️",label:"Interactive Garden Map"},
  {icon:"🌡️",label:"All 26 USDA Zones"},
  {icon:"📅",label:"12-Month Care Calendar"},
  {icon:"🌿",label:"Companion Planting Science"},
  {icon:"💾",label:"Save Multiple Designs"},
];

function drawVideo2(ctx: CanvasRenderingContext2D, t: number) {
  ctx.clearRect(0, 0, V2W, V2H);

  // ── Intro 0-3s ─────────────────────────────────────────────────────────────
  if (t < 3.2) {
    const bg = ctx.createLinearGradient(0, 0, V2W, V2H);
    bg.addColorStop(0, "#1e5128"); bg.addColorStop(1, C.greenMid);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, V2W, V2H);
    ctx.save(); ctx.globalAlpha = 0.08; ctx.fillStyle = C.white;
    ctx.beginPath(); ctx.arc(200, 150, 180, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(1100, 580, 220, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    const out = 1 - prog(t, 2.5, 3.2);
    const scl = lerp(0.2, 1, easeOut(prog(t, 0, 1.2)));
    ctx.save(); ctx.translate(V2W/2, V2H/2 - 60); ctx.scale(scl,scl);
    em(ctx, "🌱", 0, 0, 100, out); ctx.restore();
    txt(ctx, "Planters Blueprint", V2W/2, V2H/2+30, 68, C.white, true, "center", out * prog(t, 0.4, 1.4));
    txt(ctx, "Everything your garden needs to thrive", V2W/2, V2H/2+95, 28, C.mintDark, false, "center", out * prog(t, 0.8, 1.8));
  }

  // ── Wizard 3-8.5s ──────────────────────────────────────────────────────────
  if (t >= 2.8 && t < 10) {
    ctx.fillStyle = C.mint; ctx.fillRect(0, 0, V2W, V2H);
    const ta = prog(t, 3, 4) * (1-prog(t, 8.8, 9.5));
    txt(ctx, "10 personalized questions", V2W/2, 50, 28, C.green, true, "center", ta);
    txt(ctx, "Tailored to your exact conditions", V2W/2, 86, 18, C.gray, false, "center", ta);

    V2_WIZARD.forEach((step, i) => {
      const sA = prog(t, 3.5+i*0.5, 4.5+i*0.5) * (1-prog(t, 8.8, 9.5));
      if (sA <= 0) return;
      const sy = 118 + i * 98;
      const sx = lerp(V2W+60, 80, easeOut(prog(t, 3.5+i*0.5, 4.2+i*0.5)));
      ctx.save(); ctx.globalAlpha = sA; ctx.shadowColor = "rgba(0,0,0,0.08)"; ctx.shadowBlur = 14;
      rr(ctx, sx, sy, V2W-160, 82, 14, C.white); ctx.restore();
      ctx.save(); ctx.globalAlpha = sA;
      rr(ctx, sx+12, sy+13, 56, 56, 10, C.mintDark);
      em(ctx, step.icon, sx+40, sy+41, 28);
      ctx.fillStyle = C.green; ctx.font = 'bold 17px "Arial",sans-serif';
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(step.q, sx+78, sy+30);
      ctx.fillStyle = C.gray; ctx.font = '14px "Arial",sans-serif';
      ctx.fillText(`→ ${step.a}`, sx+78, sy+56);
      ctx.restore();
    });
  }

  // ── Calendar 9-16s ─────────────────────────────────────────────────────────
  if (t >= 8.8) {
    ctx.fillStyle = lerpHex(C.mint, C.white, prog(t, 8.8, 10));
    ctx.fillRect(0, 0, V2W, V2H);
    txt(ctx, "12-Month Care Calendar", V2W/2, 48, 30, C.green, true, "center", prog(t, 8.8, 9.8));
    txt(ctx, "Month-by-month tasks for your zone and plants", V2W/2, 82, 18, C.gray, false, "center", prog(t, 8.8, 9.8));

    const cols = 6, cW = (V2W-80)/cols, rH = 110;
    CALENDAR.forEach((m, i) => {
      const col = i%cols, row = Math.floor(i/cols);
      const mx = 40+col*cW, my = 102+row*(rH+8);
      const mA = prog(t, 9.2+i*0.2, 10.2+i*0.2) * (1-prog(t, 16.2, 16.8));
      if (mA <= 0) return;
      ctx.save(); ctx.globalAlpha = mA; ctx.shadowColor = "rgba(0,0,0,0.07)"; ctx.shadowBlur = 8;
      rr(ctx, mx+3, my, cW-6, rH, 10, m.col); ctx.restore();
      ctx.save(); ctx.globalAlpha = mA;
      ctx.fillStyle = C.green; ctx.font = 'bold 15px "Arial",sans-serif';
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(m.month, mx+cW/2, my+16);
      ctx.fillStyle = C.gray; ctx.font = '11px "Arial",sans-serif'; ctx.textAlign = "left";
      m.tasks.forEach((task, ti) => ctx.fillText(`• ${task}`, mx+10, my+38+ti*22));
      ctx.restore();
    });
  }

  // ── Features + CTA 15.5-18s ────────────────────────────────────────────────
  if (t >= 15.5) {
    const a = prog(t, 15.5, 16.5);
    ctx.fillStyle = `rgba(30,81,40,${a*0.94})`; ctx.fillRect(0,0,V2W,V2H);
    txt(ctx, "Everything you need to grow", V2W/2, V2H/2-140, 44, C.white, true, "center", a);
    const pW=280,pH=58,pCols=3,totW=pCols*(pW+16)-16,pSX=(V2W-totW)/2;
    FEATURES.forEach((f,i)=>{
      const col=i%pCols,row=Math.floor(i/pCols);
      const px=pSX+col*(pW+16),py=V2H/2-70+row*(pH+12);
      const fA=a*prog(t,15.7+i*0.1,16.5+i*0.1);
      ctx.save(); ctx.globalAlpha=fA; ctx.shadowColor="rgba(0,0,0,0.22)"; ctx.shadowBlur=10;
      rr(ctx,px,py,pW,pH,12,"rgba(255,255,255,0.13)"); ctx.restore();
      ctx.save(); ctx.globalAlpha=fA;
      em(ctx,f.icon,px+34,py+pH/2,24);
      ctx.fillStyle=C.white; ctx.font='bold 15px "Arial",sans-serif';
      ctx.textAlign="left"; ctx.textBaseline="middle";
      ctx.fillText(f.label,px+60,py+pH/2); ctx.restore();
    });
    rr(ctx,(V2W-420)/2,V2H/2+162,420,58,29,C.harvest);
    txt(ctx,"🌱  Start free at plantersblueprint.com",V2W/2,V2H/2+191,20,C.green,false,"center",a*prog(t,16.2,17));
  }
}

// ─── MP4 recorder hook ────────────────────────────────────────────────────────
type Status = "idle"|"recording"|"done"|"error";

interface VideoConfig { W: number; H: number; duration: number; fps: number }

function useMP4Recorder(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  drawFn: (ctx: CanvasRenderingContext2D, t: number) => void,
  cfg: VideoConfig
) {
  const [status, setStatus] = useState<Status>("idle");
  const [pct, setPct] = useState(0);
  const [url, setUrl] = useState<string|null>(null);
  const [fmt, setFmt] = useState<"mp4"|"webm">("mp4");
  const rafRef = useRef<number>(0);

  const start = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setStatus("recording"); setPct(0); setUrl(null);
    const { fps, duration, W, H } = cfg;
    const TOTAL_FRAMES = fps * duration;

    // ── Try VideoEncoder + mp4-muxer ─────────────────────────────────────────
    if (typeof VideoEncoder !== "undefined") {
      try {
        const { Muxer, ArrayBufferTarget } = await import("mp4-muxer");
        const muxer = new Muxer({
          target: new ArrayBufferTarget(),
          video: { codec: "avc", width: W, height: H },
          fastStart: "in-memory",
        });

        const encoder = new VideoEncoder({
          output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
          error: (e) => { console.error(e); setStatus("error"); },
        });

        const codecStr = "avc1.640034"; // H.264 High Profile Level 5.2
        const supported = await VideoEncoder.isConfigSupported({ codec: codecStr, width: W, height: H, framerate: fps });
        encoder.configure({
          codec: supported.supported ? codecStr : "avc1.42001E",
          width: W, height: H,
          bitrate: 10_000_000,
          framerate: fps,
        });

        setFmt("mp4");
        let frameIdx = 0;

        const tick = () => {
          if (frameIdx >= TOTAL_FRAMES) {
            encoder.flush().then(() => {
              muxer.finalize();
              const blob = new Blob([(muxer.target as InstanceType<typeof ArrayBufferTarget>).buffer], { type: "video/mp4" });
              setUrl(URL.createObjectURL(blob));
              setStatus("done");
            });
            return;
          }
          const t = frameIdx / fps;
          drawFn(ctx, t);

          const timestamp = Math.round(frameIdx * 1_000_000 / fps);
          const frame = new VideoFrame(canvas, { timestamp, duration: Math.round(1_000_000 / fps) });
          encoder.encode(frame, { keyFrame: frameIdx % (fps * 2) === 0 });
          frame.close();
          frameIdx++;
          setPct(frameIdx / TOTAL_FRAMES);
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return;
      } catch (err) {
        console.warn("VideoEncoder failed, falling back to WebM:", err);
      }
    }

    // ── Fallback: MediaRecorder WebM ─────────────────────────────────────────
    setFmt("webm");
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9" : "video/webm";
    const stream = canvas.captureStream(fps);
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
      setUrl(URL.createObjectURL(new Blob(chunks, { type: "video/webm" })));
      setStatus("done");
    };
    recorder.start();
    const t0 = performance.now();
    const tick2 = () => {
      const elapsed = (performance.now() - t0) / 1000;
      drawFn(ctx, Math.min(elapsed, duration));
      setPct(elapsed / duration);
      if (elapsed < duration) { rafRef.current = requestAnimationFrame(tick2); }
      else { recorder.stop(); }
    };
    rafRef.current = requestAnimationFrame(tick2);
  }, [canvasRef, drawFn, cfg]);

  return { status, pct, url, fmt, start };
}

// ─── VideoCard ────────────────────────────────────────────────────────────────
function VideoCard({ title, desc, drawFn, cfg, filename }: {
  title: string; desc: string;
  drawFn: (ctx: CanvasRenderingContext2D, t: number) => void;
  cfg: VideoConfig; filename: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { status, pct, url, fmt, start } = useMP4Recorder(canvasRef, drawFn, cfg);

  const ext = fmt === "mp4" ? "mp4" : "webm";
  const dlName = filename.replace(/\.\w+$/, `.${ext}`);

  // Portrait canvas needs different preview height
  const isPortrait = cfg.H > cfg.W;
  const previewStyle = isPortrait
    ? { width: "auto", height: 480, display: "block", margin: "0 auto" }
    : { width: "100%", display: "block" };

  return (
    <div className="card flex flex-col gap-4">
      <div>
        <h2 className="font-serif font-bold text-xl text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{desc}</p>
        <p className="text-xs text-gray-400 mt-0.5">{cfg.W} × {cfg.H} px · {cfg.duration}s · {cfg.fps}fps</p>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex justify-center">
        <canvas ref={canvasRef} width={cfg.W} height={cfg.H} style={previewStyle} />
      </div>

      {status === "recording" && (
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${Math.round(pct*100)}%` }} />
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={start}
          disabled={status === "recording"}
          className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm"
        >
          {status === "idle" ? "▶ Record Video"
            : status === "recording" ? `Encoding… ${Math.round(pct*100)}%`
            : "▶ Re-record"}
        </button>

        {url && (
          <a href={url} download={dlName}
            className="px-5 py-2.5 bg-harvest text-primary font-semibold rounded-xl hover:bg-harvest/90 transition-colors text-sm">
            ⬇ Download {fmt.toUpperCase()}
          </a>
        )}
      </div>

      {status === "idle" && (
        <p className="text-xs text-gray-400">
          Click Record — encodes all {cfg.fps*cfg.duration} frames then offers a download.
          Outputs MP4 (H.264) in Chrome/Edge, WebM in older browsers.
        </p>
      )}
      {status === "done" && (
        <p className="text-xs text-gray-400">
          ✓ {cfg.duration}s {fmt.toUpperCase()} ready. {fmt === "webm" && "Convert to MP4 at cloudconvert.com if needed."}
        </p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const V1_CFG: VideoConfig = { W: V1W, H: V1H, duration: 18, fps: 30 };
const V2_CFG: VideoConfig = { W: V2W, H: V2H, duration: 18, fps: 30 };

export default function PromoVideosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Promo Videos</h1>
          <p className="text-gray-500 text-sm">Click <strong>Record Video</strong> — the animation encodes frame-by-frame then gives you a download link.</p>
        </div>

        <div className="flex flex-col gap-10">
          <VideoCard
            title="Video 1 — AI Garden Designer (Instagram 4:5)"
            desc="Portrait format for Instagram feed and Facebook ads. Shows the wizard flow, AI processing, garden reveal, and CTA."
            drawFn={drawVideo1}
            cfg={V1_CFG}
            filename="planters-blueprint-ai-designer.mp4"
          />
          <VideoCard
            title="Video 2 — Full Feature Showcase (16:9 Landscape)"
            desc="Widescreen format for YouTube, Facebook, and Twitter. Walks through wizard questions, 12-month care calendar, and features."
            drawFn={drawVideo2}
            cfg={V2_CFG}
            filename="planters-blueprint-features.mp4"
          />
        </div>
      </div>
    </div>
  );
}
