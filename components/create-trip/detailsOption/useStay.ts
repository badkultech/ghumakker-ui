"use client";

import { useRef, useState } from "react";
import {
  useCreateTripStayMutation,
  useUpdateTripStayMutation,
  useDeleteTripStayMutation,
  useLazyGetTripStayByIdQuery,
} from "@/lib/services/organizer/trip/itinerary/day-details/stay";

import { mapStayToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";
import { useCreateStayMutation } from "@/lib/services/organizer/trip/library/stay";

function normalizeDocuments(docs: any[]) {
  if (!Array.isArray(docs)) return [];

  return docs.map((d) => ({
    id: d.id ?? null,
    url: d.url ?? "",
    type: d.type ?? "IMAGE",
    file: null,
    markedForDeletion: false,
  }));
}

export function useStay({ organizationId, tripPublicId, dayDetailId }: any) {
  const [initialStayData, setInitialStayData] = useState<any>(null);
  const cacheRef = useRef<Record<string, any>>({});
  const [getStayById] = useLazyGetTripStayByIdQuery();
  const [createStay] = useCreateTripStayMutation();
  const [updateStay] = useUpdateTripStayMutation();
  const [deleteStay] = useDeleteTripStayMutation();
  const [createLibraryStay] = useCreateStayMutation();

  const handleStayEdit = async (itemId: number) => {
    if (cacheRef.current[itemId]) {
      setInitialStayData(cacheRef.current[itemId]);
      return cacheRef.current[itemId];
    }
    const res = await getStayById({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(itemId),
    }).unwrap();

    const data = res;

    const mapped = {
      id: itemId,
      name: data.name || "",
      location: data.location || "",
      checkInTime: data.checkInTime?.slice(0, 5) || "",
      checkOutTime: data.checkOutTime?.slice(0, 5) || "",
      description: data.description || "",
      packingSuggestion: data.packingSuggestion || "",
      sharingType: data.sharingType || "",
      documents: normalizeDocuments(data.documents ?? []),
    };
    cacheRef.current[itemId] = mapped;
    setInitialStayData(mapped);
    return mapped;
  };

  const handleStaySave = async (
    data: any,
    itemId?: number,
    documents: any[] = []
  ) => {
    try {
      const form = mapStayToFormData(
        {
          ...data,
          saveInLibrary: data.saveInLibrary ?? false,
        },
        documents
      );

      let res;
      if (itemId) {
        res = await updateStay({
          organizationId,
          tripPublicId,
          dayDetailId,
          itemId: String(itemId),
          data: form,
        }).unwrap();

        delete cacheRef.current[String(itemId)];

        return {
          ...res,
          documents: normalizeDocuments(res.documents ?? []),
          tripType: "STAY",
        };
      }
      res = await createStay({
        organizationId,
        tripPublicId,
        dayDetailId,
        data: form,
      }).unwrap();
      if (data.saveInLibrary) {
        try {
          await createLibraryStay({
            organizationId,
            data: form,
          }).unwrap();
        } catch (e) {
          console.warn("Stay saved, but failed to save in library", e);
        }
      }

      return {
        ...res,
        documents: normalizeDocuments(res.documents ?? []),
        tripType: "STAY",
      };
    } catch (err) {
      console.error("Stay save error:", err);
      throw err;
    }
  };

  const handleStayDelete = async (id: number) => {
    await deleteStay({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(id),
    }).unwrap();
    delete cacheRef.current[String(id)];
    return { id };
  };

  return {
    initialStayData,
    handleStayEdit,
    handleStaySave,
    handleStayDelete,
  };
}
