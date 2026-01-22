"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // for loading state
import { useGetOrganizerFaqsQuery } from "@/lib/services/organizer/trip/library/faq";
import { useGetOrganizerTransitsQuery } from "@/lib/services/organizer/trip/library/transit";
import { useGetGroupLeadersQuery } from "@/lib/services/organizer/trip/library/leader";
import { useGetStaysQuery } from "@/lib/services/organizer/trip/library/stay";
import { useGetMealsQuery } from "@/lib/services/organizer/trip/library/meal";
import { useGetActivitiesQuery } from "@/lib/services/organizer/trip/library/activity";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useGetDayDescriptionsQuery } from "@/lib/services/organizer/trip/library/day-description";
import { LazyImage } from "../ui/lazyImage";

export type LibraryItem = {
  id: string;
  title: string;
  location?: string;
  description?: string;
  image?: string;
  answer?: string;
  imageUrl?: string;
  profileImageUrl?: string;
  tagline?: string;
  name?: string;
};

type Category =
  | "day-description"
  | "stays"
  | "transit"
  | "meals"
  | "activities"
  | "trip-leaders"
  | "faqs";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (item: LibraryItem) => void;
  category: Category;
};

export function LibrarySelectModal({
  open,
  onClose,
  onSelect,
  category,
}: Props) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");

  const organizationId = useOrganizationId();

  const shouldSkip = !organizationId || !open;

  const {
    data: itemsData,
    isLoading,
    isError,
  } = category === "faqs"
      ? useGetOrganizerFaqsQuery(
        { organizationId },
        { skip: shouldSkip, refetchOnMountOrArgChange: true }
      )
      : category === "transit"
        ? useGetOrganizerTransitsQuery(
          { organizationId },
          { skip: shouldSkip, refetchOnMountOrArgChange: true }
        )
        : category === "trip-leaders"
          ? useGetGroupLeadersQuery(organizationId ?? "", {
            skip: shouldSkip,
            refetchOnMountOrArgChange: true,
          })
          : category === "stays"
            ? useGetStaysQuery(organizationId ?? "", {
              skip: shouldSkip,
              refetchOnMountOrArgChange: true,
            })
            : category === "meals"
              ? useGetMealsQuery(organizationId ?? "", {
                skip: shouldSkip,
                refetchOnMountOrArgChange: true,
              })
              : category === "activities"
                ? useGetActivitiesQuery(organizationId ?? "", {
                  skip: shouldSkip,
                  refetchOnMountOrArgChange: true,
                })
                : category === "day-description"
                  ? useGetDayDescriptionsQuery(organizationId ?? "", {
                    skip: shouldSkip,
                    refetchOnMountOrArgChange: true,
                  })
                  : { data: [], isLoading: false, isError: false };

  const items: LibraryItem[] =
    itemsData?.map((item: any) => ({
      id: item.id?.toString(),
      title: item.title || item.name || "Untitled",
      answer: item.answer,
      location: item.location || item.city || "",
      description: item.description || item.details || "",
      image: item?.documents[0]?.url || item.photo || "",
    })) ?? [];

  // 🔍 Search filter
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = () => {
    const item = items.find((i) => i.id === selected);
    if (item) {
      onSelect(item);
      onClose();
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* DialogContent: constrained height + flex column so footer stays visible */}
      <DialogContent className="w-full max-w-2xl sm:rounded-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col p-0">
        {/* HEADER + SEARCH (not sticky now — layout handles scroll) */}
        <div className="px-4 pt-4 pb-3 bg-white/95 dark:bg-slate-900/95 border-b border-gray-200 z-20">
          <DialogHeader>
            <DialogTitle>Add from Library</DialogTitle>
          </DialogHeader>

          <div className="mt-3">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* SCROLLABLE LIST: flex-1 so it takes remaining space and scrolls */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          )}

          {/* Error */}
          {isError && <p className="text-sm text-red-500">Failed to load items</p>}

          {/* Items */}
          {!isLoading && !isError && (
            <>
              {category === "trip-leaders" ? (
                <div className="flex flex-col gap-4">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelected(item.id)}
                      onDoubleClick={() => {
                        setSelected(item.id);
                        onSelect(item);
                        onClose();
                      }}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${selected === item.id
                        ? "border-orange-500 shadow"
                        : "border-gray-200 hover:border-orange-400"
                        }`}
                    >
                      <LazyImage
                        src={item.image || "/default-avatar.png"}
                        alt={item.title}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{item.title}</div>
                        {item.description && (
                          <div className="text-sm text-gray-600">"{item.description}"</div>
                        )}
                        {item.answer && (
                          <div className="text-sm text-gray-600">"{item.answer}"</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelected(item.id)}
                      onDoubleClick={() => {
                        setSelected(item.id);
                        onSelect(item);
                        onClose();
                      }}
                      className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition ${selected === item.id
                        ? "border-orange-500 shadow"
                        : "border-gray-200 hover:border-orange-400"
                        }`}
                    >
                      <div className="font-medium text-gray-900">{item.title}</div>
                      {item.location && <div className="text-sm text-gray-600">{item.location}</div>}
                      {item.description && (
                        <div className="text-xs text-gray-500 line-clamp-2">
                          <div
                            className="prose prose-sm text-gray-500"
                            dangerouslySetInnerHTML={{ __html: item.description }}
                          />
                        </div>
                      )}
                      {item.answer && (
                        <div className="text-xs text-gray-500 line-clamp-2">
                          <div
                            className="prose prose-sm text-gray-500"
                            dangerouslySetInnerHTML={{ __html: item.answer }}
                          />
                        </div>
                      )}
                    </button>
                  ))}
                  {filteredItems.length === 0 && <p className="text-sm text-gray-500">No items found</p>}
                </div>
              )}
            </>
          )}

          {/* small spacer so final item doesn't butt up to footer */}
          <div className="h-4" />
        </div>

        {/* FOOTER — outside the scroll area so it remains visible */}
        <DialogFooter className="px-4 py-3 border-t bg-white">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-full px-6">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSelect}
            disabled={!selected}
            className="rounded-full px-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white"
          >
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}