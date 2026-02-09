"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/gradient-button";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import Select from "react-select";
import {
  useDocumentsManager,
  Document as DocShape,
} from "@/hooks/useDocumentsManager";
import { MultiUploader } from "../common/UploadFieldShortcuts";
import { TimePicker15Min } from "@/components/ui/time-picker-15min";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { useLazyGetActivityByIdQuery } from "@/lib/services/organizer/trip/library/activity";
import RequiredStar from "../common/RequiredStar";
import { validateRequiredFields } from "@/lib/utils/validateRequiredFields";
import { useOrganizationId } from "@/hooks/useOrganizationId";

type AddActivityFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any, documents?: DocShape[], saveInLibrary?: boolean) => void;
  header?: string;
  initialData?: any;

};

type OptionType = { value: string; label: string };
const moodOptions: OptionType[] = [
  { value: "ADVENTURE", label: "Adventure" },
  { value: "RELAXING", label: "Relaxing" },
  { value: "CULTURAL", label: "Cultural" },
  { value: "FAMILY", label: "Family" },
];

export function AddActivityForm({
  mode = "trip",
  onCancel,
  onSave,
  header,
  initialData,
}: AddActivityFormProps) {
  const docsManager = useDocumentsManager(initialData?.documents ?? [], 6);
  const [title, setTitle] = useState("");
  const [priceType, setPriceType] = useState<"INCLUDED" | "CHARGEABLE">(
    "INCLUDED"
  );
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [packing, setPacking] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saveInLibrary, setSaveInLibrary] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");
  const [moodTags, setMoodTags] = useState<OptionType[]>([]);
  const { userData } = useSelector(selectAuthState);
  const [getbyid] = useLazyGetActivityByIdQuery();
  const isTripMode = mode === "trip";
  const [isSaving, setIsSaving] = useState(false);
  const organizationId = useOrganizationId();
  const [isLibraryLoading, setIsLibraryLoading] = useState(false);
  const [formLibrary, setFormLibrary] = useState(false);

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

  const normalizeMoodOption = (x: any): OptionType | null => {
    if (!x) return null;
    if (typeof x === "object" && "value" in x && "label" in x) {
      const v = String((x as any).value ?? "").trim();
      const l = String((x as any).label ?? "").trim();
      if (!v || !l) return null;
      return { value: v, label: l };
    }
    const s = String(x || "").trim();
    if (!s) return null;
    const found =
      moodOptions.find((o) => o.value === s) ||
      moodOptions.find((o) => o.label.toLowerCase() === s.toLowerCase());
    if (found) return found;
    return {
      value: s.toUpperCase(),
      label: s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(),
    };
  };

  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title || initialData.name || "");

    if (Array.isArray(initialData.moodTags)) {
      const opts = initialData.moodTags
        .map(normalizeMoodOption)
        .filter(Boolean) as OptionType[];
      setMoodTags(opts);
    } else {
      setMoodTags([]);
    }

    setPriceType(initialData.priceCharge ? "CHARGEABLE" : "INCLUDED");
    setLocation(initialData.location || "");
    setTime(normalizeTime(initialData.time));
    setDescription(initialData.description || "");
    setPacking(initialData.packingSuggestion || "");

    try {
      docsManager.resetDocuments();
    } catch (e) {
      console.error("Failed to reset documents", e);
    }
  }, [initialData]);

  const handleLibrarySelect = async (item: any) => {
    setIsLibraryLoading(true);
    try {
      const fd = await getbyid({
        organizationId,
        activityId: item.id,
      }).unwrap();

      setFormLibrary(true);
      setIsLibraryLoading(false);
      setTitle(fd.name || "");
      setLocation(fd.location || "");
      setDescription(fd.description || "");
      if (Array.isArray(fd.moodTags)) {
        const opts = fd.moodTags
          .map(normalizeMoodOption)
          .filter(Boolean) as OptionType[];
        setMoodTags(opts);
      } else {
        setMoodTags([]);
      }
      setTime(normalizeTime(fd.time));
      setPacking(fd.packingSuggestion || "");
      setPriceType(
        String(fd.priceCharge) === "CHARGEABLE"
          ? "CHARGEABLE"
          : "INCLUDED"
      );
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
      console.error("Failed to fetch activity:", error);
    }
    setIsLibraryLoading(false);
    setLibraryOpen(false);
  };

  const validateForm = () => {
    const stringFieldErrors = validateRequiredFields([
      { key: "title", label: "Title", value: title },
      { key: "priceType", label: "Price Type", value: priceType },
    ]);
    const customErrors: { [key: string]: string } = {};
    if (!moodTags || moodTags.length === 0) {
      customErrors.moodTags = "Mood Tags are required";
    }
    const newErrors = { ...stringFieldErrors, ...customErrors };
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSaving(true);
    const moods = moodTags
      .map((t) => (t?.value ?? "").toString().trim())
      .filter((v) => v.length > 0);

    try {
      await onSave(
        {
          title,
          moodTags: moods,
          priceType,
          location,
          ...(isTripMode && {
            saveInLibrary,
          }),
          time,
          description,
          packing,
          mode,
        },
        docsManager.documents,
        saveInLibrary
      );
      showSuccess("Activity saved successfully!");
    } catch {
      showApiError("Failed to save Activity");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-poppins">
      {/* Header */}
      {header && (
        <div className="text-lg font-semibold text-gray-800 pb-2">{header}</div>
      )}

      {/* Choose from Library */}
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

      {/* Mood Tags */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Mood Tags <RequiredStar />
        </label>
        <Select
          options={moodOptions}
          value={moodTags}
          onChange={(selected) =>
            setMoodTags(
              ((selected ?? []) as OptionType[]).filter(
                (o) => !!o?.value?.trim()
              )
            )
          }
          isMulti
          className="text-[0.95rem]"
          classNamePrefix="react-select"
          styles={{
            multiValue: (base) => ({
              ...base,
              backgroundColor: "transparent",
              border: "1px solid var(--primary)",
              borderRadius: "9999px",
              padding: "2px 8px",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "var(--primary)",
              fontSize: "14px",
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "var(--primary)",
              ":hover": { backgroundColor: "transparent", color: "var(--primary)" },
            }),
          }}
        />
        {errors.moodTags && (
          <p className="text-xs text-red-500 mt-1">{errors.moodTags}</p>
        )}
      </div>

      {/* Price Type */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Price Charge <RequiredStar />
        </label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-[0.95rem]">
            <input
              type="radio"
              name="priceType"
              checked={priceType === "INCLUDED"}
              onChange={() => setPriceType("INCLUDED")}
            />
            Included
          </label>
          <label className="flex items-center gap-2 text-[0.95rem]">
            <input
              type="radio"
              name="priceType"
              checked={priceType === "CHARGEABLE"}
              onChange={() => setPriceType("CHARGEABLE")}
            />
            Chargeable
          </label>
        </div>
        {errors.priceType && (
          <p className="text-xs text-red-500 mt-1">{errors.priceType}</p>
        )}
      </div>

      {/* Location + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[0.95rem] font-medium mb-2">
            Location
          </label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
        </div>
        <div>
          <label className="block text-[0.95rem] font-medium mb-2">Time</label>
          <TimePicker15Min
            value={time}
            onChange={(val) => setTime(val)}
            placeholder="Select time"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-1">
          Description
        </label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="Enter here"
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}

      </div>

      {/* Packing */}
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
      <div>
        <MultiUploader documentsManager={docsManager} label="Images" />
        {docsManager.error && (
          <p className="text-xs text-red-500 mt-2">{docsManager.error}</p>
        )}
      </div>

      {isTripMode && header === "Add Activity" && !formLibrary && (
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
      {isSaving && header === "Add Activity" && (
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
          category="activities"
        />
      )}
    </div>
  );
}
