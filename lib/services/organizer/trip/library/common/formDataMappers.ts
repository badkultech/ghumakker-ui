// src/lib/formDataMappers.ts
// Centralized FormData mappers with consistent document handling
// - honors the Document shape you provided
// - supports mark-for-deletion for existing docs
// - enforces a MAX_DOCS cap (6 by default)
import { Document } from "@/hooks/useDocumentsManager";
export interface DocumentItem {
  id: number | null;
  type: string | null;
  url: string | null;
  file: File | null;
  markedForDeletion: boolean;
}

const MAX_DOCS = 6;

/* ---------- small helpers ---------- */

/**
 * Append a repeated simple field (e.g., moodTags) to formdata.
 */
function appendRepeatedField(
  fd: FormData,
  key: string,
  values?: string[] | null
) {
  if (!values || !values.length) return;
  values.forEach((v) => {
    if (v !== undefined && v !== null) fd.append(key, String(v));
  });
}

/**
 * Normalize boolean/flags into the string representation backend commonly expects.
 * We append "true" or "false" strings so FormData is consistent.
 */
function boolToString(v: boolean | undefined | null) {
  return v ? "true" : "false";
}

/**
 * Append documents in a consistent shape:
 * For each doc (up to MAX_DOCS) we will:
 * - if doc.file exists: append to `documents[i].file`
 * - if doc.id exists: append `documents[i].id` (useful for server to identify existing doc)
 * - if doc.markedForDeletion is true: append `documents[i].markedForDeletion` -> "true"
 *
 * NOTE: this function will keep the index positions stable (0..MAX_DOCS-1),
 * so server can correlate positions if it relies on indices.
 */

export function appendDocuments(
  fd: FormData,
  documents?:
    | {
        id: number | null;
        type: string | null;
        url: string | null;
        file: File | null;
        markedForDeletion: boolean;
      }[]
    | null,
  maxDocs: number = MAX_DOCS
) {
  const docsArray = Array.from({ length: maxDocs }).map(
    (_, i) =>
      (documents && documents[i]) || {
        id: null,
        type: null,
        url: null,
        file: null,
        markedForDeletion: false,
      }
  );

  // Always tell server we’re sending full 6
  fd.append("documentsCount", String(maxDocs));

  for (let i = 0; i < docsArray.length; i++) {
    const doc = docsArray[i];
    const base = `documents[${i}]`;

    // Always include basic fields, even if empty
    fd.append(`${base}.id`, doc.id !== null ? String(doc.id) : "");
    fd.append(`${base}.markedForDeletion`, String(!!doc.markedForDeletion));

    // If a new file exists, include it
    if (doc.file instanceof File) {
      const filename = doc.file.name || `document_${i}`;
      fd.append(`${base}.file`, doc.file, filename);

      if (doc.type) {
        fd.append(`${base}.fileType`, doc.type);
      }
    } else {
      // Append empty file to keep form structure predictable
      // fd.append(`${base}.file`, "");
    }

    // Optional: include type and url placeholders for consistency
    fd.append(`${base}.type`, doc.type ?? "");
    // fd.append(`${base}.url`, doc.url ?? "");
  }

  return fd;
}

/* ---------- mappers for each resource ---------- */

/** Generic base mapper used by many resources */
function mapBaseFields(
  fd: FormData,
  base: {
    name?: string;
    location?: string;
    description?: string;
    packing?: string;
    addToLibrary?: boolean;
    time?: string;
  }
) {
  if (base.name !== undefined) fd.append("name", base.name);
  if (base.location !== undefined) fd.append("location", base.location);
  if (base.description !== undefined)
    fd.append("description", base.description);
  // normalized key: packingSuggestion (pick this and keep it consistent)
  if (base.packing !== undefined) fd.append("packingSuggestion", base.packing);
  if (base.addToLibrary !== undefined)
    fd.append("addToLibrary", boolToString(!!base.addToLibrary));
  if (base.time !== undefined) fd.append("time", base.time);
  return fd;
}

export function mapStayToFormData(data: any, documents?: DocumentItem[]) {
  const fd = new FormData();
  mapBaseFields(fd, {
    name: data.title ?? "",
    location: data.location ?? "",
    description: data.description ?? "",
    packing: data.packing ?? "",
  });

  // stay-specific fields
  if (data.sharingType !== undefined)
    fd.append("sharingType", String(data.sharingType));
  if (data.checkIn !== undefined) fd.append("checkInTime", data.checkIn);
  if (data.checkOut !== undefined) fd.append("checkOutTime", data.checkOut);
  if (data.saveInLibrary) {
    fd.append("addToLibrary", "true");
  }
  appendDocuments(fd, documents);
  return fd;
}

export function mapTransitToFormData(data: any, documents?: DocumentItem[]) {
  const fd = new FormData();
  console.log("vehicle data in mapper:", data.customVehicleType);
  fd.append("fromLocation", data.from ?? "");
  fd.append("toLocation", data.to ?? "");
  fd.append("startTime", data.departure ?? "");
  fd.append("endTime", data.arrival ?? "");
  if (Array.isArray(data.vehicle) && data.vehicle.length > 0) {
    data.vehicle.forEach((v: string) => fd.append("vehicleTypes", v));
  } else if (data.vehicle) {
    fd.append("vehicleTypes", data.vehicle);
  }

  fd.append("customVehicleType", data.customVehicleType ?? "");
  fd.append(
    "arrangedBy",
    (data.arrangement ?? "organizer").toString().toUpperCase()
  );
  fd.append("description", data.description ?? "");
  fd.append("packingSuggestion", data.packingSuggestion ?? "");
  fd.append("addToLibrary", data.saveInLibrary ? "true" : "false");
  fd.append("name", data.title ?? "");
  appendDocuments(fd, documents);
  return fd;
}

