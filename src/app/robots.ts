import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/dashboard",
          "/wizard",
          "/wizard/result",
          "/account",
          "/garden/",
          "/promo-videos",
          "/icon-download",
        ],
      },
    ],
    sitemap: "https://www.plantersblueprint.com/sitemap.xml",
  };
}
