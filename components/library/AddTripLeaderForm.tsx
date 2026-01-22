// AddTripLeaderForm.tsx (emit-only version)

"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/gradient-button";
import RichTextEditor from "../editor/RichTextEditor";
import { SingleUploader } from "../common/UploadFieldShortcuts";
import { useDocumentsManager, Document as DocShape } from "@/hooks/useDocumentsManager";
import RequiredStar from "../common/RequiredStar";

type AddTripLeaderFormProps = {
  updateId?: number | null;
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any, documents?: DocShape[], done?: () => void) => void;
  parentLoading?: boolean;
  initialData?: any;
};

export function AddTripLeaderForm({
  updateId,
  mode = "trip",
  onCancel,
  onSave,
  initialData,
  parentLoading,
}: AddTripLeaderFormProps) {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);


  const isTripMode = mode === "trip";

  // documents manager: single file allowed
  const docsManager = useDocumentsManager(initialData?.documents ?? [], 1);

  // populate form when initialData changes
  useEffect(() => {
    if (!initialData && !updateId) {
      setName("");
      setTagline("");
      setBio("");
      try {
        docsManager.resetDocuments?.();
      } catch { }
      return;
    }

    if (initialData) {
      setName(initialData.name || "");
      setTagline(initialData.tagline || "");
      setBio(initialData.bio || "");

      if (initialData.documents && Array.isArray(initialData.documents)) {
        const mapped = initialData.documents.map((d: any) => ({
          id: d.id ?? null,
          url: d.url ?? d.fileUrl ?? d.path ?? d.s3Url ?? null,
          type: d.type ?? "IMAGE",
          file: null,
          markedForDeletion: !!d.markedForDeletion,
        }));
        docsManager.resetDocuments?.();
      } else {
        docsManager.resetDocuments?.();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.id, updateId]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!bio.trim()) newErrors.bio = "Bio is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // emit-only: delegate saving to parent (modal)
  const handleSubmit = () => {
    if (!validateForm()) return;
    setLoading(true);
    const payload = {
      name: name.trim(),
      tagline: tagline.trim(),
      bio: bio.trim(),
      mode,
      updateId,
      _internalLoading: true,
    };

    onSave(payload, docsManager.documents, () => {
      setLoading(false);
    });
  };

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "var(--font-poppins)" }}>
      <div>
        {mode === "trip" && <label className="block text-[0.95rem] font-semibold mb-2">Profile Image</label>}
        <SingleUploader documentsManager={docsManager} label="Upload Profile Image" />
      </div>

      {/* Name */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">Name <RequiredStar /></label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" maxLength={50} />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">Tagline</label>
        <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Enter tagline" />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">Bio <RequiredStar /></label>
        <RichTextEditor value={bio} onChange={setBio} placeholder="Enter here" maxWords={500} />
        {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio}</p>}
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center gap-4 mt-6">
        <Button variant="outline" className="rounded-full" onClick={onCancel}>Cancel</Button>
        <GradientButton
          onClick={handleSubmit}
          disabled={loading || parentLoading}
        >
          {(loading || parentLoading) ? "Saving..." : "Save"}
        </GradientButton>

      </div>
    </div>
  );
}