export function mapMealToFormData(data: any, documents?: DocumentItem[]) {
  const fd = new FormData();
  mapBaseFields(fd, {
    name: data.title ?? "",
    location: data.location ?? "",
    description: data.description ?? "",
    packing: data.packing ?? "",
    time: data.time ?? "",
    addToLibrary: data.addToLibrary ?? true,
  });

  // unify mealType -> uppercase
  if (data.mealType !== undefined)
    fd.append("mealType", String(data.mealType).toUpperCase());
  // chargeable boolean: prefer a boolean in UI; map here
  if (data.chargeable !== undefined) {
    fd.append("chargeable", boolToString(!!data.chargeable));
  } else if (data.included !== undefined) {
    // fallback to your previous logic if UI still uses 'included'
    fd.append("chargeable", boolToString(data.included === "chargeable"));
  }
  appendDocuments(fd, documents);
  return fd;
}

export function mapActivityToFormData(data: any, documents?: DocumentItem[]) {
  const fd = new FormData();
  mapBaseFields(fd, {
    name: data.title ?? "",
    location: data.location ?? "",
    description: data.description ?? "",
    packing: data.packing ?? "",
    time: data.time ?? "",
  });

  if (data.priceType !== undefined)
    fd.append("priceCharge", String(data.priceType));
  if (data.saveInLibrary) {
  fd.append("addToLibrary", "true");
} else {
  fd.append("addToLibrary", "false");
}


  // moodTags: allow either array of strings or array of {label, value}
  const rawMoods = Array.isArray(data.moodTags) ? data.moodTags : [];
  const moods = rawMoods
    .map((t: any) =>
      typeof t === "string" ? t.trim() : String(t?.value ?? "").trim()
    )
    .filter(Boolean);
  appendRepeatedField(fd, "moodTags", moods);

  appendDocuments(fd, documents);
  return fd;
}

export function mapDayDescriptionToFormData(
  data: any,
  documents?: DocumentItem[]
) {
  const fd = new FormData();
  mapBaseFields(fd, {
    name: data.title ?? "",
    description: data.description ?? "",
    location: data.location ?? "",
    packing: data.packing ?? "",
    time: data.time ?? "",
  });
   if (data.saveInLibrary) {
    fd.append("addToLibrary", "true");
  }

  // some dayDescriptions might include extra fields like packingSuggestion already handled above
  // handle attached documents (the `documents` param), as well as possibly pre-existing `data.documents`
  // prefer explicit passed documents (from your useDocumentsManager). If none passed, try data.documents
  appendDocuments(fd, documents);
  return fd;
}

export function mapDocumentsForBackend(docs: Document[]) {
  return docs.map((doc) => ({
    id: doc.id,
    markedForDeletion: doc.markedForDeletion,
    // For new uploads, send file reference or null if none
    file: doc.file ?? null,
    // You can include URL or type if backend needs
    type: doc.type,
    url: doc.url,
  }));
}

/**
 * mapTripLeaderToFormData
 * -----------------------
 * Converts Trip Leader DTO + documents[] into multipart/form-data for backend.
 *
 * @param data       Plain form values (name, tagline, bio, addToLibrary, etc.)
 * @param documents  Array from useDocumentsManager
 */
export function mapTripLeaderToFormData(
  data: any,
  documents: any[] = []
): FormData {
  const fd = new FormData();

  if (data.name) fd.append("name", data.name.trim());
  if (data.tagline) fd.append("tagline", data.tagline.trim());
  if (data.bio) fd.append("bio", data.bio.trim());
  fd.append("addToLibrary", data.mode === "library" ? "true" : "false");

  documents.forEach((doc, i) => {
    // If marked for deletion and no new file => signal deletion
    if (doc.markedForDeletion && !doc.file) {
      if (doc.id) fd.append(`documents[${i}].id`, String(doc.id));
      fd.append(`documents[${i}].markedForDeletion`, "true");
      return;
    }

    // If file present => append file (replace or add)
    if (doc.file) {
      if (doc.id) {
        // keep id to indicate replacement for that existing doc
        fd.append(`documents[${i}].id`, String(doc.id));
        fd.append(`documents[${i}].markedForDeletion`, "true");
      }
      fd.append(`documents[${i}].file`, doc.file, doc.file.name);
      fd.append(`documents[${i}].name`, doc.file.name);
      fd.append(`documents[${i}].type`, doc.type ?? "IMAGE");

      return;
    }

    // If no file and has id (keep existing reference)
    if (doc.id) {
      fd.append(`documents[${i}].id`, String(doc.id));
      if (doc.type) fd.append(`documents[${i}].type`, doc.type);
      if (doc.url) fd.append(`documents[${i}].url`, doc.url);
    }
  });

  return fd;
}
