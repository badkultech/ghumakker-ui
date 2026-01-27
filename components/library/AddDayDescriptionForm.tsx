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
import {
  useDocumentsManager,
  Document as DocShape,
} from "@/hooks/useDocumentsManager";
import { useLazyGetDayDescriptionByIdQuery } from "@/lib/services/organizer/trip/library/day-description";
import RequiredStar from "../common/RequiredStar";
import { validateRequiredFields } from "@/lib/utils/validateRequiredFields";
import { useOrganizationId } from "@/hooks/useOrganizationId";

type AddDayDescriptionFormProps = {
  mode?: "library" | "trip";
  updateId?: number | null;
  onCancel: () => void;
  onSave: (data: any, documents?: DocShape[]) => void;
  header?: string;
  initialData?: any;
};

export function AddDayDescriptionForm({
  mode = "trip",
  onCancel,
  onSave,
  header,
  initialData,
}: AddDayDescriptionFormProps) {
  const docsManager = useDocumentsManager(initialData?.documents ?? [], 6);

  // Convert image URL to File object
  async function urlToFile(url: string, filename = "library_image.jpg") {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  }


  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [packing, setPacking] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saveInLibrary, setSaveInLibrary] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [getbyid] = useLazyGetDayDescriptionByIdQuery();
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

  useEffect(() => {
    if (!initialData) return;
    setFromLibrary(false);
    setTitle(initialData.name || initialData.title || "");
    setDescription(initialData.description || "");
    setLocation(initialData.location || "");
    setTime(normalizeTime(initialData.time));
    setPacking(initialData.packingSuggestion || initialData.packing || "");

    try {
      docsManager.resetDocuments();
    } catch (e) {
      console.error("Failed to reset documents", e);
    }
  }, [initialData?.id]);

  const handleLibrarySelect = async (item: any) => {
    setIsLibraryLoading(true);
    setFromLibrary(true);

    try {
      const fd = await getbyid({
        organizationId,
        dayDescriptionId: item.id,
      }).unwrap();
      setTitle(fd.name || "");
      setLocation(fd.location || "");
      setDescription(fd.description || "");
      setTime(normalizeTime(fd.time));
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
      console.error("Failed to fetch day description:", error);
    }
    setIsLibraryLoading(false);
    setLibraryOpen(false);

  };

  const validateForm = () => {
    const newErrors = validateRequiredFields([
      { key: "title", label: "Title", value: title },
      { key: "description", label: "Description", value: description },
    ]);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (replace = false) => {
    const isValid = validateForm();
    if (!isValid) return;
    setIsSaving(true);
    try {
      await onSave(
        { title, description, location, time, packing, saveInLibrary, mode },
        docsManager.documents
      );

      showSuccess("Day description saved successfully!");
      // Documents uploaded successfully
    } catch {
      showApiError("Failed to save day description");
    } finally {
      setIsSaving(false);
    }
  };

  const isTripMode = mode === "trip";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between w-full">
        {header && (
          <div className="text-lg font-semibold text-gray-800  pb-2">
            {header}
          </div>
        )}
      </div>
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
        <p className="text-xs text-right text-primary mt-1">
          {title.length}/70 Characters
        </p>
        {errors.title && (
          <p className="text-xs text-red-500 mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <RequiredStar />
        </label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Location + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
          {errors.location && (
            <p className="text-xs text-red-500 mt-1">{errors.location}</p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time
        </label>
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
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
          placeholder="Enter here"
        />
      </div>

      {/* Image Upload */}
      {/* Upload area: uses MultiUploader and shares docsManager */}
      <div>
        {/* MultiUploader uses the docsManager so form can read docsManager.documents on submit */}
        <MultiUploader documentsManager={docsManager} label="Images" />

        {/* Show any manager-level error */}
        {docsManager.error && (
          <p className="text-xs text-red-500 mt-2">{docsManager.error}</p>
        )}
      </div>

      {isTripMode && header === "Add Day Description" && !fromLibrary && (
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


      {isSaving && header === "Add Day Description" && (
        <div className="w-full flex justify-center my-2">
          <p className="text-sm text-primary font-medium">
            Saving...
          </p>
        </div>
      )}
      {/* Footer */}
      <div className="flex justify-end items-center gap-4 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <GradientButton
          disabled={isSaving || isLibraryLoading}
          onClick={() => handleSubmit(false)}
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
          category="day-description"
        />
      )}
    </div>
  );
}
