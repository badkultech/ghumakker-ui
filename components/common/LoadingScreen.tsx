"use client";
import React from "react";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Loading..." }) => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm"
      aria-live="assertive"
      aria-busy="true"
      role="alert"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"
          aria-hidden="true"
        />
        <p className="text-gray-700 text-lg font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
