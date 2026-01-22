"use client"

import { AdvancedFilters } from "./advanced-filters";

export function DesktopFilterSidebar({ isOpen, onClose, onApply }: any) {
  if (!isOpen) return null;

  return (
    <aside className="hidden md:block w-72 flex-shrink-0">
      <AdvancedFilters
        isOpen={isOpen}
        onClose={onClose}
        onApplyFilters={onApply}
      />
    </aside>
  );
}
