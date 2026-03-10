"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { GardenCard } from "@/components/garden/GardenCard";

interface Garden {
  id: string;
  name: string;
  slug: string;
  widthFt: number;
  lengthFt: number;
  usdaZone: string;
  style: string;
  svgSnapshot: string | null;
  isPublic: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface Props {
  initialGardens: Garden[];
  userName: string;
  maxGardens: number;
  planName: string;
}

export function DashboardClient({ initialGardens, userName, maxGardens, planName }: Props) {
  const [gardens, setGardens] = useState(
    initialGardens.map((g) => ({
      ...g,
      createdAt: g.createdAt instanceof Date ? g.createdAt.toISOString() : g.createdAt,
    }))
  );

  const handleDelete = (id: string) => {
    setGardens((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="min-h-screen bg-mint/20">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">
              🌱 {userName}&apos;s Gardens
            </h1>
            <p className="text-gray-600 mt-1">
              {gardens.length === 0
                ? "No gardens yet — create your first one!"
                : `${gardens.length} garden${gardens.length !== 1 ? "s" : ""} saved`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {planName.toLowerCase() !== "harvest" && (
              <Link
                href="/pricing"
                className="px-5 py-3 bg-white text-primary font-bold rounded-xl border-2 border-harvest hover:bg-harvest/10 transition-all flex items-center gap-2 shadow-sm"
              >
                ⬆ Upgrade
              </Link>
            )}
            {gardens.length < maxGardens ? (
              <Link
                href="/wizard"
                className="px-6 py-3 bg-harvest text-primary font-bold rounded-xl hover:bg-harvest/90 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>🌻</span> New Garden
              </Link>
            ) : (
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">
                  {planName} plan — {maxGardens}/{maxGardens} garden{maxGardens !== 1 ? "s" : ""} used
                </div>
                <div className="px-6 py-3 bg-gray-100 text-gray-400 font-bold rounded-xl border-2 border-dashed border-gray-300 flex items-center gap-2 text-sm cursor-not-allowed">
                  🔒 Garden limit reached
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Empty state */}
        {gardens.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🪴</div>
            <h2 className="text-2xl font-serif font-bold text-gray-700 mb-3">
              Your garden awaits
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Answer 10 quick questions and AI will design a personalized,
              companion-planting optimized garden layout just for you.
            </p>
            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all text-lg"
            >
              <span>✨</span> Plan My First Garden
            </Link>
          </motion.div>
        )}

        {/* Gardens grid */}
        {gardens.length > 0 && (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {gardens.map((garden) => (
                <GardenCard
                  key={garden.id}
                  garden={garden}
                  onDelete={handleDelete}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
