"use client";

import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/slices/store";
import { useRouter } from "next/navigation";
import { removeFromCompare, clearCompare } from "@/lib/slices/compareSlice";
import { X } from "lucide-react";
import { useState } from "react";

export function FloatingCompareBadge() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const items = useSelector(
        (state: RootState) => state.compare.items
    );

    if (items.length === 0) return null;

    return (
        <div
            className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex items-center gap-3"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {open && (
                <div
                    className="
            absolute bottom-full mb-0 left-1/2 -translate-x-1/2 
            pb-4 
            cursor-default
          "
                >
                    <div className="bg-white rounded-xl shadow-xl border p-3 flex gap-3">
                        {/* Trip Images */}
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="relative w-16 h-16 rounded-lg overflow-hidden border shrink-0"
                            >
                                <Image
                                    src={item.image}
                                    alt="trip"
                                    fill
                                    className="object-cover"
                                />

                                {/* ❌ REMOVE SINGLE ITEM */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(removeFromCompare(item.id));
                                    }}
                                    className="
                  absolute 
                  top-0.5 right-0.5
                  w-5 h-5 rounded-full
                  bg-black/50 hover:bg-black text-white
                  flex items-center justify-center
                  backdrop-blur-[1px]
                  transition-colors
                "
                                >
                                    <X size={12} strokeWidth={3} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Clear All Button - Separate from popup, shows on hover */}
            {open && (
                <button
                    onClick={() => {
                        dispatch(clearCompare());
                        setOpen(false);
                    }}
                    className="
                        px-3 py-2 
                        bg-white text-red-600 
                        rounded-full 
                        shadow-lg 
                        hover:bg-red-50 
                        transition
                        text-xs font-medium
                        border border-red-200
                    "
                >
                    Clear All
                </button>
            )}

            {/* 🔥 MAIN COMPARE BUTTON */}
            <button
                onClick={() => router.push("/home/compare-trips")}
                className="
          flex items-center gap-2
          bg-[#FF804C] text-white
          px-5 py-3 rounded-full
          shadow-lg hover:opacity-90
          transition
        "
            >
                <svg
                    width="16"
                    height="19"
                    viewBox="0 0 16 19"
                    fill="none"
                >
                    <path
                        d="M8.5 2.66667H2.66667C2.22464 2.66667 1.80072 2.84226 1.48816 3.15482C1.17559 3.46738 1 3.89131 1 4.33333V14.3333C1 14.7754 1.17559 15.1993 1.48816 15.5118C1.80072 15.8244 2.22464 16 2.66667 16H8.5M11.8333 2.66667H12.6667C13.1087 2.66667 13.5326 2.84226 13.8452 3.15482C14.1577 3.46738 14.3333 3.89131 14.3333 4.33333V5.16667M14.3333 13.5V14.3333C14.3333 14.7754 14.1577 15.1993 13.8452 15.5118C13.5326 15.8244 13.1087 16 12.6667 16H11.8333M14.3333 8.5V10.1667M7.66667 1V17.6667"
                        stroke="white"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <span className="font-medium">
                    Compare {items.length.toString().padStart(2, "0")}
                </span>
            </button>
        </div>
    );
}
