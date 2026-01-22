"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

interface AddCircleProps {
  href: string;
  size?: number; // optional: outer circle size in px
}

export function AddCircle({ href, size = 64 }: AddCircleProps) {
  const innerSize = size * 0.5;
  const plusSize = size * 0.35;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Outer Circle */}
      <div className="absolute inset-0 rounded-full border-2 border-gray-300 flex items-center justify-center">
        <div
          className="rounded-full bg-gray-300"
          style={{ width: innerSize, height: innerSize }}
        />
      </div>

      {/* Plus Icon */}
      <Link
        href={href}
        className="absolute bottom-0 right-0 bg-black rounded-full flex items-center justify-center border-2 border-white shadow-md"
        style={{
          width: plusSize * 0.8,
          height: plusSize * 0.8,
        }}
      >
        <Plus
          className="text-white"
          style={{
            width: plusSize * 0.45,
            height: plusSize * 0.45,
          }}
        />
      </Link>
    </div>
  );
}
