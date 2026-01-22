"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useParams } from "next/navigation";

interface LeadFiltersProps {
  onSearchChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
}

export function LeadFilters({
  onSearchChange,
  onStatusChange,
  onSortChange,
}: LeadFiltersProps) {
  const { tripId } = useParams(); // ✅ detect trip-specific context

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    onSearchChange?.(val);
  };

  const handleStatus = (value: string) => {
    setStatus(value.toUpperCase());
    onStatusChange?.(value.toUpperCase());
  };

  const handleSort = (value: string) => {
    setSortOrder(value);
    onSortChange?.(value);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6 items-center">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder={`Search ${tripId ? "trip leads" : "all leads"}`}
          value={search}
          onChange={handleSearch}
          className="w-full rounded-full border border-gray-200 bg-white shadow-sm h-9 sm:h-10 text-sm px-4 focus-visible:ring-1 focus-visible:ring-gray-300"
        />
      </div>

      {/* Status Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-between gap-2 border rounded-full px-4 py-2 w-[160px]"
          >
            {status === "all"
              ? "All Status"
              : status.charAt(0).toUpperCase() + status.slice(1)}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {["all", "open", "converted"].map((opt) => (
            <DropdownMenuItem
              key={opt}
              onClick={() => handleStatus(opt)}
              className={`${
                status === opt ? "bg-orange-50 text-orange-600" : ""
              } cursor-pointer`}
            >
              {opt === "all"
                ? "All Status"
                : opt.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-between gap-2 border rounded-full px-4 py-2 w-[160px]"
          >
            Sort By
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Sort Leads</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleSort("newest")}
            className={`${
              sortOrder === "newest" ? "bg-orange-50 text-orange-600" : ""
            } cursor-pointer`}
          >
            Newest to Oldest
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSort("oldest")}
            className={`${
              sortOrder === "oldest" ? "bg-orange-50 text-orange-600" : ""
            } cursor-pointer`}
          >
            Oldest to Newest
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
