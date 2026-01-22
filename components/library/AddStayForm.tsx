"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/gradient-button";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import RichTextEditor from "../editor/RichTextEditor";
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";
import { showSuccess, showApiError } from "@/lib/utils/toastHelpers";

import {
  useDocumentsManager,
  Document as DocShape,
} from "@/hooks/useDocumentsManager";
import { MultiUploader } from "../common/UploadFieldShortcuts";
import { useLazyGetStayByIdQuery } from "@/lib/services/organizer/trip/library/stay";
import RequiredStar from "../common/RequiredStar";
import { validateRequiredFields } from "@/lib/utils/validateRequiredFields";
import { useOrganizationId } from "@/hooks/useOrganizationId";


type AddStayFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  // onSave receives form data as first arg; optionally second arg is documents array
  onSave: (data: any, documents?: DocShape[]) => void;
  header?: string;
  initialData?: any;
};

export function AddStayForm({
  mode = "trip",
  onCancel,
  onSave,
  header,
  initialData,
}: AddStayFormProps) {
  const isTripMode = mode === "trip";

  // form fields
  const [title, setTitle] = useState("");
  const [sharingType, setSharingType] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [packing, setPacking] = useState("");
  const [saveInLibrary, setSaveInLibrary] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [usegetbyid] = useLazyGetStayByIdQuery();
  const [isSaving, setIsSaving] = useState(false);
  const organizationId = useOrganizationId();
  const [isLibraryLoading, setIsLibraryLoading] = useState(false);
  const [fromLibrary, setFromLibrary] = useState(false);

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

  async function urlToFile(url: string, filename = "library_image.jpg") {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  }
  const docsManager = useDocumentsManager(initialData?.documents ?? [], 6);
  useEffect(() => {
    if (!initialData) return;
    setTitle(initialData.title || initialData.name || "");
    setSharingType(initialData.sharingType || "");
    setCheckIn(normalizeTime(initialData.checkInTime));
    setCheckOut(normalizeTime(initialData.checkOutTime));
    setLocation(initialData.location || "");
    setDescription(initialData.description || "");
    setPacking(initialData.packingSuggestion || "");
    setSaveInLibrary(!!initialData.saveInLibrary);
    try {
      docsManager.resetDocuments();
    } catch (e) {

    }
  }, [initialData?.id]);

  const documents = docsManager.documents;
  const totalUsed = useMemo(
    () => documents.filter((d) => d.file || (d.id && !d.markedForDeletion)).length,
    [documents],
  );
  const availableSlots = docsManager.availableIndexes.length;

  const validateForm = () => {
    const newErrors = validateRequiredFields([
      { key: "title", label: "Title", value: title },
      { key: "sharingType", label: "Sharing Type", value: sharingType },
      { key: "checkIn", label: "Check In Time", value: checkIn },
      { key: "checkOut", label: "Check Out Time", value: checkOut },
    ]);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLibrarySelect = async (item: any) => {
    if (!item.id) return;
    setIsLibraryLoading(true);
    setFromLibrary(true);
    try {
      const fd = await usegetbyid({ organizationId, stayId: String(item.id) }).unwrap();
      setTitle(fd.name || "");
      setLocation(fd.location || "");
      setDescription(fd.description || "");
      setPacking(fd.packingSuggestion || "");
      setCheckIn(normalizeTime(fd.checkInTime));
      setCheckOut(normalizeTime(fd.checkOutTime));
      setSharingType(
        typeof fd.sharingType === "string"
          ? fd.sharingType
          : fd.sharingType?.toString() ?? ""
      );
      const mappedDocs = await Promise.all(
        (fd.documents ?? []).map(async (d: any, index: number) => {
          if (d.url) {
            const file = await urlToFile(d.url, `library_doc_${index}.jpg`);
            return {
              id: null,                // new file → no ID
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
      console.error("Error fetching stay from library:", err);
      showApiError("Failed to load Stay from library");
    }
    setIsLibraryLoading(false);
    setLibraryOpen(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    const payload = {
      title,
      sharingType,
      checkIn,
      checkOut,
      location,
      description,
      packing,
      mode,
      saveInLibrary,
    };


    try {
      await onSave(payload, documents);
      showSuccess("Stay saved successfully!");
    } catch (err) {
      showApiError("Failed to save Stay");
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "var(--font-poppins)" }}>
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        {header && <div className="text-lg font-semibold text-gray-800 pb-2">{header}</div>}
      </div>

      {/* Library chooser (only in trip mode) */}
      {isTripMode ? (
        <div className="flex justify-end">
          <ChooseFromLibraryButton onClick={() => setLibraryOpen(true)} />
        </div>
      ) : (
        <div />
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title <RequiredStar /></label>
        <div className="relative">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            maxLength={70}
            className="pr-20"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-orange-500">
            {title.length}/70 Characters
          </span>
        </div>
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* Sharing */}
      <div>
        <RequiredStar />
        <select
          value={sharingType}
          onChange={(e) => setSharingType(e.target.value)}
          className="w-full border rounded-lg p-2 text-sm text-gray-700"
        >
          <option value="">Type of Sharing  </option>
          <option value="SINGLE">Single Occupancy</option>
          <option value="DOUBLE">Double Occupancy</option>
          <option value="TRIPLE">Triple Occupancy</option>
          <option value="DORMITORY">Dormitory</option>

        </select>

        {errors.sharingType && <p className="text-xs text-red-500 mt-1">{errors.sharingType}</p>}
      </div>

      {/* Check-in / Check-out */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time <RequiredStar /></label>
          <Input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          {errors.checkIn && <p className="text-xs text-red-500 mt-1">{errors.checkIn}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time <RequiredStar /></label>
          <Input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          {errors.checkOut && <p className="text-xs text-red-500 mt-1">{errors.checkOut}</p>}
        </div>
      </div>

      {/* Location */}
      <div>
        <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description </label>
        <RichTextEditor placeholder="Enter description" value={description} onChange={setDescription} />
      </div>

      {/* Packing Suggestions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Packing Suggestions</label>
        <RichTextEditor value={packing} onChange={setPacking} placeholder="Enter here" maxWords={800} />
      </div>
      <div>
        <MultiUploader documentsManager={docsManager} label="Images" />
        {docsManager.error && <p className="text-xs text-red-500 mt-2">{docsManager.error}</p>}
      </div>

      {/* Save in Library */}
      {isTripMode && header === "Add Stay" && !fromLibrary && (
        <div className="flex justify-end items-center gap-2 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={saveInLibrary}
              onChange={(e) => setSaveInLibrary(e.target.checked)}
              className="appearance-none w-5 h-5 border-2 rounded-sm checked:bg-orange-500 checked:border-orange-500 flex items-center justify-center cursor-pointer"
              style={{
                backgroundImage: saveInLibrary
                  ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3E%3Cpath d='M6.003 10.803l-2.85-2.849L1.3 9.808l4.703 4.704L14.7 5.815l-1.854-1.854z'/%3E%3C/svg%3E\")"
                  : "none",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
            <span className="text-sm font-medium text-gray-700">Save in Library</span>
          </label>
        </div>
      )}


      {isSaving && header === "Add Stay" && (
        <div className="w-full flex justify-center my-2">
          <p className="text-sm text-orange-500 font-medium">
            Saving...
          </p>
        </div>
      )}
      {/* Footer */}
      <div className="flex justify-end items-center gap-4 mt-6">
        <Button variant="outline" className="rounded-full px-6" onClick={onCancel}>
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
          category="stays"
        />
      )}
    </div>
  );
}
