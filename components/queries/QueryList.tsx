"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import QueryItem from "./QueryItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

/**
 * Notes:
 * - Backend statuses are exact strings: "OPEN" | "RESPONDED"
 * - statusFilter uses "all" | "OPEN" | "RESPONDED"
 * - tab uses same shape: "all" | "OPEN" | "RESPONDED"
 */

export default function QueryList({
  queries = [],
  onViewQuery,
  onDelete,
}: any) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "OPEN" | "RESPONDED"
  >("all");
  const [tab, setTab] = useState<"all" | "OPEN" | "RESPONDED">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filtered = useMemo(() => {
    let out = (queries || []).slice();

    // Search: check question, userName, tripName (use fields that come from backend)
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((it: any) => {
        return (
          String(it.question ?? "")
            .toLowerCase()
            .includes(q) ||
          String(it.userName ?? "")
            .toLowerCase()
            .includes(q) ||
          String(it.tripName ?? "")
            .toLowerCase()
            .includes(q)
        );
      });
    }

    // Filtering: tab takes precedence (if not "all"), otherwise use statusFilter (if not "all")
    if (tab !== "all") {
      out = out.filter((it: any) => String(it.status) === String(tab));
    } else if (statusFilter !== "all") {
      out = out.filter((it: any) => String(it.status) === String(statusFilter));
    }

    // Sorting by date fallback fields - normalize to ISO parseable
    out.sort((a: any, b: any) => {
      const da = new Date(a.createdDate).getTime();
      const db = new Date(b.createdDate).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });

    return out;
  }, [queries, search, statusFilter, tab, sortOrder]);

  return (
    <div className="mt-6">
      {/* Search + controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* All Status dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center justify-between gap-2 border rounded-lg px-4 py-2 w-[150px]"
              >
                {statusFilter === "all"
                  ? "All Status"
                  : statusFilter === "OPEN"
                  ? "Open"
                  : "Responded"}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                { key: "all", label: "All Status" },
                { key: "OPEN", label: "Open" },
                { key: "RESPONDED", label: "Responded" },
              ].map((opt) => (
                <DropdownMenuItem
                  key={opt.key}
                  onClick={() => setStatusFilter(opt.key as any)}
                  className={`${
                    String(statusFilter) === String(opt.key)
                      ? "bg-orange-50 text-orange-600"
                      : ""
                  } cursor-pointer`}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort By dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center justify-between gap-2 border rounded-lg px-4 py-2 w-[160px]"
              >
                Sort By
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Sort Queries</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSortOrder("newest")}
                className={`${
                  sortOrder === "newest" ? "bg-orange-50 text-orange-600" : ""
                } cursor-pointer`}
              >
                Newest to Oldest
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOrder("oldest")}
                className={`${
                  sortOrder === "oldest" ? "bg-orange-50 text-orange-600" : ""
                } cursor-pointer`}
              >
                Oldest to Newest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs: All / Open / Responded */}
      <div className="flex gap-3 mt-4">
        {(["all", "OPEN", "RESPONDED"] as const).map((t) => {
          const isActive = String(tab) === String(t);
          return (
            <button
              key={t}
              onClick={() => {
                setTab(t as any);
                setStatusFilter("all"); // reset dropdown when tab is used
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                isActive
                  ? "bg-transparent border border-[#F97316] text-[#F97316]"
                  : "bg-white border text-gray-600"
              }`}
            >
              {t === "all"
                ? "All"
                : t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-4 mt-6">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No queries found.
          </div>
        ) : (
          filtered.map((q: any, idx: number) => (
            <QueryItem
              key={q.id ?? idx}
              query={q}
              onView={() => onViewQuery(q)}
              onDelete={() => onDelete(q)}
            />
          ))
        )}
      </div>
    </div>
  );
}
