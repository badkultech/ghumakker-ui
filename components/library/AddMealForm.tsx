"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/gradient-button";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import RichTextEditor from "../editor/RichTextEditor";
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";
import { showSuccess, showApiError } from "@/lib/utils/toastHelpers";
import { MultiUploader } from "../common/UploadFieldShortcuts";
import { TimePicker15Min } from "@/components/ui/time-picker-15min";
import {
  useDocumentsManager,
  Document as DocShape,
} from "@/hooks/useDocumentsManager";
import { useLazyGetMealByIdQuery } from "@/lib/services/organizer/trip/library/meal";
import RequiredStar from "../common/RequiredStar";
import { validateRequiredFields } from "@/lib/utils/validateRequiredFields";
import { useOrganizationId } from "@/hooks/useOrganizationId";

type AddMealFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any, documents?: DocShape[]) => void;
  header?: string;
  initialData?: any;
};

export function AddMealForm({
  mode = "trip",
  onCancel,
  onSave,
  header,
  initialData,
}: AddMealFormProps) {
  const docsManager = useDocumentsManager(initialData?.documents ?? [], 6);
  const [title, setTitle] = useState("My Meal");
  const [mealType, setMealType] = useState("LUNCH");
  const [time, setTime] = useState("12:00");
  const [included, setIncluded] = useState<"included" | "chargeable">(
    "included"
  );
  const [location, setLocation] = useState("Mumbai, India");
  const [description, setDescription] = useState("");
  const [packing, setPacking] = useState("");

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saveInLibrary, setSaveInLibrary] = useState(false);
  const [usegetbyid] = useLazyGetMealByIdQuery();
  const [isSaving, setIsSaving] = useState(false);
  const organizationId = useOrganizationId();
  const [isLibraryLoading, setIsLibraryLoading] = useState(false);
  const [fromLibrary, setFromLibrary] = useState(false);

  async function urlToFile(url: string, filename = "library_image.jpg") {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  }

  const isTripMode = mode === "trip";

  useEffect(() => {
    if (!initialData) return;
    setTitle(initialData.title || initialData.name || "");
    setMealType(
      typeof initialData.mealType === "string"
        ? initialData.mealType.toUpperCase()
        : "LUNCH"
    );
    setTime(initialData.time || "12:00");
    setIncluded(initialData.chargeable ? "chargeable" : "included");
    setLocation(initialData.location || "");
    setDescription(initialData.description || "");
    setPacking(initialData.packingSuggestion || "");
    const mappedDocs = (
      Array.isArray(initialData.documents) ? initialData.documents : []
    ).map((d: any) => ({
      id: d.id ?? null,
      url: d.url ?? d.fileUrl ?? d.path ?? d.s3Url ?? null,
      type: d.type ?? "IMAGE",
      file: null,
      markedForDeletion: !!d.markedForDeletion,
    }));

    // ✅ Pad to 6 slots (or whatever capacity you use)
    while (mappedDocs.length < 6) {
      mappedDocs.push({
        id: null,
        url: null,
        type: null,
        file: null,
        markedForDeletion: false,
      });
    }

    docsManager.setDocuments(mappedDocs);

  }, [initialData]);

  const handleLibrarySelect = async (item: any) => {
    setIsLibraryLoading(true);
    try {
      const fd = await usegetbyid({
        organizationId,
        mealId: item.id,
      }).unwrap();
      setFromLibrary(true);
      setSaveInLibrary(false);
      setTitle(fd.name || "");
      setLocation(fd.location || "");
      setDescription(fd.description || "");
      setMealType(
        typeof fd.mealType === "string"
          ? fd.mealType
          : ""
      );
      setTime(fd.time || "12:00");
      setIncluded(fd.chargeable ? "chargeable" : "included");
      setPacking(fd.packingSuggestion || "");
      const mappedDocs = await Promise.all(
        (fd.documents ?? []).map(async (d: any, index: number) => {
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
    } catch (error) {
      showApiError("Failed to load Meal from library");
      console.error("Failed to fetch meal:", error);
    }
    setIsLibraryLoading(false);
    setLibraryOpen(false);
  };

  const validateForm = () => {
    const newErrors = validateRequiredFields([
      { key: "title", label: "Title", value: title },
      { key: "time", label: "Meal Time", value: time },
      { key: "mealType", label: "Meal Type", value: mealType },
    ]);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;
    setIsSaving(true);



    try {
      await onSave(
        {
          title,
          mealType,
          time,
          included,
          location,
          description,
          packing,
          saveInLibrary,
          mode,
        },
        docsManager.documents
      );
      showSuccess("Meal saved successfully!");
    } catch {
      showApiError("Failed to save Meal");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="flex flex-col gap-6"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        {header && (
          <div className="text-lg font-semibold text-gray-800 pb-2">
            {header}
          </div>
        )}
      </div>

      {/* Top-right button */}
      {isTripMode ? (
        <ChooseFromLibraryButton onClick={() => setLibraryOpen(true)} />
      ) : (
        <div className="mt-2" />
      )}

      {/* Title */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">Title <RequiredStar /></label>
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

      {/* Meal Type & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[0.95rem] font-medium mb-2">
            Meal Type <RequiredStar />
          </label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm text-gray-700"
          >
            <option value="">Select</option>
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="SNACKS">Snacks</option>
            <option value="DINNER">Dinner</option>
          </select>

          <label className="flex items-center gap-2 my-4">
            <input
              type="radio"
              checked={included === "included"}
              onChange={() => setIncluded("included")}
            />
            Included
          </label>
        </div>

        <div>
          <label className="block text-[0.95rem] font-medium mb-2">Time <RequiredStar /></label>
          <TimePicker15Min
            value={time}
            onChange={(val) => setTime(val)}
            placeholder="Select time"
          />
          <label className="flex items-center gap-2 my-4">
            <input
              type="radio"
              checked={included === "chargeable"}
              onChange={() => setIncluded("chargeable")}
            />
            Chargeable
          </label>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-1">
          Location<RequiredStar />
        </label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <RichTextEditor
          placeholder="Enter description"
          value={description}
          onChange={setDescription}
        />
      </div>

      {/* Packing Suggestions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Packing Suggestions
        </label>
        <RichTextEditor
          value={packing}
          onChange={setPacking}
          placeholder="Enter packing suggestions"
          maxWords={800}
        />
      </div>

      {/* Image Upload */}
      <div>
        <MultiUploader documentsManager={docsManager} label="Images" />
        {docsManager.error && (
          <p className="text-xs text-red-500 mt-2">{docsManager.error}</p>
        )}
      </div>

      {/* Save in Library */}
      {isTripMode && header === "Add Meal" && !fromLibrary && (
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


      {isSaving && header === "Add Meal" && (
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
      {mode === "trip" && (
        <LibrarySelectModal
          open={libraryOpen}
          onClose={() => setLibraryOpen(false)}
          onSelect={handleLibrarySelect}
          category="meals"
        />
      )}
    </div>
  );
}
