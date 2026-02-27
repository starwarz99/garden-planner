"use client";

import { motion, AnimatePresence } from "framer-motion";

const PLANT_EMOJIS = ["🌱", "🌿", "🍅", "🥦", "🌻", "🌸", "🥕", "🌾", "🌺", "🍃"];

const messages = [
  "Analyzing your zone and conditions…",
  "Selecting companion plant pairs…",
  "Optimizing spatial layout…",
  "Planning seasonal care…",
  "Adding pollinator corridors…",
  "Finalizing your garden design…",
];

interface GeneratingOverlayProps {
  isVisible: boolean;
}

export function GeneratingOverlay({ isVisible }: GeneratingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-3xl p-10 max-w-sm w-full mx-4 text-center shadow-2xl"
          >
            {/* Animated plant circle */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              {PLANT_EMOJIS.map((emoji, i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                  animate={{
                    x: Math.cos((i / PLANT_EMOJIS.length) * Math.PI * 2) * 48 - 16,
                    y: Math.sin((i / PLANT_EMOJIS.length) * Math.PI * 2) * 48 - 16,
                    rotate: [0, 360],
                  }}
                  transition={{
                    rotate: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.3,
                    },
                    x: { duration: 0 },
                    y: { duration: 0 },
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
              <motion.div
                className="absolute inset-0 flex items-center justify-center text-4xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🌻
              </motion.div>
            </div>

            <h3 className="text-xl font-serif font-bold text-primary mb-2">
              Claude is designing your garden
            </h3>

            <AnimatingMessage messages={messages} />

            <div className="mt-6 flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AnimatingMessage({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);

  // Cycle through messages
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [messages]);

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-sm text-gray-600 h-5"
      >
        {messages[index]}
      </motion.p>
    </AnimatePresence>
  );
}

// Import at top-level (React hooks)
import { useState, useEffect } from "react";
