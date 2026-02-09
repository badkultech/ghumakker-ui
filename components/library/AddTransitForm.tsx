"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/gradient-button";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";
import { showSuccess, showApiError } from "@/lib/utils/toastHelpers";
import { MultiUploader } from "../common/UploadFieldShortcuts";
import { TimePicker15Min } from "@/components/ui/time-picker-15min";
import {
  useDocumentsManager,
  Document as DocShape,
} from "@/hooks/useDocumentsManager";
import { useLazyGetOrganizerTransitByIdQuery } from "@/lib/services/organizer/trip/library/transit";
import RequiredStar from "../common/RequiredStar";
import { validateRequiredFields } from "@/lib/utils/validateRequiredFields";
import { useOrganizationId } from "@/hooks/useOrganizationId";

type AddTransitFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any, documents?: DocShape[]) => void;
  header?: string;
  initialData?: any;
  onLibrarySelect?: (item: any) => void;
};

const VEHICLES = [
  { label: "Traveler Van", value: "TRAVELER_VAN" },
  { label: "Car", value: "CAR" },
  { label: "Motorbike", value: "MOTORBIKE" },
  { label: "Cruise", value: "CRUISE" },
  { label: "Airplane", value: "AIRPLANE" },
  { label: "Train", value: "TRAIN" },
  { label: "Bus", value: "BUS" },
];

