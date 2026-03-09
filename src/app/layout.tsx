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

export const metadata: Metadata = {
  title: "Planters Blueprint — AI-Powered Companion Planting",
  description:
    "Answer 10 questions and AI designs your perfect personalized garden with companion planting, seasonal care, and zone-specific advice.",
  keywords: ["garden planner", "companion planting", "AI garden", "USDA zones"],
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
