"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

const frames = [
  "/compare_options/frame1.png",
  "/compare_options/frame2.png",
  "/compare_options/frame3.png",
  "/compare_options/frame4.png",
];

export default function CompareOptions() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % frames.length);
    }, 5000); // adjust speed (ms)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-auto rounded-2xl overflow-hidden">
      <div className="relative w-full aspect-[16/9] md:aspect-[4/3] overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={frames[index]}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{
              duration: 1.1,
              ease: [0.65, 0, 0.35, 1], // smooth figma-like ease
            }}
            className="absolute inset-0"
          >
            <Image
              src={frames[index]}
              alt={`Smart Animate frame ${index + 1}`}
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