export function AddTransitForm({
  mode = "trip",
  onCancel,
  onSave,
  header,
  initialData,
}: AddTransitFormProps) {
  const docsManager = useDocumentsManager(initialData?.documents ?? [], 6);
  const [title, setTitle] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [vehicle, setVehicle] = useState<string[]>([]);
  const [customVehicleType, setCustomVehicleType] = useState("");
  const [arrangement, setArrangement] = useState<"ORGANIZER" | "SELF">(
    "ORGANIZER"
  );
  const [description, setDescription] = useState("");
  const [packingSuggestion, setPackingSuggestion] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saveInLibrary, setSaveInLibrary] = useState(false);
  const [getTransitByIdTrigger] = useLazyGetOrganizerTransitByIdQuery();
  const [isSaving, setIsSaving] = useState(false);
  const organizationId = useOrganizationId();
  const [isLibraryLoading, setIsLibraryLoading] = useState(false);
  const [fromLibrary, setFromLibrary] = useState(false);

  async function urlToFile(url: string, filename = "library_image.jpg") {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  }

  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.name ?? initialData.title ?? "");
    setFrom(initialData.fromLocation ?? initialData.from ?? "");
    setTo(initialData.toLocation ?? initialData.to ?? "");

    const normalizeTime = (t: any) => {
      if (Array.isArray(t) && t.length >= 2) {
        const hh = String(t[0]).padStart(2, "0");
        const mm = String(t[1]).padStart(2, "0");
        return `${hh}:${mm}`;
      }
      if (typeof t === "string") {
        return t.length > 5 ? t.slice(0, 5) : t;
      }
      return t || "";
    };

    setDeparture(
      normalizeTime(initialData.startTime ?? initialData.departure ?? "")
    );
    setArrival(normalizeTime(initialData.endTime ?? initialData.arrival ?? ""));
    setDescription(initialData.description ?? "");
    setPackingSuggestion(initialData.packingSuggestion ?? "");
    setVehicle(
      Array.isArray(initialData.vehicleTypes)
        ? initialData.vehicleTypes
        : initialData.vehicleType
          ? [initialData.vehicleType]
          : []
    );
    setCustomVehicleType(initialData.customVehicleType ?? "");
    setArrangement(
      (initialData.arrangedBy ?? "").toString().toUpperCase() === "SELF"
        ? "SELF"
        : "ORGANIZER"
    );

    setSaveInLibrary(!!initialData.addedToLibrary);
    const mappedDocs = (
      Array.isArray(initialData.documents) ? initialData.documents : []
    ).map((d: any) => ({
      id: d.id ?? null,
      url: d.url ?? d.fileUrl ?? d.path ?? d.s3Url ?? null,
      type: d.type ?? "IMAGE",
      file: null,
      markedForDeletion: !!d.markedForDeletion,
    }));

    if (typeof docsManager.resetDocuments === "function") {
      docsManager.resetDocuments();
    } else if (typeof docsManager.setDocuments === "function") {
      docsManager.setDocuments(mappedDocs);
    } else {
      docsManager.documents = mappedDocs;
    }
  }, [initialData?.id, initialData]);

  const toggleVehicle = (v: string) => {
    setVehicle((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const handleLibrarySelect = async (item: any) => {
    if (!item.id) return;
    setIsLibraryLoading(true);
    setFromLibrary(true);
    setSaveInLibrary(false);
    try {
      const full = await getTransitByIdTrigger({
        organizationId,
        transitId: Number(item.id),
      }).unwrap();
      setTitle(full.name ?? "");
      setFrom(full.fromLocation ?? "");
      setTo(full.toLocation ?? "");
      setDeparture(full.startTime?.slice(0, 5) ?? "");
      setArrival(full.endTime?.slice(0, 5) ?? "");
      setDescription(full.description ?? "");
      setPackingSuggestion(full.packingSuggestion ?? "");
      setVehicle(
        Array.isArray(full.vehicleTypes)
          ? full.vehicleTypes
          : full.vehicleTypes
            ? [full.vehicleTypes]
            : []
      );
      setCustomVehicleType(full.customVehicleType ?? "");
      setArrangement(
        (full.arrangedBy ?? "").toUpperCase() === "SELF"
          ? "SELF"
          : "ORGANIZER"
      );

      const mappedDocs = await Promise.all(
        (full.documents ?? []).map(async (d: any, index: number) => {
          if (d.url) {
            const file = await urlToFile(d.url, `library_doc_${index}.jpg`);
            return {
              id: null,
              url: URL.createObjectURL(file),
              type: file.type,
              file,
              markedForDeletion: false,
            };
          }
          return {
            id: null,
            url: null,
            type: null,
            file: null,
            markedForDeletion: false,
          };
        })
      );
      while (mappedDocs.length < 6) {
        mappedDocs.push({
          id: null,
          url: null,
          type: null,
          file: null,
          markedForDeletion: false,
        });
      }
      const updatedDocs = mappedDocs.map((doc, index) => {
        return {
          ...doc,
          id: docsManager.documents?.[index]?.id ?? null,
          markedForDeletion: docsManager.documents?.[index]?.id ? true : false,
        };
      });

      docsManager.setDocuments(updatedDocs);
    } catch (err) {
      console.error("Failed to load full transit", err);
    }
    setIsLibraryLoading(false);
    setLibraryOpen(false);
  };


  const handleSubmit = async () => {
    const newErrors = validateRequiredFields([
      { key: "title", label: "Title", value: title },
      { key: "from", label: "Starting point", value: from },
      { key: "to", label: "Destination", value: to },
      { key: "departure", label: "Departure time", value: departure },
      { key: "arrival", label: "Arrival time", value: arrival },
      { key: "vehicleTypes", label: "Vehicle", value: vehicle },
    ]);


    if (!vehicle || vehicle.length === 0) {
      newErrors.vehicleTypes = "Select at least 1 vehicle";
    }


    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSaving(true);

    try {
      await onSave(
        {
          title,
          from,
          to,
          departure,
          arrival,
          vehicle,
          customVehicleType,
          arrangement,
          description,
          packingSuggestion,
          saveInLibrary,
          mode,
        },
        docsManager.documents
      );

      showSuccess("Transit saved successfully!");

      onCancel();
    } catch (e) {
      showApiError("Failed to save Transit");
    } finally {
      setIsSaving(false);
    }
  };


  const isTripMode = mode === "trip";

  return (
    <div
      className="flex flex-col gap-6"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {/* Header */}
      {header && (
        <div className="text-lg font-semibold text-gray-800 pb-2">{header}</div>
      )}

      {/* Choose from library button */}
      {isTripMode ? (
        <ChooseFromLibraryButton onClick={() => setLibraryOpen(true)} />
      ) : (
        <div className="mt-2" />
      )}

      {/* Title */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-1">Title <RequiredStar /></label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          maxLength={70}
        />
        {errors.title && (
          <p className="text-xs text-red-500 mt-1">{errors.title}</p>
        )}
        <p className="text-xs text-right text-primary mt-1">
          {title.length}/70 Characters
        </p>
      </div>

      {/* Route */}
      <div>
        <label
          htmlFor="transit-route"
          className="block text-[0.95rem] font-medium mb-1"
        >
          Transit Route <RequiredStar />
        </label>

        <div
          id="transit-route"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* FROM FIELD */}
          <div>
            <label
              htmlFor="route-from"
              className="sr-only"
            >
              From
            </label>
            <Input
              id="route-from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="From"
              aria-invalid={!!errors.from}
              aria-describedby={errors.from ? "route-from-error" : undefined}
            />

            {errors.from && (
              <p
                id="route-from-error"
                className="text-xs text-red-500 mt-1"
              >
                {errors.from}
              </p>
            )}
          </div>

          {/* TO FIELD */}
          <div>
            <label
              htmlFor="route-to"
              className="sr-only"
            >
              To
            </label>
            <Input
              id="route-to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="To"
              aria-invalid={!!errors.to}
              aria-describedby={errors.to ? "route-to-error" : undefined}
            />

            {errors.to && (
              <p
                id="route-to-error"
                className="text-xs text-red-500 mt-1"
              >
                {errors.to}
              </p>
            )}
          </div>
        </div>
      </div>


      {/* Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

        {/* DEPARTURE TIME */}
        <div>
          <label
            htmlFor="departure-time"
            className="block text-[0.95rem] font-medium mb-1"
          >
            Departure Time <RequiredStar />
          </label>

          <TimePicker15Min
            id="departure-time"
            value={departure}
            onChange={(val) => setDeparture(val)}
            aria-invalid={!!errors.departure}
            aria-describedby={errors.departure ? "departure-time-error" : undefined}
          />

          {errors.departure && (
            <p
              id="departure-time-error"
              className="text-xs text-red-500 mt-1"
            >
              {errors.departure}
            </p>
          )}
        </div>

        {/* ARRIVAL TIME */}
        <div>
          <label
            htmlFor="arrival-time"
            className="block text-[0.95rem] font-medium mb-1"
          >
            Arrival Time <RequiredStar />
          </label>

          <TimePicker15Min
            id="arrival-time"
            value={arrival}
            onChange={(val) => setArrival(val)}
            aria-invalid={!!errors.arrival}
            aria-describedby={errors.arrival ? "arrival-time-error" : undefined}
          />

          {errors.arrival && (
            <p
              id="arrival-time-error"
              className="text-xs text-red-500 mt-1"
            >
              {errors.arrival}
            </p>
          )}
        </div>

      </div>

      {/* Vehicle */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Vehicle <RequiredStar />{errors.vehicleTypes && (
            <span className="text-xs text-red-500 mt-1">({errors.vehicleTypes})</span>
          )}

        </label>
        <div className="flex flex-wrap gap-2">
          {VEHICLES.map((v) => (
            <button
              key={v.value}
              type="button"
              onClick={() => toggleVehicle(v.value)}
              className={`px-4 py-2 rounded-lg border text-sm ${vehicle.includes(v.value)
                ? "bg-primary text-primary-foreground border-primary"
                : "border-gray-300 hover:border-primary/80"
                }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <Input
          value={customVehicleType}
          onChange={(e) => setCustomVehicleType(e.target.value)}
          placeholder="Other (Specify)"
          className="mt-2"
        />
        {errors.vehicleTypes && (
          <p
            id="vehicle-error"
            className="text-xs text-red-500 mt-1"
          >
            {errors.vehicleTypes}
          </p>
        )}
      </div>

      {/* Arrangement */}
      <div>
        <div className="flex items-center justify-between gap-6">
          <label className="flex items-center gap-2 text-[0.85rem]">
            <input
              type="radio"
              checked={arrangement === "ORGANIZER"}
              onChange={() => setArrangement("ORGANIZER")}
            />
            Arranged by the organizer
          </label>
          <label className="flex items-center gap-2 text-[0.85rem]">
            <input
              type="radio"
              checked={arrangement === "SELF"}
              onChange={() => setArrangement("SELF")}
            />
            Self arranged by the traveler
          </label>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Description
        </label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}

      </div>

      {/* Packing Suggestion */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Packing Suggestions
        </label>
        <RichTextEditor
          value={packingSuggestion}
          onChange={setPackingSuggestion}
        />
      </div>
      <div>
        <MultiUploader documentsManager={docsManager} label="Images" />
        {docsManager.error && (
          <p className="text-xs text-red-500 mt-2">{docsManager.error}</p>
        )}
      </div>

      {isTripMode && header === "Add Transit" && !fromLibrary && (
        <div className="flex flex-col items-end gap-2">
          <div className="flex justify-end items-center gap-2">
            <input
              type="checkbox"
              checked={saveInLibrary}
              onChange={(e) => setSaveInLibrary(e.target.checked)}
              className="appearance-none w-5 h-5 border-2 rounded-sm checked:bg-primary checked:border-primary flex items-center justify-center cursor-pointer"
              style={{
                backgroundImage: saveInLibrary
                  ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3E%3Cpath d='M6.003 10.803l-2.85-2.849L1.3 9.808l4.703 4.704L14.7 5.815l-1.854-1.854z'/%3E%3C/svg%3E\")"
                  : "none",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
            <label className="block text-[0.95rem] font-medium">
              Save in Library
            </label>
          </div>
        </div>
      )}

      {isSaving && header === "Add Transit" && (
        <div className="w-full flex justify-center my-2">
          <p className="text-sm text-primary font-medium">
            Saving...
          </p>
        </div>
      )}
      {/* Footer */}
      <div className="flex justify-end items-center gap-4 my-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <GradientButton
          disabled={isSaving || isLibraryLoading}
          onClick={handleSubmit}
        >
          Save
        </GradientButton>
      </div>

      {/* Library Modal */}
      {isTripMode && (
        <LibrarySelectModal
          open={libraryOpen}
          onClose={() => setLibraryOpen(false)}
          onSelect={handleLibrarySelect}
          category="transit"
        />
      )}
    </div>
  );
}
