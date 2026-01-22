"use client";

import { useEffect, useRef } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { FilterTags } from "./filter-tags";

export function DesktopFilterBar({
  filters,
  onRemove,
  onClear,
  onToggleFilters,
  onToggleSort,
  showSortDropdown,
  onSortSelect,
  selectedSortLabel,
}: any) {

  const dropdownRef = useRef(null);

  // --- OUTSIDE CLICK CLOSE ---
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(e.target)
      ) {
        onToggleSort(false);
      }
    }

    if (showSortDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSortDropdown]);

  return (
    <div className="hidden md:block border-b bg-white relative">
      <div className="flex items-center gap-4 px-8 py-3 max-w-[1400px] mx-auto">

        {/* Advanced Filters */}
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Advanced Filters
        </button>

        {/* Sort By */}
        <button
          onClick={() => {
            if (window.innerWidth >= 768) {  // Only Desktop
              onToggleSort(!showSortDropdown);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"
        >
          {selectedSortLabel || "Sort"}
          <ChevronDown className="w-4 h-4" />
        </button>


        {/* SORT DROPDOWN */}
        {showSortDropdown && (
          <div
            ref={dropdownRef}
            className="absolute mt-32 ml-[180px] bg-white shadow-xl rounded-2xl py-3 w-60 z-50 border"
          >
            <button
              onClick={() => onSortSelect("price_low")}
              className="w-full text-left px-5 py-2.5 text-sm hover:bg-gray-100"
            >
              Price Per Day: Lowest
            </button>

            <button
              onClick={() => onSortSelect("price_high")}
              className="w-full text-left px-5 py-2.5 text-sm hover:bg-gray-100"
            >
              Price Per Day: Highest
            </button>

            <button
              onClick={() => onSortSelect("discount")}
              className="w-full text-left px-5 py-2.5 text-sm hover:bg-gray-100"
            >
              Biggest Discount
            </button>

            <button
              onClick={() => onSortSelect("popularity")}
              className="w-full text-left px-5 py-2.5 text-sm hover:bg-gray-100"
            >
              Popularity
            </button>
          </div>
        )}

        {/* Filter Tags */}
        <div className="flex-1 flex items-center justify-between bg-[#fff6f2] rounded-xl px-4 py-3">

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-[#6b6b6b]">Showing results for:</span>
            <FilterTags filters={filters} onRemove={onRemove} />
          </div>

          {filters.length > 0 && (
            <button onClick={onClear} className="text-xs font-medium text-[#e07a5f]">
              Clear all filters
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
