"use client"

import { X } from "lucide-react";

export function FilterTags({ filters, onRemove }: {
  filters: { id: number; label: string }[];
  onRemove: (id: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((filter) => (
        <span
          key={filter.id}
          className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-[#e5e3e0] rounded-full text-xs font-medium text-[#4d4d4d]"
        >
          {filter.label}
          <button onClick={() => onRemove(filter.id)} className="hover:text-[#e07a5f]">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
