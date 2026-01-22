// components/library/LibraryHeader.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/gradient-button";

type LibraryHeaderProps = {
  backHref?: string;
  title?: string;
  description?: string;
  hideBackBtn?: boolean;
  buttonLabel: string;
  onAddClick: () => void;

  // Controlled search props:
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  // optional: placeholder / width
  placeholder?: string;
  width?: string | number;
};

export function LibraryHeader({
  backHref = "/organizer/library",
  title = "ghumakker Library",
  description = "Manage your travel content and organize into custom collections",
  hideBackBtn = false,
  buttonLabel,
  onAddClick,
  searchValue = "",
  onSearchChange,
  placeholder = "Search your library...",
  width = 400,
}: LibraryHeaderProps) {
  // If parent doesn't provide onSearchChange, header still works as uncontrolled fallback
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) onSearchChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-[1.5rem]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Back + Title/Description */}
        <div className="flex items-start gap-4">
          <div className={`${hideBackBtn ? "hidden" : "block"}`}>
            <Link
              href={backHref}
              className="mr-4 p-2 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
          </div>

          <div>
            <h1 className="text-[1.4rem] font-bold text-gray-800">
              <strong>{title}</strong>
            </h1>

            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>

        {/* Add Button */}
        <GradientButton
          onClick={onAddClick}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {buttonLabel}
        </GradientButton>
      </div>

      {/* Search Bar */}
      <div className="relative mb-[2.5rem]" style={{ width }}>
        <Search className="absolute z-10 top-2.5 left-2" color="#757575" size={20} />
        <input
          aria-label="Library search"
          className="flex items-center justify-between w-full bg-[#f7f7f7] border border-gray-200 rounded-[12px] px-10 py-2 outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
