import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: {
    absolute: "Planters Blueprint — AI Garden Planner & Companion Planting Tool",
  },
  description:
    "Planters Blueprint uses AI to design personalized vegetable garden layouts with companion planting, USDA zone-aware plant selection, and a 12-month care calendar. Free to start.",
  alternates: {
    canonical: "https://www.plantersblueprint.com",
  },
  openGraph: {
    title: "Planters Blueprint — AI Garden Planner & Companion Planting Tool",
    description:
      "Planters Blueprint uses AI to design personalized vegetable garden layouts with companion planting, USDA zone-aware plant selection, and a 12-month care calendar. Free to start.",
    url: "https://www.plantersblueprint.com",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Planters Blueprint",
  url: "https://www.plantersblueprint.com",
  description:
    "AI-powered garden planner with companion planting, USDA zone support, and seasonal care calendars.",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: [
    { "@type": "Offer", name: "Seedling", price: "0", priceCurrency: "USD" },
    {
      "@type": "Offer",
      name: "Grower",
      price: "5.99",
      priceCurrency: "USD",
      description: "Up to 3 gardens, 40×40 ft, regenerate designs",
    },
    {
      "@type": "Offer",
      name: "Harvest",
      price: "9.99",
      priceCurrency: "USD",
      description: "Up to 5 gardens, 60×60 ft, 12-month care calendar",
    },
  ],
};

const features = [
  {
    emoji: "🤖",
    title: "AI-Powered Design",
    description: "AI creates an intelligent layout using companion planting science and your specific conditions.",
  },
  {
    emoji: "🗺️",
    title: "Interactive Garden Map",
    description: "See your garden as an SVG grid with color-coded zones, plant emojis, and hover-to-identify details.",
  },
  {
    emoji: "🌡️",
    title: "Zone-Aware Planning",
    description: "All 26 USDA hardiness zones supported. AI picks plants that will actually survive your winters.",
  },
  {
    emoji: "🌿",
    title: "Companion Planting",
    description: "Good neighbors placed together, bad ones kept apart. Science-backed pairing for pest control and yield.",
  },
  {
    emoji: "📅",
    title: "12-Month Care Calendar",
    description: "Month-by-month tasks tailored to your zone, plants, and experience level.",
  },
  {
    emoji: "💾",
    title: "Save & Compare",
    description: "Save garden designs, revisit them any time, and iterate until perfect.",
  },
];

const steps = [
  { num: "1", label: "Answer 10 questions", desc: "Size, zone, soil, sun, style, plants, goals" },
  { num: "2", label: "AI designs it", desc: "AI generates an optimized companion-planting layout" },
  { num: "3", label: "View your garden map", desc: "Interactive SVG with zones, plants, and care calendar" },
  { num: "4", label: "Save & grow!", desc: "Keep multiple designs, revisit, and plan your season" },
];

export default async function HomePage() {
  const session = await auth();

  let hasGardens = false;
  if (session?.user?.id) {
    const count = await prisma.garden.count({ where: { userId: session.user.id } });
    hasGardens = count > 0;
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-primary/80 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {["🌱", "🍅", "🌻", "🥦", "🌿", "🥕", "🌸", "🧅"].map((emoji, i) => (
            <span
              key={i}
              className="absolute text-4xl select-none"
              style={{
                top: `${10 + (i * 11) % 80}%`,
                left: `${5 + (i * 13) % 90}%`,
                transform: `rotate(${i * 45}deg)`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-6">
            <span>✨</span> Powered by AI
          </div>
          <h1 className="text-5xl sm:text-6xl font-serif font-bold leading-tight mb-6">
            Your perfect garden,<br className="hidden sm:block" />
            designed by AI
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Answer 10 questions about your garden space. AI creates a personalized,
            companion-planting optimized layout with a seasonal care calendar — all for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={hasGardens ? "/dashboard" : session ? "/wizard" : "/auth/register"}
              className="px-8 py-4 bg-harvest text-primary font-bold rounded-2xl hover:bg-harvest/90 shadow-xl hover:shadow-2xl transition-all text-lg"
            >
              {hasGardens ? "🌿 View My Gardens" : "🌻 Plan My Garden Free"}
            </Link>
            {!session && (
              <Link
                href="/auth/signin"
                className="px-8 py-4 bg-white/20 backdrop-blur border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/30 transition-all text-lg"
              >
                Sign In
              </Link>
            )}
          </div>
          <p className="text-sm text-white/60 mt-4">
            No credit card · No ads · Just your garden
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white/60">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center text-primary mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-white font-serif font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{step.label}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center text-primary mb-12">
            Everything you need to grow
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{f.emoji}</div>
                <h3 className="font-serif font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🌱</div>
          <h2 className="text-4xl font-serif font-bold text-primary mb-4">
            Ready to start planting?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of gardeners using AI to grow more, stress less.
          </p>
          <Link
            href={hasGardens ? "/dashboard" : session ? "/wizard" : "/auth/register"}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all text-lg"
          >
            <span>{hasGardens ? "🌿" : "✨"}</span>
            {hasGardens ? "My Gardens" : session ? "Create a New Garden" : "Get Started Free"}
          </Link>
        </div>
      </section>
    </div>
  );
}
