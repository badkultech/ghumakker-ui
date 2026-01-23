"use client";

import * as React from "react";
import {
  CalendarDays,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Check,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface Props {
  tab: string;

  // search
  search: string;
  setSearch: (v: string) => void;

  // status (backend TripStatus)
  statusFilter?: "PUBLISHED" | "UNDER_REVIEW" | "REQUIRES_MODIFICATION";
  setStatusFilter: (v: any) => void;

  // date range
  dateRange: { start?: string; end?: string };
  setDateRange: (v: any) => void;

  // sort
  sortBy: string;
  setSortBy: (v: string) => void;
  sortDir: "ASC" | "DESC";
  setSortDir: (v: "ASC" | "DESC") => void;

  loading?: boolean;
}

export default function TripFilterBar({
  tab,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
  loading,
}: Props) {
  const isUpcoming = tab === "upcoming";
  const isPast = tab === "past";

  const [calendarOpen, setCalendarOpen] = React.useState(false);

  // convert UI date → label
  const formattedRange =
    dateRange.start && dateRange.end
      ? `${format(new Date(dateRange.start), "dd MMM yyyy")} - ${format(
        new Date(dateRange.end),
        "dd MMM yyyy"
      )}`
      : "Date Range";

  /** ---------------- SORT OPTIONS (mapped to backend) ---------------- */
  const sortOptions: { label: string; sortBy: string; sortDir: "ASC" | "DESC" }[] =
    tab === "upcoming"
      ? [
        { label: "First to Last Trip", sortBy: "startDate", sortDir: "ASC" },
        { label: "Last to First Trip", sortBy: "startDate", sortDir: "DESC" },
      ]
      : tab === "past"
        ? [
          { label: "Most Viewed", sortBy: "views", sortDir: "DESC" },
          { label: "Recent First", sortBy: "startDate", sortDir: "DESC" },
        ]
        : [
          { label: "Newest to Oldest", sortBy: "createdAt", sortDir: "DESC" },
          { label: "Oldest to Newest", sortBy: "createdAt", sortDir: "ASC" },
        ];

  const currentSort = sortOptions.find(
    (s) => s.sortBy === sortBy && s.sortDir === sortDir
  )?.label;

  return (
    <div className="flex flex-wrap gap-3 items-center mt-4">
      {/* -------------------------------- SEARCH -------------------------------- */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search trips by name or destination..."
          className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-gray-300 focus:outline-none"
        />
      </div>

      {/* -------------------------------- DATE RANGE -------------------------------- */}
      {(isUpcoming || isPast) && (
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <CalendarDays size={16} />
              {formattedRange}
            </Button>
          </PopoverTrigger>

          <PopoverContent align="start" className="w-auto p-0">
            <div className="p-4">
              <Calendar
                mode="range"
                selected={
                  dateRange.start && dateRange.end
                    ? {
                      from: new Date(dateRange.start),
                      to: new Date(dateRange.end),
                    }
                    : undefined
                }
                onSelect={(range) => {
                  if (!range) {
                    setDateRange({ start: undefined, end: undefined });
                    return;
                  }

                  setDateRange({
                    start: range.from?.toISOString()?.slice(0, 10),
                    end: range.to?.toISOString()?.slice(0, 10),
                  });
                }}
              />

              <div className="flex justify-between mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-700 border-gray-300"
                  onClick={() => setDateRange({ start: undefined, end: undefined })}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => setCalendarOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* -------------------------------- STATUS FILTER (Upcoming only) -------------------------------- */}
      {isUpcoming && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal size={16} />
              {statusFilter ?? "All Status"}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setStatusFilter(undefined)}>
              All Status
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setStatusFilter("PUBLISHED")}>
              Published
              {statusFilter === "PUBLISHED" && (
                <Check className="w-4 h-4 text-primary ml-auto" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setStatusFilter("UNDER_REVIEW")}>
              Under Review
              {statusFilter === "UNDER_REVIEW" && (
                <Check className="w-4 h-4 text-primary ml-auto" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setStatusFilter("REQUIRES_MODIFICATION")}
            >
              Requires Modification
              {statusFilter === "REQUIRES_MODIFICATION" && (
                <Check className="w-4 h-4 text-primary ml-auto" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* -------------------------------- SORT BY -------------------------------- */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Sort By
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          {sortOptions.map((opt) => (
            <DropdownMenuItem
              key={opt.label}
              onClick={() => {
                setSortBy(opt.sortBy);
                setSortDir(opt.sortDir);
              }}
              className="flex items-center justify-between text-sm"
            >
              {opt.label}
              {currentSort === opt.label && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
