import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { getPlantIconOverrides } from "@/lib/plant-icons";
import { IconOverridesProvider } from "@/contexts/IconOverridesContext";
import { VisitTracker } from "@/components/VisitTracker";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const BASE = "https://www.plantersblueprint.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Planters Blueprint — AI Garden Planner",
    template: "%s | Planters Blueprint",
  },
  description:
    "Answer 10 questions and AI designs your perfect personalized garden with companion planting, seasonal care, and zone-specific advice. Free to start.",
  keywords: [
    "garden planner",
    "companion planting",
    "AI garden planner",
    "USDA hardiness zones",
    "vegetable garden layout",
    "raised bed planner",
    "plant spacing",
    "seasonal care calendar",
  ],
  openGraph: {
    type: "website",
    siteName: "Planters Blueprint",
    url: BASE,
    title: "Planters Blueprint — AI Garden Planner",
    description:
      "Answer 10 questions and AI designs your perfect personalized garden with companion planting, seasonal care, and zone-specific advice.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Planters Blueprint — AI Garden Planner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Planters Blueprint — AI Garden Planner",
    description:
      "Answer 10 questions and AI designs your perfect personalized garden with companion planting, seasonal care, and zone-specific advice.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: BASE,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const overrides = await getPlantIconOverrides();

  return (
    <html lang="en" className={`${lora.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <SessionProvider>
          <IconOverridesProvider overrides={overrides}>
            <VisitTracker />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </IconOverridesProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
