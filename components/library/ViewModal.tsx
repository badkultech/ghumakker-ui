"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  HomeIcon,
  Clock,
  Car,
  Route,
  UtensilsCrossed,
  PersonStanding,
  Banknote,
} from "lucide-react";
import { useMemo, useState } from "react";
import { FullImageGalleryModal } from "./FullImageGalleryModal";
import { mealTypeLabels } from "@/lib/services/organizer/trip/library/meal/types";
import { LazyImage } from "../ui/lazyImage";
import {
  ArrangedByTypeLabels,
  TransitTypeLabels,
} from "@/lib/services/organizer/trip/library/transit/types";
import { formatTime } from "@/lib/utils/timeUtils";

interface ViewModalProps {
  open: boolean;
  onClose: () => void;
  step: string;
  data?: any;
}

export function ViewModal({ open, onClose, step, data }: ViewModalProps) {
  const USE_LOCAL_FALLBACK = false; // 👈 toggle this to false when backend is ready

  const content = useMemo(() => {
    if (!USE_LOCAL_FALLBACK && data) return data;
  }, [data]);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const gallery = content?.documents || [];
  const mainImage = gallery[0]?.url;
  const smallImages = gallery.slice(1, 6);

  const returnStepContent = () => {
    switch (step) {
      case "day-description":
        return (
          <>
            <div className="w-full space-y-2">
              {/* Row 1: Location */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-6 h-5 text-gray-900" />
                  <h3 className="text-base font-normal text-gray-800">
                    Location
                  </h3>
                </div>

                <h3 className="font-semibold  text-gray-900 text-right truncate max-w-[60%] sm:max-w-none">
                  {content.location
                    ?.split(",")
                    .map((loc: string) => loc.trim())
                    .join(" | ")}
                </h3>
              </div>

              {/* Row 2: Time */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-6 h-5 text-gray-900" />
                  <h3 className="text-base font-normal text-gray-800">From</h3>
                </div>

                <h3 className="font-medium  text-gray-900">
                  {formatTime(content.time)}
                </h3>
              </div>
            </div>
          </>
        );
      case "stays":
        return (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <MapPin className="w-6 h-5 mr-2 text-gray-900" />
                <h3 className="text-base font-normal text-gray-800">
                  Location
                </h3>
              </div>
              <div className="flex items-center">
                <h3 className="font-medium text-[16px] text-gray-900">
                  {" "}
                  {content.location
                    ?.split(",")
                    .map((loc: string) => loc.trim())
                    .join(" | ")}
                </h3>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <HomeIcon className="w-6 h-5 mr-2 text-gray-900" />
                <h3 className="text-base font-normal text-gray-800">
                  Type of Sharing
                </h3>
              </div>
              <div className="flex items-center">
                <h3 className="font-medium text-[16px] text-gray-900">
                  {" "}
                  {content.sharingType}
                </h3>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="w-6 h-5 mr-2 text-gray-900" />
                <h3 className="text-base font-normal text-gray-800">From</h3>
              </div>
              <div className="flex items-center">
                <h3 className="font-medium text-[16px] text-gray-900">
                  {" "}
                  {formatTime(content.checkInTime)}
                </h3>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="w-6 h-5 mr-2 text-gray-900" />
                <h3 className="text-base font-normal text-gray-800">To</h3>
              </div>
              <div className="flex items-center">
                <h3 className="font-medium text-[16px] text-gray-900">
                  {" "}
                  {formatTime(content.checkOutTime)}
                </h3>
              </div>
            </div>
          </>
        );
      case "transit":
        return (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Car className="w-6 h-5 mr-2 text-gray-900" />
                <h3 className="text-base font-normal text-gray-800">Vehicle</h3>
              </div>

              <div className="flex items-center">
                <h3 className="font-medium text-[16px] text-gray-900">
                  {[
                    ...(Array.isArray(content.vehicleTypes)
                      ? content.vehicleTypes.map(
                        (v: string) => TransitTypeLabels[v] ?? v
                      )
                      : content.vehicleTypes
                        ? [
                          TransitTypeLabels[content.vehicleTypes] ??
                          content.vehicleTypes,
                        ]
                        : []),
                    content.customVehicleType,
                  ]
                    .filter(Boolean)
                    .join(" | ")}
                </h3>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="w-6 h-5 mr-2 text-gray-900" />
                <h3 className="text-base font-normal text-gray-800">
                  Departure
                </h3>
              </div>
              <div className="flex items-center">
                <h3 className="font-medium text-[16px] text-gray-900">
                  {content.fromLocation}
                  {"  |  "}
                  {formatTime(content.startTime)}
                </h3>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="w-6 h-5 mr-2 text-gray-900" />
                <h3 className="text-base font-normal text-gray-800">Arrival</h3>
              </div>
              <div className="flex items-center">
                <h3 className="font-medium text-[16px] text-gray-900">
                  {content.toLocation}
                  {"  |  "}
                  {formatTime(content.endTime)}
                </h3>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Route className="w-6 h-5 mr-2 text-gray-900" />
                <h3 className="text-base font-normal text-gray-800">
                  Mode of Arrangement
                </h3>
              </div>
              <div className="flex items-center">
                <h3 className="font-medium text-[16px] text-gray-900">
                  {" "}
                  {ArrangedByTypeLabels[content.arrangedBy]}
                </h3>
              </div>
            </div>
          </>
        );
      case "meals":
        return (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <MapPin className="w-6 h-5 mr-2 text-gray-900" />
                <h3 className="text-base font-normal text-gray-800">
                  Location
                </h3>
              </div>
              <div className="flex items-center">
                <h3 className="font-medium text-[16px] text-gray-900">
                  {" "}
                  {content.location
                    ?.split(",")
                    .map((loc: string) => loc.trim())
                    .join(" | ")}
                </h3>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <UtensilsCrossed className="w-6 h-5 mr-2 text-gray-900" />
                <h3 className="text-base font-normal text-gray-800">
                  Meal Type
                </h3>
              </div>
              <div className="flex items-center">
                {content.mealType !== undefined && (
                  <h3 className="font-medium text-[16px] text-gray-900">
                    {" "}
                    {mealTypeLabels[content.mealType]}
                  </h3>
                )}
              </div>
            </div>
            {/* 💰 Included / Chargeable */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Banknote className="w-6 h-5 mr-2 text-gray-900" />
                <h3 className="text-base font-normal text-gray-800">
                  Price Charge
                </h3>
              </div>
              <div className="flex items-center">
                <h3 className="font-medium text-[16px] text-gray-900">
                  {content.chargeable ? "Chargeable" : "Included"}
                </h3>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="w-6 h-5 mr-2 text-gray-900" />
                <h3 className="text-base font-normal text-gray-800">Time</h3>
              </div>
              <div className="flex items-center">
                <h3 className="font-medium text-[16px] text-gray-900">
                  {" "}
                  {formatTime(content.time)}
                </h3>
              </div>
            </div>
          </>
        );
      case "activity":
        return (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <PersonStanding className="w-6 h-5 mr-2 text-gray-900" />
                <h3 className="text-base font-normal text-gray-800">Moods</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {content.moodTags?.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="flex items-center gap-2 px-4 py-1 border border-orange-400 text-orange-500 rounded-full "
                  >
                    {/* Optional icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>

                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <MapPin className="w-6 h-5 mr-2 text-gray-900" />
                <h3 className="text-base font-normal text-gray-800">
                  Location
                </h3>
              </div>
              <div className="flex items-center">
                <h3 className="font-medium text-[16px] text-gray-900">
                  {" "}
                  {content.location
                    ?.split(",")
                    .map((loc: string) => loc.trim())
                    .join(" | ")}
                </h3>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Banknote className="w-6 h-5 mr-2 text-gray-900" />
                <h3 className="text-base font-normal text-gray-800">
                  Price Charge
                </h3>
              </div>
              <div className="flex items-center">
                <h3 className="font-medium text-[16px] text-gray-900">
                  {" "}
                  {content.priceCharge}
                </h3>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="w-6 h-5 mr-2 text-gray-900" />
                <h3 className="text-base font-normal text-gray-800">Time</h3>
              </div>
              <div className="flex items-center">
                <h3 className="font-medium text-[16px] text-gray-900">
                  {" "}
                  {formatTime(content.time)}
                </h3>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    content && (
      <>
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-2xl lg:max-w-2xl p-0 overflow-hidden rounded-2xl">
            <div className="max-h-[90vh] overflow-y-auto px-4 py-3 font-poppins">
              <DialogHeader>
                <DialogTitle className="text-lg md:text-lg font-[600] text-gray-900 px-1 pb-3">
                  {content.name}
                </DialogTitle>
              </DialogHeader>

              {/* Hero Image */}
              {mainImage ? (
                <LazyImage
                  src={mainImage}
                  alt={content?.name ?? "Image"}
                  width={800}
                  height={400}
                  className="w-full h-56 md:h-60 rounded-[12px] object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              {/* Small Images Row */}
              {smallImages.length > 0 && (
                <div
                  onClick={() => {
                    onClose(); // 👈 close outer modal
                    setTimeout(() => setGalleryOpen(true), 200); // open inner after a short delay
                  }}
                  className="flex gap-2 mt-2 mb-2"
                >
                  {smallImages.slice(0, 4).map((img: any, idx: number) => (
                    <div
                      key={idx}
                      className="relative w-[80px] h-[60px] sm:w-[130px] sm:h-[110px] rounded-md overflow-hidden"
                    >
                      <LazyImage
                        src={img.url}
                        alt={`Preview ${idx + 1}`}
                        width={100}
                        height={70}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}

                  {/* "+N more" Overlay */}
                  {gallery.length > 5 && (
                    <div
                      onClick={() => {
                        onClose(); // 👈 close outer modal
                        setTimeout(() => setGalleryOpen(true), 200); // open inner after a short delay
                      }}
                      className="relative w-[80px] h-[60px] sm:w-[130px] sm:h-[110px] rounded-md overflow-hidden bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition"
                    >
                      <span className="text-gray-800 font-medium ">
                        +{gallery.length - 5} more
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Text Content */}
              <div>
                {/* Use a block container and typography utilities so lists render with bullets/numbers */}
                <div
                  className="prose prose-sm max-w-none text-neutral-500 mt-4 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: content.description || "",
                  }}
                />

                <div className="flex justify-center flex-col text-neutral-500 w-full gap-y-5 mt-4 border-t border-b border-[#E4E4E4] py-3">
                  {returnStepContent()}
                </div>

                {/* Packing Suggestions */}
                {content.packingSuggestion && (
                  <div className="mt-6">
                    <h3 className="text-base font-semibold text-black mb-3">
                      Packing Suggestions
                    </h3>

                    {typeof content.packingSuggestion == "object" ? (
                      Object.entries(
                        content.packingSuggestion as Record<string, string[]>
                      ).map(([key, list]) => (
                        <div key={key} className="mb-4">
                          <p className="font-medium text-neutral-500 capitalize mb-1">
                            {key}
                          </p>
                          <ul className="list-disc pl-5 prose prose-sm text-neutral-500 space-y-1">
                            {list.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <>
                        <p
                          className="font-medium prose prose-sm text-neutral-500 capitalize"
                          dangerouslySetInnerHTML={{
                            __html: content.packingSuggestion || "",
                          }}
                        ></p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Fullscreen Gallery */}
        <FullImageGalleryModal
          open={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          images={gallery}
          title={content.name}
        />
      </>
    )
  );
}
