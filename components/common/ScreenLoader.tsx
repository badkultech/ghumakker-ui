"use client";

export default function ScreenLoader() {
    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
            {/* Donut Loader */}
            <div
                className="w-14 h-14 rounded-full border-4 border-primary/30 border-t-primary animate-spin"
            />

            {/* Text */}
            <p className="mt-4 text-gray-600 text-sm tracking-wide">
                Almost there, stay with us...
            </p>
        </div>
    );
}
