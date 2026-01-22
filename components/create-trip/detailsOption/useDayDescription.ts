"use client";

import { useRef, useState } from "react";
import {
  useCreateTripDayDescriptionMutation,
  useUpdateTripDayDescriptionMutation,
  useDeleteTripDayDescriptionMutation,
  useLazyGetTripDayDescriptionByIdQuery
} from "@/lib/services/organizer/trip/itinerary/day-details/day-description";

import { mapDayDescriptionToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";
import { useCreateDayDescriptionMutation } from "@/lib/services/organizer/trip/library/day-description";

/* ---------------------- NORMALIZE SERVER DOCS ---------------------- */
function normalizeDocuments(docs: any[]) {
  if (!Array.isArray(docs)) return [];

  return docs
    .filter((d) => d?.url || d?.file)
    .map((d) => ({
      id: null,
      url: d.url ?? null,
      type: d.type ?? "IMAGE",
      file: d.file ?? null,
      markedForDeletion: false,
    }));
}


/* ------------------------- HOOK --------------------------- */
export function useDayDescription({ organizationId, tripPublicId, dayDetailId }: any) {
  const [initialData, setInitialData] = useState<any | null>(null);
  const cacheRef = useRef<Record<string, any>>({});

  const [getDayDescById] = useLazyGetTripDayDescriptionByIdQuery();
  const [createDesc] = useCreateTripDayDescriptionMutation();
  const [updateDesc] = useUpdateTripDayDescriptionMutation();
  const [deleteDesc] = useDeleteTripDayDescriptionMutation();
  const [createLibraryDesc] = useCreateDayDescriptionMutation();


  /* ---------------------- EDIT ---------------------- */
  const handleEdit = async (item: any) => {
    const itemId = item.id || item.tripItemId;

    if (cacheRef.current[itemId]) {
      setInitialData(cacheRef.current[itemId]);
      return cacheRef.current[itemId];
    }

    const res = await getDayDescById({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(itemId),
    }).unwrap();

    const data = res?.data ?? res;

    const mapped = {
      id: itemId,
      name: data.name ?? "",
      description: data.description ?? "",
      location: data.location ?? "",
      packingSuggestion: data.packingSuggestion ?? "",
      time:
        typeof data.time === "string"
          ? data.time.slice(0, 5)
          : data.time?.hour !== undefined
            ? `${String(data.time.hour).padStart(2, "0")}:${String(
              data.time.minute
            ).padStart(2, "0")}`
            : "",
      documents: data.documents || [],
    };
    cacheRef.current[itemId] = mapped;
    setInitialData(mapped);
    return mapped;
  };

  /* ---------------------- SAVE ---------------------- */
  const handleSave = async (
    data: any,
    itemId?: number,
    documents: any[] = []
  ) => {
    const form = mapDayDescriptionToFormData(
      {
        ...data,
        time: data.time,
      },
      documents
    );

    let res;

    if (itemId) {
      res = await updateDesc({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(itemId),
        data: form,
      }).unwrap();

      delete cacheRef.current[String(itemId)];
    } else {
      res = await createDesc({
        organizationId,
        tripPublicId,
        dayDetailId,
        data: form,
      }).unwrap();
    }

    if (data?.saveInLibrary) {
      const libForm = mapDayDescriptionToFormData(
        {
          title: data.title,
          description: data.description,
          location: data.location,
          time: data.time,
          packingSuggestion: data.packing,
        },
        documents
      );

      await createLibraryDesc({
        organizationId,
        data: libForm,
      }).unwrap();
    }

    return {
      ...res,
      tripType: "DAY_DESCRIPTION",
      tripItemId: res.tripItemId,
      id: res.tripItemId,
      documents: normalizeDocuments(res.documents ?? []),
    };
  };

  const handleDelete = async (id: number) => {
    await deleteDesc({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(id),
    }).unwrap();
    delete cacheRef.current[String(id)];
    return { id };
  };

  return {
    initialData,
    handleEdit,
    handleSave,
    handleDelete,
  };
}
