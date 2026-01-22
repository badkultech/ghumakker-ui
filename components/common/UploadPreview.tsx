"use client";

import React from "react";
import { Upload, X, Pencil } from "lucide-react";
import {
  useDocumentsManager,
  Document as DocShape,
} from "@/hooks/useDocumentsManager";

type UploadPreviewProps = {
  documentsManager?: ReturnType<typeof useDocumentsManager>;
  maxFiles?: number;
  label?: string;
  accept?: string;
  maxFileSizeMB?: number;
  helperText?: string;
  single?: boolean;
};

export function UploadPreview({
  documentsManager,
  maxFiles = 6,
  label = "Upload",
  accept = "image/png,image/jpeg",
  maxFileSizeMB = 10,
  helperText,
  single,
}: UploadPreviewProps) {
  const localManager = useDocumentsManager([], maxFiles);
  const manager = documentsManager ?? localManager;

  const { documents, setDocuments, handleAddFiles, handleMarkForDeletion } = manager;

  const availableSlots = manager.availableIndexes.length;
  const totalUsed = documents.filter(
    (d) => d.file || (d.id && !d.markedForDeletion),
  ).length;
  const isSingle = !!single || maxFiles === 1;

  // --- UI-layer helpers (no hook modification needed) ---

  const handleReplaceFileAtIndex = (file: File, idx: number) => {
    // Replace logic: treat as markForDeletion+newFile assignment
    setDocuments((prev) => {
      const updated = [...prev];
      const prevDoc = updated[idx];
      if (!prevDoc) return prev;

      // Revoke any blob URL before replacing
      if (prevDoc.url?.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(prevDoc.url);
        } catch {}
      }

      const blobUrl = URL.createObjectURL(file);

      updated[idx] = {
        ...prevDoc,
        id: prevDoc.id ?? null,
        type: file.type,
        url: blobUrl,
        file,
        markedForDeletion: !!prevDoc.id, // if existing -> backend knows it's a replace
      };

      return updated;
    });
  };

  const handleRemoveAtIndex = (idx: number) => {
    const doc = documents[idx];
    handleMarkForDeletion(doc?.id ?? null, idx);
  };

  const handleUnmarkDeletion = (idx: number) => {
    setDocuments((prev) => {
      const updated = [...prev];
      const current = updated[idx];
      if (!current) return prev;
      updated[idx] = { ...current, markedForDeletion: false };
      return updated;
    });
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (isSingle) {
      const idx = manager.availableIndexes[0] ?? 0;
      handleReplaceFileAtIndex(files[0], idx);
    } else {
      handleAddFiles(files);
    }

    e.currentTarget.value = "";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {`(Max ${maxFiles})`}
      </label>

      <label
        className={`flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-orange-400 transition ${
          availableSlots === 0 && !isSingle ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <Upload className="w-6 h-6 text-gray-400 mb-2" />
        <span className="text-sm text-gray-600">
          Click to upload{isSingle ? "" : " (multiple allowed)"}
        </span>
        <span className="text-xs text-gray-400">
          {accept.split(",").join(", ")} up to {maxFileSizeMB}MB
        </span>

        <input
          type="file"
          accept={accept}
          multiple={!isSingle}
          className="hidden"
          onChange={onFileInput}
          disabled={availableSlots === 0 && !isSingle}
        />
      </label>

      {manager.error && <p className="text-xs text-red-500 mt-2">{manager.error}</p>}

      {totalUsed > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {documents.map((doc: DocShape, idx: number) => {
            const hasFile = !!doc.file;
            const hasUrl = !!doc.url;
            const isMarked = !!doc.markedForDeletion;

            if (!hasFile && !hasUrl && !doc.id) return null;

            return (
              <div
                key={idx}
                className="relative w-24 h-24 border rounded-lg overflow-hidden"
              >
                {hasUrl || hasFile ? (
                  <img
                    src={String(doc.url)}
                    alt={`preview-${idx}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100 text-xs text-gray-400">
                    No preview
                  </div>
                )}

                {isMarked && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs">
                    Marked for deletion
                  </div>
                )}

                <div className="absolute top-1 right-1 flex gap-1">
                  {isMarked ? (
                    <button
                      type="button"
                      onClick={() => handleUnmarkDeletion(idx)}
                      className="bg-white/80 text-sm px-2 rounded text-gray-700"
                      title="Undo delete"
                    >
                      Undo
                    </button>
                  ) : (
                    <>
                      <label
                        title="Replace"
                        className="bg-white/80 rounded p-1 cursor-pointer"
                      >
                        <input
                          type="file"
                          accept={accept}
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleReplaceFileAtIndex(f, idx);
                            e.currentTarget.value = "";
                          }}
                        />
                        <Pencil size={14} className="text-gray-700" />
                      </label>

                      <button
                        type="button"
                        onClick={() => handleRemoveAtIndex(idx)}
                        className="bg-black/60 text-white rounded-full p-[2px]"
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-2">
        {totalUsed}/{maxFiles} used {helperText ? `· ${helperText}` : ""}
      </div>
    </div>
  );
}
