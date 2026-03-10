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

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number | number[], fill?: string, stroke?: string, sw = 2) {
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

// ─── VIDEO 3  (1080 × 1350, 4:5 hook-style ad) ───────────────────────────────
const PAIN_POINTS = [
  { em:"😤", line1:"Spending hours",          line2:"planning your layout?" },
  { em:"🐛", line1:"Plants dying from",       line2:"bad companions?" },
  { em:"❓", line1:"Not sure what grows",      line2:"in your climate?" },
];

const V3_FEATURES = [
  { icon:"🤖", title:"AI Designs It For You",  sub:"Answer 10 questions → done",        bg:"#dcfce7", fg:"#16a34a" },
  { icon:"🌿", title:"Companion Planting",     sub:"Science-backed pairings built in",   bg:"#d1fae5", fg:"#059669" },
  { icon:"🌡️", title:"Zone-Aware",            sub:"All 26 USDA zones supported",        bg:"#fef9c3", fg:"#ca8a04" },
  { icon:"📅", title:"Care Calendar",          sub:"Month-by-month planting schedule",   bg:"#fce7f3", fg:"#db2777" },
];

const GOOD_PAIRS = [["🍅","🌿"],["🥕","🧅"],["🥦","🌸"],["🌶️","🌻"]];

function drawVideo3(ctx: CanvasRenderingContext2D, t: number) {
  ctx.clearRect(0, 0, V1W, V1H);

  // ── Scene 1: Hook 0-8s ────────────────────────────────────────────────────
  if (t < 8.2) {
    const bg = ctx.createLinearGradient(0, 0, 0, V1H);
    bg.addColorStop(0, "#1a4721"); bg.addColorStop(1, C.green);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, V1W, V1H);

    ctx.save(); ctx.globalAlpha = 0.05; ctx.strokeStyle = C.white; ctx.lineWidth = 1;
    for (let x = 0; x < V1W; x += 80) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,V1H); ctx.stroke(); }
    for (let y = 0; y < V1H; y += 80) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(V1W,y); ctx.stroke(); }
    ctx.restore();

    const fadeOut = 1 - prog(t, 7.0, 8.0);

    // "Are you a" — slides down from above
    const line1A = progOut(t, 0.1, 0.8) * fadeOut;
    const line1Y = lerp(V1H/2 - 260, V1H/2 - 240, easeOut(prog(t, 0.1, 0.8)));
    txt(ctx, "Are you a", V1W/2, line1Y, 88, "rgba(255,255,255,0.85)", false, "center", line1A);

    // "gardener?" — scales in with impact
    const line2P = prog(t, 0.6, 1.3);
    const line2Scl = lerp(1.7, 1, easeOut(line2P));
    const line2A = line2P * fadeOut;
    ctx.save();
    ctx.translate(V1W/2, V1H/2 - 30);
    ctx.scale(line2Scl, line2Scl);
    ctx.globalAlpha = line2A;
    ctx.fillStyle = C.white;
    ctx.font = `bold 200px "Georgia",serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("gardener?", 0, 0);
    ctx.restore();

    // Underline
    const ulW = lerp(0, 960, easeOut(prog(t, 1.2, 2.0)));
    ctx.save(); ctx.globalAlpha = fadeOut * prog(t, 1.2, 2.0);
    ctx.fillStyle = C.harvest; ctx.fillRect((V1W-ulW)/2, V1H/2 + 120, ulW, 10);
    ctx.restore();

    // "You need this." — slides up from below
    const line3P = prog(t, 1.4, 2.2);
    const line3Y = lerp(V1H/2 + 240, V1H/2 + 210, easeOut(line3P));
    txt(ctx, "You need this.", V1W/2, line3Y, 90, C.harvest, true, "center", line3P * fadeOut);

    // Floating plant emojis
    ["🌱","🍅","🌿","🥕","🌻","🌶️"].forEach((p, i) => {
      const angle = (t * 0.35 + i * Math.PI * 2 / 6);
      const ex = V1W/2 + Math.cos(angle) * (420 + i*14);
      const ey = V1H/2 - 10 + Math.sin(angle) * 280;
      em(ctx, p, ex, ey, 46, 0.18 * fadeOut);
    });
  }

  // ── Scene 2: Pain points 7.0-17s ─────────────────────────────────────────
  if (t >= 7.0 && t < 17.0) {
    const bgA = prog(t, 7.0, 8.2);
    ctx.fillStyle = lerpHex(C.green, "#fffbeb", bgA);
    ctx.fillRect(0, 0, V1W, V1H);

    const titleA = prog(t, 8.0, 9.2) * (1 - prog(t, 15.8, 16.8));
    txt(ctx, "Sound familiar?", V1W/2, 140, 74, C.green, true, "center", titleA);

    const cW = 1020, cH = 230, cX = (V1W - cW) / 2;

    PAIN_POINTS.forEach((pt, i) => {
      const appear = 8.5 + i * 1.2;
      const slideP = progOut(t, appear, appear + 0.7);
      const cA = slideP * (1 - prog(t, 15.5, 16.5));
      if (cA <= 0) return;

      const cy = 240 + i * (cH + 22);
      const cx = lerp(-cW - 40, cX, easeOut(slideP));

      ctx.save(); ctx.globalAlpha = cA;
      ctx.shadowColor = "rgba(0,0,0,0.12)"; ctx.shadowBlur = 28;
      rr(ctx, cx, cy, cW, cH, 24, "#fff1f2");
      rr(ctx, cx, cy, 14, cH, [24,0,0,24], "#fca5a5");
      ctx.restore();

      ctx.save(); ctx.globalAlpha = cA;
      em(ctx, pt.em, cx + 100, cy + cH/2, 82);
      ctx.fillStyle = "#1f2937"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.font = `bold 38px "Georgia",serif`;
      ctx.fillText(pt.line1, cx + 190, cy + cH/2 - 28);
      ctx.font = `34px "Arial",sans-serif`; ctx.fillStyle = C.gray;
      ctx.fillText(pt.line2, cx + 190, cy + cH/2 + 28);
      ctx.restore();
    });
  }

  // ── Scene 3: Solution reveal 16-24s ──────────────────────────────────────
  if (t >= 16.0 && t < 24.0) {
    const inA  = prog(t, 16.0, 17.2);
    const outA = 1 - prog(t, 23.0, 24.0);
    const a = Math.min(inA, outA);

    ctx.fillStyle = `rgba(26,71,33,${a * 0.97})`;
    ctx.fillRect(0, 0, V1W, V1H);

    const burstR = lerp(0, 620, easeOut(prog(t, 16.0, 17.5)));
    ctx.save(); ctx.globalAlpha = a * lerp(0.4, 0, prog(t, 16.5, 18.2));
    ctx.strokeStyle = C.harvest; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(V1W/2, V1H/2, burstR, 0, Math.PI*2); ctx.stroke();
    ctx.restore();

    const logoScl = lerp(0.3, 1, easeOut(prog(t, 16.1, 17.2)));
    ctx.save(); ctx.translate(V1W/2, V1H/2 - 200); ctx.scale(logoScl, logoScl);
    em(ctx, "🌱", 0, 0, 220, a); ctx.restore();

    txt(ctx, "Meet Planters Blueprint", V1W/2, V1H/2 + 80, 72, C.white, true, "center", a * prog(t, 16.8, 17.8));
    txt(ctx, "The AI-powered garden designer", V1W/2, V1H/2 + 172, 38, C.mintDark, false, "center", a * prog(t, 17.2, 18.2));

    ["Designed for your exact zone & soil","Companion planting built in","Free to start — no credit card"].forEach((line, i) => {
      const lA = a * prog(t, 17.8 + i*0.4, 18.8 + i*0.4);
      txt(ctx, `✅  ${line}`, V1W/2, V1H/2 + 290 + i*72, 30, C.mintDark, false, "center", lA);
    });
  }

  // ── Scene 4: Feature grid 23-29s ─────────────────────────────────────────
  if (t >= 23.0) {
    const bgA = prog(t, 23.0, 24.2);
    ctx.fillStyle = lerpHex(C.green, C.mint, bgA);
    ctx.fillRect(0, 0, V1W, V1H);

    const titleA = prog(t, 23.2, 24.4) * (1 - prog(t, 28.2, 29.0));
    txt(ctx, "Here's what you get", V1W/2, 106, 64, C.green, true, "center", titleA);

    const cW = 506, cH = 340, gap = 22;
    const gridW = cW*2+gap, gridH = cH*2+gap;
    const gx = (V1W-gridW)/2, gy = 168;

    V3_FEATURES.forEach((f, i) => {
      const col = i%2, row = Math.floor(i/2);
      const cx = gx + col*(cW+gap), cy = gy + row*(cH+gap);
      const fA = prog(t, 23.8 + i*0.5, 24.8 + i*0.5) * (1-prog(t, 28.0, 28.8));
      const scl = lerp(0.85, 1, easeOut(prog(t, 23.8+i*0.5, 24.5+i*0.5)));
      if (fA <= 0) return;

      ctx.save(); ctx.globalAlpha = fA;
      ctx.shadowColor = "rgba(0,0,0,0.1)"; ctx.shadowBlur = 22;
      ctx.translate(cx+cW/2, cy+cH/2); ctx.scale(scl, scl); ctx.translate(-(cx+cW/2), -(cy+cH/2));
      rr(ctx, cx, cy, cW, cH, 22, C.white);
      rr(ctx, cx, cy, cW, 10, [22,22,0,0], f.fg + "80");
      ctx.restore();

      ctx.save(); ctx.globalAlpha = fA;
      rr(ctx, cx+22, cy+28, 96, 96, 20, f.bg);
      em(ctx, f.icon, cx+70, cy+76, 52);

      ctx.fillStyle = "#1f2937"; ctx.font = `bold 30px "Georgia",serif`;
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(f.title, cx+22, cy+168);
      ctx.fillStyle = C.gray; ctx.font = `21px "Arial",sans-serif`;
      ctx.fillText(f.sub, cx+22, cy+212);

      if (i === 1) {
        GOOD_PAIRS.slice(0,3).forEach(([a,b], pi) => {
          const px = cx+22+pi*154, py = cy+262;
          rr(ctx, px, py, 138, 52, 12, f.bg);
          em(ctx, a, px+30, py+26, 26); em(ctx, b, px+64, py+26, 26);
          ctx.fillStyle = "#16a34a"; ctx.font = `bold 20px "Arial",sans-serif`;
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText("✓", px+114, py+26);
        });
      }
      if (i === 2) {
        rr(ctx, cx+22, cy+258, 210, 62, 14, f.bg);
        ctx.fillStyle = f.fg; ctx.font = `bold 30px "Georgia",serif`;
        ctx.textAlign = "center"; ctx.fillText("Zone 7b", cx+127, cy+289);
      }
      ctx.restore();
    });

    const stripA = prog(t, 26.0, 27.0) * (1-prog(t, 28.0, 28.8));
    if (stripA > 0) {
      rr(ctx, 30, gy+gridH+26, V1W-60, 64, 16, C.green+"22");
      txt(ctx, "🌱  Free to start  ·  No credit card  ·  Takes 2 minutes", V1W/2, gy+gridH+58, 26, C.green, false, "center", stripA);
    }
  }

  // ── Scene 5: CTA 28-30s ───────────────────────────────────────────────────
  if (t >= 28.0) {
    const a = prog(t, 28.0, 29.2);
    const bg = ctx.createLinearGradient(0, 0, 0, V1H);
    bg.addColorStop(0, `rgba(26,71,33,${a})`); bg.addColorStop(1, `rgba(45,106,53,${a})`);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, V1W, V1H);

    const logoP = easeOut(prog(t, 28.1, 29.0));
    ctx.save(); ctx.translate(V1W/2, V1H/2 - 240); ctx.scale(logoP, logoP);
    em(ctx, "🌱", 0, 0, 220, a); ctx.restore();

    txt(ctx, "Start your garden today at", V1W/2, V1H/2 - 30, 72, C.white, true, "center", a * prog(t, 28.3, 29.2));
    txt(ctx, "PlantersBlueprint.com", V1W/2, V1H/2 + 80, 88, C.harvest, true, "center", a * prog(t, 28.5, 29.4));
    txt(ctx, "Free · AI-powered · Takes 2 minutes", V1W/2, V1H/2 + 178, 32, C.mintDark, false, "center", a * prog(t, 28.7, 29.6));
  }
}

// ─── VIDEO 4  (1080 × 1350, wizard walkthrough) ───────────────────────────────
const V4_GRID: { em: string; bg: string }[][] = [
  [{em:"🍅",bg:"#bbf7d0"},{em:"🍅",bg:"#bbf7d0"},{em:"🍅",bg:"#bbf7d0"},{em:"🌿",bg:"#d1fae5"},{em:"🌿",bg:"#d1fae5"},{em:"🌿",bg:"#d1fae5"}],
  [{em:"🍅",bg:"#bbf7d0"},{em:"🍅",bg:"#bbf7d0"},{em:"🌱",bg:"#d1fae5"},{em:"🌱",bg:"#d1fae5"},{em:"🌿",bg:"#d1fae5"},{em:"🌿",bg:"#d1fae5"}],
  [{em:"🌶️",bg:"#fee2e2"},{em:"🌶️",bg:"#fee2e2"},{em:"🥕",bg:"#fef9c3"},{em:"🥕",bg:"#fef9c3"},{em:"🌻",bg:"#fce7f3"},{em:"🌻",bg:"#fce7f3"}],
  [{em:"🌶️",bg:"#fee2e2"},{em:"🌶️",bg:"#fee2e2"},{em:"🥕",bg:"#fef9c3"},{em:"🥕",bg:"#fef9c3"},{em:"🌸",bg:"#fce7f3"},{em:"🌸",bg:"#fce7f3"}],
  [{em:"🥦",bg:"#bbf7d0"},{em:"🥦",bg:"#bbf7d0"},{em:"🧅",bg:"#fef9c3"},{em:"🧅",bg:"#fef9c3"},{em:"🌸",bg:"#fce7f3"},{em:"🌸",bg:"#fce7f3"}],
  [{em:"🥦",bg:"#bbf7d0"},{em:"🥦",bg:"#bbf7d0"},{em:"🥒",bg:"#d1fae5"},{em:"🥒",bg:"#d1fae5"},{em:"🌼",bg:"#fef9c3"},{em:"🌼",bg:"#fef9c3"}],
];
const V4_ORDER = V4_GRID.flatMap((row,r)=>row.map((_,c)=>[r,c] as [number,number]));

function drawV4Card(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, step: number, a: number) {
  ctx.save(); ctx.globalAlpha = a;
  ctx.shadowColor = "rgba(0,0,0,0.10)"; ctx.shadowBlur = 26;
  rr(ctx, x, y, w, h, 28, C.white); ctx.shadowBlur = 0;
  const dotY = y + 46, dotSp = (w - 80) / 9;
  for (let i = 0; i < 10; i++) {
    ctx.beginPath(); ctx.arc(x + 40 + i * dotSp, dotY, i === step - 1 ? 9 : 5, 0, Math.PI*2);
    ctx.fillStyle = i < step ? C.green : "#e5e7eb"; ctx.fill();
  }
  rr(ctx, x+40, dotY+18, w-80, 3, 2, "#e5e7eb");
  rr(ctx, x+40, dotY+18, (w-80)*(step/10), 3, 2, C.green);
  ctx.restore();
}

function drawVideo4(ctx: CanvasRenderingContext2D, t: number) {
  const W = V1W, H = V1H;
  ctx.clearRect(0, 0, W, H);

  // ── Mint background (scenes 2 onward) ────────────────────────────────────
  if (t >= 3.0) { ctx.fillStyle = "#f0fdf4"; ctx.fillRect(0, 0, W, H); }

  // ── Scene 1: Title 0-3.5s ─────────────────────────────────────────────────
  if (t < 3.8) {
    const bg = ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,"#1a4721"); bg.addColorStop(1,C.greenMid);
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
    const fo = 1 - prog(t,2.8,3.6), ip = easeOut(prog(t,0,1.0));
    ctx.save(); ctx.translate(W/2,H/2-180); ctx.scale(lerp(0.2,1,ip),lerp(0.2,1,ip));
    em(ctx,"🌱",0,0,180,fo); ctx.restore();
    txt(ctx,"Planters Blueprint",W/2,H/2-30,76,C.white,true,"center",fo*prog(t,0.3,1.2));
    txt(ctx,"See how easy it is to build",W/2,H/2+88,36,"rgba(255,255,255,0.80)",false,"center",fo*prog(t,0.8,1.8));
    txt(ctx,"your perfect garden",W/2,H/2+138,36,C.harvestLt,false,"center",fo*prog(t,1.0,2.0));
  }

  // ── Scene 2: Step 1 – Dimensions 3.0-9.5s ────────────────────────────────
  if (t >= 3.0 && t < 9.8) {
    const ip=progOut(t,3.0,4.0), op=prog(t,8.8,9.5);
    const tx=lerp(W+60,0,ip)-lerp(0,W+60,op), a=Math.min(ip,1-op);
    const cX=80, cY=145, cW=W-160, cH=955;
    ctx.save(); ctx.translate(tx,0);
    drawV4Card(ctx,cX,cY,cW,cH,1,a);
    ctx.save(); ctx.globalAlpha=a;
    ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillStyle=C.gray;    ctx.font='20px "Arial",sans-serif'; ctx.fillText("Step 1 of 10",W/2,cY+100);
    ctx.fillStyle=C.green;   ctx.font='bold 50px "Georgia",serif'; ctx.fillText("How big is your garden?",W/2,cY+178);
    ctx.fillStyle=C.gray;    ctx.font='26px "Arial",sans-serif'; ctx.fillText("Enter your dimensions in feet",W/2,cY+234);
    const iW=(cW-120)/2, iX1=cX+40, iX2=cX+40+iW+40, iY=cY+290;
    const typed=Math.round(12*easeOut(prog(t,4.2,5.8)));
    [[iX1,"Width"],[iX2,"Length"]].forEach(([ix,lb])=>{
      ctx.fillStyle="#374151"; ctx.textAlign="left"; ctx.font='bold 24px "Arial",sans-serif';
      ctx.fillText(String(lb),Number(ix),iY);
      const active=typed===12;
      rr(ctx,Number(ix),iY+28,iW,74,14,C.white,active?C.green:"#d1d5db",active?3:2);
      if(typed>0){ ctx.fillStyle=C.green; ctx.textAlign="center"; ctx.font='bold 44px "Arial",sans-serif'; ctx.fillText(String(typed),Number(ix)+iW/2,iY+65); }
    });
    const btnY=iY+130;
    ctx.fillStyle=C.gray; ctx.textAlign="left"; ctx.font='22px "Arial",sans-serif';
    ctx.globalAlpha=a*0.65; ctx.fillText("Quick select:",iX1,btnY); ctx.globalAlpha=a;
    [8,12,16,20].forEach((sz,i)=>{
      const bx=iX1+i*210, active=sz===12&&typed===12;
      rr(ctx,bx,btnY+22,190,52,10,active?C.green:"#f9fafb",active?C.green:"#d1d5db",2);
      ctx.fillStyle=active?C.white:C.gray; ctx.textAlign="center"; ctx.font='24px "Arial",sans-serif';
      ctx.fillText(`${sz} ft`,bx+95,btnY+48);
    });
    const prevA=prog(t,5.8,6.8); ctx.globalAlpha=a*prevA;
    const pY=btnY+106;
    rr(ctx,cX+40,pY,cW-80,264,20,C.mint);
    ctx.fillStyle=C.green; ctx.textAlign="center"; ctx.font='bold 52px "Georgia",serif'; ctx.fillText("144 sq ft",W/2,pY+52);
    ctx.fillStyle=C.gray; ctx.font='24px "Arial",sans-serif'; ctx.fillText("12 × 12 ft  ·  6 × 6 grid cells",W/2,pY+108);
    rr(ctx,W/2-60,pY+128,120,120,10,"#bbf7d0",C.green,2);
    em(ctx,"🌱",W/2,pY+188,50,prevA); ctx.globalAlpha=a;
    ctx.globalAlpha=a*prog(t,7.2,7.8);
    rr(ctx,W/2-200,cY+cH-80,400,64,16,C.green);
    ctx.fillStyle=C.white; ctx.textAlign="center"; ctx.font='bold 30px "Arial",sans-serif'; ctx.fillText("Next →",W/2,cY+cH-48);
    ctx.restore(); ctx.restore();
  }

  // ── Scene 3: Step 2 – USDA Zone 9.0-14.8s ────────────────────────────────
  if (t >= 9.0 && t < 15.0) {
    const ip=progOut(t,9.0,10.0), op=prog(t,14.2,14.9);
    const tx=lerp(W+60,0,ip)-lerp(0,W+60,op), a=Math.min(ip,1-op);
    const cX=80, cY=130, cW=W-160, cH=1050;
    ctx.save(); ctx.translate(tx,0);
    drawV4Card(ctx,cX,cY,cW,cH,2,a);
    ctx.save(); ctx.globalAlpha=a;
    ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillStyle=C.gray;  ctx.font='20px "Arial",sans-serif'; ctx.fillText("Step 2 of 10",W/2,cY+100);
    ctx.fillStyle=C.green; ctx.font='bold 50px "Georgia",serif'; ctx.fillText("What's your USDA Zone?",W/2,cY+168);
    ctx.fillStyle=C.gray;  ctx.font='26px "Arial",sans-serif'; ctx.fillText("We'll pick plants that survive your winters",W/2,cY+226);
    const zones=["3a","3b","4a","4b","5a","5b","6a","6b","7a","7b","8a","8b","9a","9b","10a","10b"];
    const zCols=4, zBW=(cW-120-60)/zCols, sel=t>11.5?"6b":"";
    zones.forEach((z,i)=>{
      const col=i%zCols, row=Math.floor(i/zCols), bx=cX+40+col*(zBW+20), by=cY+278+row*88;
      const isSel=z===sel, zA=progOut(t,9.8+i*0.06,9.8+i*0.06+0.4);
      ctx.save(); ctx.globalAlpha=a*zA;
      rr(ctx,bx,by,zBW,68,12,isSel?C.green:"#f9fafb",isSel?C.green:"#e5e7eb",2);
      ctx.fillStyle=isSel?C.white:"#374151"; ctx.textAlign="center"; ctx.font='24px "Arial",sans-serif'; ctx.fillText(`Zone ${z}`,bx+zBW/2,by+34);
      ctx.restore();
    });
    ctx.globalAlpha=a*prog(t,12.2,12.8);
    rr(ctx,W/2-200,cY+cH-80,400,64,16,C.green);
    ctx.fillStyle=C.white; ctx.textAlign="center"; ctx.font='bold 30px "Arial",sans-serif'; ctx.fillText("Next →",W/2,cY+cH-48);
    ctx.restore(); ctx.restore();
  }

  // ── Scene 4: Fast selections (soil, sun, experience) 14.5-20.8s ──────────
  const qSteps=[
    {step:3,icon:"🌍",q:"What's your soil type?",   opts:["Sandy","Loamy","Clay","Silty"],          sel:"Loamy"},
    {step:5,icon:"☀️",q:"How much sun do you get?", opts:["Full Sun","Partial Sun","Full Shade","Mixed"], sel:"Full Sun"},
    {step:6,icon:"🌱",q:"Your experience level?",   opts:["Beginner","Intermediate","Expert","Mixed Garden"], sel:"Beginner"},
  ];
  if (t >= 14.5 && t < 21.0) {
    qSteps.forEach((qs,si)=>{
      const ss=14.5+si*2.1, se=ss+2.5;
      if(t<ss-0.1||t>se+0.1) return;
      const ip=progOut(t,ss,ss+0.6), op=prog(t,se-0.4,se+0.1);
      const tx=lerp(W+60,0,ip)-lerp(0,W+60,op), a=Math.min(ip,1-op);
      const cX=80, cY=185, cW=W-160, cH=820;
      ctx.save(); ctx.translate(tx,0);
      drawV4Card(ctx,cX,cY,cW,cH,qs.step,a);
      ctx.save(); ctx.globalAlpha=a;
      ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillStyle=C.gray;  ctx.font='20px "Arial",sans-serif'; ctx.fillText(`Step ${qs.step} of 10`,W/2,cY+100);
      em(ctx,qs.icon,W/2,cY+190,70,a);
      ctx.fillStyle=C.green; ctx.font='bold 48px "Georgia",serif'; ctx.fillText(qs.q,W/2,cY+290);
      const optW=(cW-120)/2;
      qs.opts.forEach((opt,oi)=>{
        const col=oi%2, row=Math.floor(oi/2), bx=cX+40+col*(optW+40), by=cY+360+row*112;
        const isSel=opt===qs.sel&&t>ss+1.0;
        rr(ctx,bx,by,optW,90,14,isSel?C.green:"#f9fafb",isSel?C.green:"#e5e7eb",2);
        ctx.fillStyle=isSel?C.white:"#374151"; ctx.textAlign="center"; ctx.font='28px "Arial",sans-serif'; ctx.fillText(opt,bx+optW/2,by+45);
      });
      ctx.globalAlpha=a*prog(t,ss+1.5,ss+2.0);
      rr(ctx,W/2-180,cY+cH-76,360,58,14,C.green);
      ctx.fillStyle=C.white; ctx.textAlign="center"; ctx.font='bold 28px "Arial",sans-serif'; ctx.fillText("Next →",W/2,cY+cH-47);
      ctx.restore(); ctx.restore();
    });
  }

  // ── Scene 5: Plant picker 20.5-26.5s ─────────────────────────────────────
  if (t >= 20.5 && t < 26.8) {
    const ip=progOut(t,20.5,21.5), op=prog(t,26.0,26.7);
    const tx=lerp(W+60,0,ip)-lerp(0,W+60,op), a=Math.min(ip,1-op);
    const cX=80, cY=105, cW=W-160, cH=1090;
    ctx.save(); ctx.translate(tx,0);
    drawV4Card(ctx,cX,cY,cW,cH,9,a);
    ctx.save(); ctx.globalAlpha=a;
    ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillStyle=C.gray;  ctx.font='20px "Arial",sans-serif'; ctx.fillText("Step 9 of 10",W/2,cY+100);
    ctx.fillStyle=C.green; ctx.font='bold 48px "Georgia",serif'; ctx.fillText("Which plants do you want?",W/2,cY+164);
    ctx.fillStyle=C.gray;  ctx.font='24px "Arial",sans-serif'; ctx.fillText("Tap to add • tap again to remove",W/2,cY+222);
    const plants5=[
      {em:"🍅",n:"Tomatoes"},{em:"🌶️",n:"Peppers"},{em:"🌿",n:"Basil"},
      {em:"🥕",n:"Carrots"}, {em:"🥒",n:"Zucchini"},{em:"🌻",n:"Sunflowers"},
      {em:"🥦",n:"Broccoli"},{em:"🧅",n:"Onions"},  {em:"🌸",n:"Flowers"},
      {em:"🥬",n:"Lettuce"}, {em:"🌾",n:"Herbs"},   {em:"🍓",n:"Berries"},
    ];
    const cols=3, chipW=(cW-120)/cols, chipH=102;
    plants5.forEach((p,i)=>{
      const col=i%cols, row=Math.floor(i/cols);
      const bx=cX+40+col*(chipW+20), by=cY+268+row*(chipH+14);
      const isSel=i<6&&t>21.8+i*0.5;
      const pA=progOut(t,21.2+i*0.04,21.2+i*0.04+0.3);
      ctx.save(); ctx.globalAlpha=a*pA;
      rr(ctx,bx,by,chipW,chipH,14,isSel?C.mintDark:"#f9fafb",isSel?C.green:"#e5e7eb",isSel?3:1);
      em(ctx,p.em,bx+42,by+chipH/2,36,1);
      ctx.fillStyle=isSel?C.green:"#374151"; ctx.textAlign="center"; ctx.font='22px "Arial",sans-serif';
      ctx.fillText(p.n,bx+chipW/2+18,by+chipH/2);
      if(isSel){ rr(ctx,bx+chipW-34,by+8,26,26,13,C.green); ctx.fillStyle=C.white; ctx.textAlign="center"; ctx.font='bold 16px "Arial",sans-serif'; ctx.fillText("✓",bx+chipW-21,by+21); }
      ctx.restore();
    });
    ctx.globalAlpha=a*prog(t,25.0,25.6);
    rr(ctx,W/2-200,cY+cH-82,400,64,16,C.green);
    ctx.fillStyle=C.white; ctx.textAlign="center"; ctx.font='bold 30px "Arial",sans-serif'; ctx.fillText("Next →",W/2,cY+cH-50);
    ctx.restore(); ctx.restore();
  }

  // ── Scene 6: Review + Generate 26.0-30.5s ────────────────────────────────
  if (t >= 26.0 && t < 31.0) {
    const ip=progOut(t,26.0,27.0), op=prog(t,30.2,30.9);
    const tx=lerp(W+60,0,ip)-lerp(0,W+60,op), a=Math.min(ip,1-op);
    const cX=80, cY=152, cW=W-160, cH=900;
    ctx.save(); ctx.translate(tx,0);
    drawV4Card(ctx,cX,cY,cW,cH,10,a);
    ctx.save(); ctx.globalAlpha=a;
    ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillStyle=C.gray;  ctx.font='20px "Arial",sans-serif'; ctx.fillText("Step 10 of 10",W/2,cY+100);
    ctx.fillStyle=C.green; ctx.font='bold 52px "Georgia",serif'; ctx.fillText("Review & Generate",W/2,cY+168);
    const rows6=[
      {icon:"📐",label:"Garden Size",val:"12 × 12 ft"},{icon:"📍",label:"USDA Zone",val:"Zone 6b"},
      {icon:"🌍",label:"Soil Type",  val:"Loamy"},      {icon:"☀️",label:"Sun",       val:"Full Sun"},
      {icon:"🌱",label:"Experience", val:"Beginner"},   {icon:"🌿",label:"Plants",    val:"6 plant varieties"},
    ];
    rows6.forEach((r,i)=>{
      const ry=cY+218+i*84, rA=progOut(t,27.0+i*0.1,27.0+i*0.1+0.4);
      ctx.save(); ctx.globalAlpha=a*rA;
      rr(ctx,cX+40,ry,cW-80,68,12,"#f9fafb","#e5e7eb",1);
      em(ctx,r.icon,cX+80,ry+34,28,1);
      ctx.fillStyle=C.gray; ctx.textAlign="left"; ctx.font='19px "Arial",sans-serif'; ctx.fillText(r.label,cX+118,ry+20);
      ctx.fillStyle="#111827"; ctx.font='bold 24px "Arial",sans-serif'; ctx.fillText(r.val,cX+118,ry+48);
      ctx.restore();
    });
    const bp=prog(t,28.8,29.6), pulse=1+Math.sin(t*4)*0.018*bp;
    ctx.save(); ctx.globalAlpha=a*bp; ctx.translate(W/2,cY+cH-66); ctx.scale(pulse,pulse);
    rr(ctx,-230,-34,460,68,18,C.harvest);
    ctx.fillStyle=C.green; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.font='bold 32px "Georgia",serif';
    ctx.fillText("🌻  Generate My Garden",0,0);
    ctx.restore(); ctx.restore(); ctx.restore();
  }

  // ── Scene 7: AI generating 30.0-34.2s ────────────────────────────────────
  if (t >= 30.0 && t < 34.5) {
    const fi=prog(t,30.0,31.0), fo=1-prog(t,33.2,34.2);
    const a=Math.min(fi,fo);
    ctx.fillStyle=`rgba(26,71,33,${a*0.97})`; ctx.fillRect(0,0,W,H);
    em(ctx,"🤖",W/2,H/2-100,120,a);
    txt(ctx,"AI is designing",W/2,H/2+32,50,C.white,true,"center",a);
    txt(ctx,"your garden…",W/2,H/2+96,50,C.white,true,"center",a);
    const barW=640,barH=14,barX=(W-barW)/2,barY=H/2+158;
    rr(ctx,barX,barY,barW,barH,7,"rgba(255,255,255,0.15)");
    const fp=prog(t,30.4,33.0);
    rr(ctx,barX,barY,barW*fp,barH,7,C.harvest);
    txt(ctx,`${Math.round(fp*100)}%`,W/2,barY+34,24,"rgba(255,255,255,0.55)",false,"center",a);
    ["🍅","🌿","🥕","🌻","🌶️","🌸","🥦","🥒"].forEach((p,i)=>{
      const ang=t*0.85+i*(Math.PI*2/8);
      em(ctx,p,W/2+Math.cos(ang)*300,H/2-10+Math.sin(ang)*130,38,a*0.4);
    });
  }

  // ── Scene 8: Garden reveal 33.5-38.0s ────────────────────────────────────
  if (t >= 33.5) {
    const sa=prog(t,33.5,34.5);
    ctx.save(); ctx.globalAlpha=sa; ctx.fillStyle=C.mint; ctx.fillRect(0,0,W,H); ctx.restore();
    txt(ctx,"Your garden is ready! 🎉",W/2,78,44,C.green,true,"center",sa);
    txt(ctx,"AI-designed · Zone 6b · 12×12 ft · 6 varieties",W/2,138,22,C.gray,false,"center",sa*prog(t,34.0,34.8));
    const COLS=6,ROWS=6,CELL=122,gridW=COLS*CELL,gx=(W-gridW)/2,gy=172;
    ctx.save(); ctx.globalAlpha=sa; ctx.shadowColor="rgba(0,0,0,0.09)"; ctx.shadowBlur=26;
    rr(ctx,gx-18,gy-18,gridW+36,ROWS*CELL+36,18,C.white); ctx.restore();
    V4_ORDER.forEach(([r,c],idx)=>{
      const cA=prog(t,34.8+idx*0.04,34.8+idx*0.04+0.35);
      if(cA<=0) return;
      const cell=V4_GRID[r][c], cx=gx+c*CELL, cy=gy+r*CELL;
      ctx.save(); ctx.globalAlpha=cA;
      ctx.fillStyle=cell.bg; ctx.fillRect(cx+1,cy+1,CELL-2,CELL-2); ctx.restore();
      em(ctx,cell.em,cx+CELL/2,cy+CELL/2,52,cA);
    });
    ctx.save(); ctx.globalAlpha=sa*0.22; ctx.strokeStyle="#9ca3af"; ctx.lineWidth=1;
    for(let c=0;c<=COLS;c++){ctx.beginPath();ctx.moveTo(gx+c*CELL,gy);ctx.lineTo(gx+c*CELL,gy+ROWS*CELL);ctx.stroke();}
    for(let r=0;r<=ROWS;r++){ctx.beginPath();ctx.moveTo(gx,gy+r*CELL);ctx.lineTo(gx+gridW,gy+r*CELL);ctx.stroke();}
    ctx.restore();
    const legY=gy+ROWS*CELL+44, legA=prog(t,36.4,37.2);
    const legItems=[
      {em:"🍅",n:"Tomatoes",bg:"#bbf7d0"},{em:"🌶️",n:"Peppers",bg:"#fee2e2"},{em:"🌿",n:"Basil",bg:"#d1fae5"},
      {em:"🥕",n:"Carrots",bg:"#fef9c3"}, {em:"🥦",n:"Broccoli",bg:"#bbf7d0"},{em:"🌸",n:"Flowers",bg:"#fce7f3"},
    ];
    const legW=(W-120)/3;
    legItems.forEach((item,i)=>{
      const col=i%3, row=Math.floor(i/3), lx=60+col*(legW+20), ly=legY+row*66;
      const itemA=legA*progOut(t,36.4+i*0.08,37.4);
      ctx.save(); ctx.globalAlpha=itemA;
      rr(ctx,lx,ly,legW,56,10,item.bg);
      em(ctx,item.em,lx+34,ly+28,26,1);
      ctx.fillStyle="#374151"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.font='22px "Arial",sans-serif';
      ctx.fillText(item.n,lx+legW/2+18,ly+28);
      ctx.restore();
    });
    txt(ctx,"Try free at PlantersBlueprint.com",W/2,legY+148,36,C.green,true,"center",prog(t,37.8,38.0)*sa);
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
const V3_CFG: VideoConfig = { W: V1W, H: V1H, duration: 30, fps: 30 };
const V4_CFG: VideoConfig = { W: V1W, H: V1H, duration: 38, fps: 30 };

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
          <VideoCard
            title="Video 3 — Are You a Gardener? (Instagram 4:5)"
            desc="Hook-style ad for Instagram and Facebook. Opens with 'Are you a gardener? You need this tool', addresses pain points, then reveals the solution."
            drawFn={drawVideo3}
            cfg={V3_CFG}
            filename="planters-blueprint-gardener-hook.mp4"
          />
          <VideoCard
            title="Video 4 — Wizard Walkthrough (Instagram 4:5)"
            desc="Step-by-step walkthrough of the garden builder wizard — dimensions, zone, soil, sun, plant picker — then AI generates and reveals the final garden grid."
            drawFn={drawVideo4}
            cfg={V4_CFG}
            filename="planters-blueprint-wizard-walkthrough.mp4"
          />
        </div>
      </div>
    </div>
  );
}
