"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface GardenCardProps {
  garden: {
    id: string;
    name: string;
    slug: string;
    widthFt: number;
    lengthFt: number;
    usdaZone: string;
    style: string;
    svgSnapshot?: string | null;
    createdAt: string;
  };
  onDelete: (id: string) => void;
}

export function GardenCard({ garden, onDelete }: GardenCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/gardens/${garden.id}`, { method: "DELETE" });
      if (res.ok) {
        onDelete(garden.id);
      }
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const area = Math.round(garden.widthFt * garden.lengthFt);
  const createdAt = new Date(garden.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card hover:shadow-lg transition-shadow group"
    >
      {/* Thumbnail */}
      <Link href={`/garden/${garden.id}`}>
        <div className="h-40 rounded-xl overflow-hidden mb-3 bg-mint border border-sage/20 flex items-center justify-center relative">
          {garden.svgSnapshot ? (
            <div
              dangerouslySetInnerHTML={{ __html: garden.svgSnapshot }}
              className="w-full h-full scale-50 origin-top-left pointer-events-none"
              style={{ width: "200%", height: "200%" }}
            />
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-1">🌱</div>
              <div className="text-xs">No preview</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      {/* Info */}
      <div>
        <Link href={`/garden/${garden.id}`}>
          <h3 className="font-serif font-bold text-gray-900 text-lg hover:text-primary transition-colors line-clamp-1">
            {garden.name}
          </h3>
        </Link>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          <Chip>{garden.widthFt}×{garden.lengthFt} ft</Chip>
          <Chip>{area} sq ft</Chip>
          <Chip>Zone {garden.usdaZone}</Chip>
          <Chip className="capitalize">{garden.style.replace("-", " ")}</Chip>
        </div>
        <div className="text-xs text-gray-400 mt-2">Created {createdAt}</div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Link
          href={`/garden/${garden.id}`}
          className="flex-1 py-2 text-center text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          View Garden
        </Link>
        {showConfirm ? (
          <div className="flex gap-1">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {isDeleting ? "…" : "Delete"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-2 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="px-3 py-2 text-xs border border-red-200 text-red-400 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            🗑
          </button>
        )}
      </div>
    </motion.div>
  );
}

function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full bg-mint text-gray-600 font-medium ${className}`}>
      {children}
    </span>
  );
}
