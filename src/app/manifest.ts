import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Planters Blueprint",
    short_name: "Planters Blueprint",
    description:
      "AI-powered garden planner with companion planting, zone-aware layouts, and seasonal care calendars.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2d6a35",
    icons: [
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
