"use client";

import { useEffect, useState, useCallback } from "react";
import { TripStepperHeader } from "@/components/create-trip/tripStepperHeader";
import { AppHeader } from "@/components/app-header";
import { DetailsOptions } from "@/components/create-trip/detailsOption/addDetails";
import { WizardFooter } from "@/components/create-trip/wizard-footer";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FileUploadCard } from "@/components/create-trip/file-upload-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CustomDateTimePicker } from "@/components/ui/date-time-picker";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";

import {
  useLazyGetItineraryByTripIdQuery,
  useUpdateItineraryMutation,
} from "@/lib/services/organizer/trip/itinerary";

import { useOrganizationId } from "@/hooks/useOrganizationId";

type Day = { day: number; date: string };
type TripItem = any;

export default function ItineraryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id: tripId } = useParams();

  const organizationId = useOrganizationId();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [days, setDays] = useState<Day[]>([]);
  const [showDetails, setShowDetails] = useState<boolean[]>([]);
  const [startingPoint, setStartingPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || new Date().toISOString()
  );
  const [endDate, setEndDate] = useState(
    searchParams.get("endDate") || new Date().toISOString()
  );
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [itineraryMeta, setItineraryMeta] = useState<any>(null);
  const [dayDetailIds, setDayDetailIds] = useState<Record<number, string>>(
    {}
  );
  const [dayItemsMap, setDayItemsMap] = useState<
    Record<number, TripItem[] | null>
  >({});

  const totalDaysParam = parseInt(searchParams.get("totalDays") || "1", 10);

  const [triggerGetItineraryByTripId] = useLazyGetItineraryByTripIdQuery();
  const [updateItinerary] = useUpdateItineraryMutation();
  const [isSavingNext, setIsSavingNext] = useState(false);
  const [errors, setErrors] = useState({
    startingPoint: "",
    endPoint: "",
  });
  const [saveDraftDisabled, setSaveDraftDisabled] = useState(false);

  useEffect(() => {
    setSaveDraftDisabled(false);
  }, [startingPoint, endPoint, startDate, endDate, pdfFile, dayItemsMap]);

  useEffect(() => {
    const fetch = async () => {
      if (!organizationId || !tripId) return;

      try {
        const itResp = await triggerGetItineraryByTripId({
          organizationId,
          tripPublicId: tripId as string,
        }).unwrap();

        const itData = (itResp as any) ?? {};
        const payload = itData.data ?? itData;
        setStartingPoint(payload.startPoint ?? "");
        setEndPoint(payload.endPoint ?? "");
        if (payload.startDate && payload.startTime) {
          setStartDate(`${payload.startDate}T${payload.startTime}`);
        }
        if (payload.endDate && payload.endTime) {
          setEndDate(`${payload.endDate}T${payload.endTime}`);
        }
        if (payload.itineraryPdfDocument) {
          const doc = payload.itineraryPdfDocument;

          setItineraryMeta({
            id: doc.id,
            type: doc.type ?? "application/pdf",
            url: doc.url ?? "",
            markedForDeletion: false,
          });
        }
        const totalDays = payload.totalDays ?? totalDaysParam ?? 1;
        const baseDateStr = payload.startDate ?? new Date().toISOString();
        const generatedDays: Day[] = Array.from({ length: totalDays }, (_, i) => {
          const d = new Date(baseDateStr);
          d.setDate(d.getDate() + i);
          return {
            day: i + 1,
            date: d.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
          };
        });
        setDays(generatedDays);


        setShowDetails(Array(generatedDays.length).fill(false));

        // If itinerary contains dayDetailResponseList -> map them
        const idsMap: Record<number, string> = {};
        (payload.dayDetailResponseList ?? []).forEach((d: any) => {
          if (d.dayNumber && d.id) idsMap[d.dayNumber] = String(d.id);
        });
        const ddData = payload.dayDetailResponseList ?? [];
        const map: Record<number, TripItem[] | null> = {};
        ddData.forEach((d: any) => {
          map[d.dayNumber] = Array.isArray(d.tripItems) ? d.tripItems : null;

          if (d.dayNumber && d.id && !idsMap[d.dayNumber]) {
            idsMap[d.dayNumber] = String(d.id);
          }
        });
        const initialShowDetails = generatedDays.map((day) => {
          const items = map[day.day];
          return Array.isArray(items) && items.length > 0;
        });

        setShowDetails(initialShowDetails);

        setDayItemsMap(map);
        setDayDetailIds((prev) => ({ ...prev, ...idsMap }));

        console.log("✅ itinerary & day-details loaded", { idsMap, map });
      } catch (err) {
        console.error("❌ Failed to fetch itinerary/day-details:", err);
      }
    };

    fetch();
  }, [organizationId, tripId]);

  const applyLocalChange = useCallback(
    (op: "create" | "update" | "delete", dayNumber: number, item: any) => {
      setDayItemsMap((prev) => {
        const copy = { ...(prev ?? {}) };
        const val = copy[dayNumber];
        const list: any[] = Array.isArray(val) ? [...val] : [];

        if (op === "create") {
          list.unshift(item);
        }

        if (op === "update") {
          const idx = list.findIndex(
            (x) => x.id === item.id || x.tripItemId === item.id
          );
          if (idx >= 0) {
            list[idx] = { ...list[idx], ...item };
          } else {
            list.unshift(item);
          }
        }

        if (op === "delete") {
          copy[dayNumber] = list.filter(
            (x) => x.id !== item.id && x.tripItemId !== item.id
          );
          return copy;
        }

        copy[dayNumber] = list;
        return copy;
      });
    },
    []
  );

  const handleAddDetailsClick = (idx: number) => {
    const copy = [...showDetails];
    copy[idx] = true;
    setShowDetails(copy);
  };

  const handlePrevClick = async () => {
    const orgId = localStorage.getItem("organizationId");
    if (tripId && orgId) {
    }
    router.push(`/organizer/create-trip/${tripId}`);
  };


  const formatTime = (date: Date) =>
    `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;


  const validateItinerary = () => {
    const newErrors: any = {};

    if (!startingPoint.trim()) {
      newErrors.startingPoint = "Starting Point is required";
    }

    if (!endPoint.trim()) {
      newErrors.endPoint = "End Point is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const clearFieldError = (field: "startingPoint" | "endPoint") => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };


  const handleUpdateItinerary = async (isDraft: boolean = false) => {
    if (!isDraft) {
      if (!validateItinerary()) return;
    }

    if (!organizationId || !tripId) return;

    try {
      if (!isDraft) setIsSavingNext(true);
      else setSaveDraftDisabled(true);

      const fd = new FormData();
      fd.append("startPoint", startingPoint);
      fd.append("endPoint", endPoint);
      fd.append("startDate", startDate.split("T")[0]);
      fd.append("endDate", endDate.split("T")[0]);
      fd.append("startTime", formatTime(new Date(startDate)));
      fd.append("endTime", formatTime(new Date(endDate)));

      // 👍 Your existing PDF logic (unchanged)
      if (pdfFile) {
        if (itineraryMeta?.id && itineraryMeta?.markedForDeletion) {
          fd.append("itineraryPdf.id", itineraryMeta.id?.toString() ?? "");
          fd.append("itineraryPdf.markedForDeletion", "true");
        }
        fd.append("itineraryPdf.id", "");
        fd.append("itineraryPdf.type", "PDF");
        fd.append("itineraryPdf.url", "");
        fd.append("itineraryPdf.file", pdfFile);
        fd.append("itineraryPdf.markedForDeletion", "false");
      }
      else if (itineraryMeta?.markedForDeletion) {
        fd.append("itineraryPdf.id", itineraryMeta.id?.toString() ?? "");
        fd.append("itineraryPdf.markedForDeletion", "true");
      }
      else if (itineraryMeta?.url) {
        fd.append("itineraryPdf.id", itineraryMeta.id?.toString() ?? "");
        fd.append("itineraryPdf.type", itineraryMeta.type ?? "PDF");
        fd.append("itineraryPdf.url", itineraryMeta.url ?? "");
        fd.append("itineraryPdf.markedForDeletion", "false");
      } else {
        fd.append("itineraryPdf.id", "");
      }

      await updateItinerary({
        organizationId,
        tripPublicId: tripId as string,
        data: fd as unknown as any,
      }).unwrap();

      if (!isDraft) {
        router.push(`/organizer/create-trip/${tripId}/exclusions`);
      }

    } catch (err) {
      console.error("❌ Failed:", err);
      if (isDraft) setSaveDraftDisabled(false);
    } finally {
      if (!isDraft) setIsSavingNext(false);
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <OrganizerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 w-full min-h-screen flex flex-col">
        <AppHeader title="Create New Trip" />
        <TripStepperHeader activeStep={2} />

        <div className="p-8 bg-white">
          <div className={isSavingNext ? "pointer-events-none opacity-50" : ""}>
            <div className="max-w-full mx-auto bg-white shadow rounded-2xl p-8 overflow-x-hidden">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Itinerary</h2>

              <FileUploadCard
                accept="application/pdf"
                maxSizeMB={10}
                initialMeta={itineraryMeta}
                buttonLabel={itineraryMeta?.url ? "Clear PDF" : "Choose PDF"}
                onSelect={(file) => {
                  if (!file) {

                    if (itineraryMeta?.id) {
                      setItineraryMeta({
                        ...itineraryMeta,
                        markedForDeletion: true,
                        url: "",
                      });
                    } else {
                      setItineraryMeta(null);
                    }

                    setPdfFile(null);
                    return;
                  }
                  setPdfFile(file);
                }}
              />


              {days.map((d, dayIdx) => {
                const itemsForDay = dayItemsMap[d.day] ?? null;
                return (
                  <div key={d.day} className="mb-4">
                    <div className="rounded-lg bg-orange-50 px-4 py-2 font-semibold text-orange-700 mb-2 text-[15px]">
                      Day {d.day} <span className="text-gray-400 font-normal ml-2">{d.date}</span>
                    </div>

                    {dayIdx === 0 && (
                      <div className="bg-gray-50 rounded-lg px-4 py-3 mb-2">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 flex flex-col">
                            <Label className="text-sm font-medium mb-1">Start Point *</Label>
                            <Input
                              type="text"
                              value={startingPoint}
                              onChange={(e) => {
                                setStartingPoint(e.target.value);
                                clearFieldError("startingPoint");
                              }}
                              placeholder="Enter starting location"
                              className="w-full"
                            />
                            <div className="h-4">
                              {errors.startingPoint && (
                                <p className="text-red-500 text-xs">{errors.startingPoint}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col">
                            <Label className="text-sm font-medium mb-1 opacity-0 select-none">
                              invisible label
                            </Label>
                            <div className="pointer-events-none opacity-60">
                              <CustomDateTimePicker
                                value={startDate}
                                onChange={setStartDate}
                                stepMinutes={15}
                                placeholder="Select start date & time"
                                className="w-full"
                              />
                            </div>

                            <div className="h-4"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {!showDetails[dayIdx] ? (
                      <button className="rounded-full px-5 py-1.5 mt-2 text-white bg-gradient-to-r from-orange-400 to-pink-500 font-medium shadow" onClick={() => handleAddDetailsClick(dayIdx)}>
                        + Add Details
                      </button>
                    ) : (
                      <>
                        {/* If dayDetailId exists -> show DetailsOptions with items passed down */}
                        {!dayDetailIds[d.day] ? (
                          <p className="text-gray-400 text-sm italic mt-2">⏳ Loading day details for Day {d.day}...</p>
                        ) : (
                          <DetailsOptions
                            key={dayDetailIds[d.day]}
                            organizationId={organizationId}
                            tripPublicId={tripId as string}
                            dayDetailId={dayDetailIds[d.day]}
                            items={itemsForDay ?? []}
                            onLocalChange={(op, item) => {
                              applyLocalChange(op, d.day, {
                                ...item,
                                dayNumber: d.day
                              });
                            }}

                          />
                        )}
                      </>
                    )}
                  </div>
                );
              })}

              <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col">
                  <label className="text-sm block mb-1 font-medium">End Point *</label>
                  <Input
                    type="text"
                    value={endPoint}
                    onChange={(e) => {
                      setEndPoint(e.target.value);
                      clearFieldError("endPoint");
                    }}
                    placeholder="Enter ending location"
                    className="w-full"
                  />
                  <div className="h-4">
                    {errors.endPoint && (
                      <p className="text-red-500 text-xs mt-1">{errors.endPoint}</p>
                    )}
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <label className="text-sm block mb-1 opacity-0 font-medium">End Date & Time</label>
                  <div className="pointer-events-none opacity-60">
                    <CustomDateTimePicker
                      value={endDate}
                      onChange={setEndDate}
                      stepMinutes={15}
                      placeholder="Select end date & time"
                      className="w-full"
                    />
                  </div>

                  <div className="h-4"></div>
                </div>
              </div>

            </div>
          </div>
          <div className="pr-9">
            <WizardFooter
              onPrev={handlePrevClick}
              onDraft={() => handleUpdateItinerary(true)}
              onNext={() => handleUpdateItinerary(false)}
              loading={isSavingNext}
              draftDisabled={saveDraftDisabled}
            />

          </div>
        </div>
      </div>
    </div>
  );
}
