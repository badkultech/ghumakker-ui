"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FullImageGalleryModalProps {
  open: boolean;
  onClose: () => void;
  images: { url: string }[];
  title?: string;
}

export function FullImageGalleryModal({
  open,
  onClose,
  images,
  title,
}: FullImageGalleryModalProps) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Only runs in browser
    if (typeof document !== "undefined") {
      setPortalTarget(document.body);
    }
    setMounted(true);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  // ✅ Keyboard navigation with window guard
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") onClose();
    };

    if (open) {
      window.addEventListener("keydown", handleKey);
    }
    return () => {
      if (open) window.removeEventListener("keydown", handleKey);
    };
  }, [open, images.length]);

  if (!mounted || !open || !images?.length || !portalTarget) return null;

  const currentImage = images[currentIndex]?.url;

  // ✅ Only render portal once document.body is available
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center"
      style={{ overscrollBehavior: "none" }}
    >
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
        <h2 className="text-white text-base sm:text-lg font-medium truncate max-w-[80%]">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Image viewer */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Image
              src={currentImage}
              alt={`Gallery image ${currentIndex + 1}`}
              width={1600}
              height={900}
              className="object-contain max-h-[85vh] w-auto"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-black/40 p-2 sm:p-3 rounded-full text-white hover:bg-black/60 transition"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-black/40 p-2 sm:p-3 rounded-full text-white hover:bg-black/60 transition"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </>
        )}
      </div>

      {/* Counter */}
      <div className="absolute bottom-4 text-sm text-white bg-black/50 px-3 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>
    </div>,
    portalTarget
  );
}
