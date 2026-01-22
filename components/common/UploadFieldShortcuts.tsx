// components/UploadFieldShortcuts.tsx
"use client";

import React from "react";
import { UploadPreview } from "./UploadPreview";
import { useDocumentsManager } from "@/hooks/useDocumentsManager";

export function SingleUploader({
  documentsManager,
  label = "Upload (single)",
}: {
  documentsManager?: ReturnType<typeof useDocumentsManager>;
  label?: string;
}) {
  // NOTE: Single uploader still expects the manager to handle max 6 slots;
  // the single prop only limits UI/input to one file.
  return <UploadPreview documentsManager={documentsManager} maxFiles={1} label={label} single />;
}

export function MultiUploader({
  documentsManager,
  label = "Upload Images",
  maxFiles = 6,
}: {
  documentsManager?: ReturnType<typeof useDocumentsManager>;
  label?: string;
  maxFiles?: number;
}) {
  return <UploadPreview documentsManager={documentsManager} maxFiles={maxFiles} label={label} />;
}
