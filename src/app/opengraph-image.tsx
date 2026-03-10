import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Planters Blueprint — AI Garden Planner";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2d6a35 0%, #3d8a47 60%, #2d6a35 100%)",
          gap: 0,
        }}
      >
        {/* Decorative emojis */}
        {(["🍅", "🥦", "🌻", "🥕", "🌿", "🧅"] as const).map((e, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              fontSize: 64,
              opacity: 0.12,
              top: `${8 + (i * 14) % 75}%`,
              left: `${4 + (i * 17) % 90}%`,
              transform: `rotate(${i * 30}deg)`,
            }}
          >
            {e}
          </div>
        ))}

        {/* Seedling icon */}
        <div style={{ fontSize: 120, marginBottom: 24 }}>🌱</div>

        {/* Brand name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-1px",
            marginBottom: 16,
          }}
        >
          Planters Blueprint
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "rgba(255,255,255,0.80)",
            maxWidth: 800,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          AI-Powered Garden Planner &amp; Companion Planting Tool
        </div>

        {/* URL pill */}
        <div
          style={{
            marginTop: 40,
            padding: "10px 32px",
            background: "rgba(255,255,255,0.18)",
            borderRadius: 999,
            fontSize: 24,
            color: "rgba(255,255,255,0.90)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          plantersblueprint.com
        </div>
      </div>
    ),
    { ...size },
  );
}
