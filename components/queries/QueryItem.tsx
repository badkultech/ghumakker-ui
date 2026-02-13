"use client";

import { Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";

export default function QueryItem({ query, onView, onDelete }: any) {
  const isOpen = query.status === "OPEN";

  // calculate "n days open"
  const created = new Date(query.createdDate);
  const diff = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="w-full bg-white border rounded-xl p-5 shadow-sm flex flex-col gap-3">

      {/* Top row: Name + badges + date */}
      <div className="flex items-start justify-between w-full">
        {/* Left side */}
        <div>
          <div className="font-semibold text-[15px] text-gray-900">
            {query.userName}
          </div>

          <div className="flex items-center gap-2 mt-1">

            {/* Status badge */}
            {isOpen ? (
              <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                Open
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                Responded
              </span>
            )}

            {/* Days open badge */}
            {isOpen && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                {diff} days open
              </span>
            )}
          </div>

          {/* Trip name */}
          <div className="text-sm text-gray-500 mt-1">
            Trip: {query.tripName}
          </div>
        </div>

        {/* Right side date */}
        <div className="text-gray-500 text-sm whitespace-nowrap">
          {new Date(query.createdDate).toLocaleDateString("en-GB")}
        </div>
      </div>

      {/* Question */}
      <div
        className="text-sm leading-relaxed text-gray-700 break-words"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(query.question),
        }}
      />

      {/* Action buttons */}
      <div className="flex justify-end items-center gap-3 mt-3">

        <Button
          variant="outline"
          className="rounded-full px-4 flex items-center gap-1 text-gray-700 cursor-pointer"
          onClick={onView}
        >
          View
          <ChevronRight className="w-4 h-4" />
        </Button>

        <button
          onClick={onDelete}
          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
