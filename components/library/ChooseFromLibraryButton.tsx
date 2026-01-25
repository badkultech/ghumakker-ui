"use client";

import React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  onClick: () => void;
  className?: string;
  align?: "left" | "right" | "center";
  disabled?: boolean;
};

export function ChooseFromLibraryButton({
  onClick,
  className = "",
  align = "right",
  disabled = false,
}: Props) {
  const alignmentClass =
    align === "right"
      ? "justify-end"
      : align === "center"
        ? "justify-center"
        : "justify-start";

  return (
    <div className={`flex ${alignmentClass}`}>
      <Button
        variant="outline"
        disabled={disabled}
        className={`text-brand-orange border-brand-orange hover:bg-brand-orange/10 ${className}`}
        onClick={onClick}
      >
        Choose from Library
      </Button>
    </div>
  );
}
