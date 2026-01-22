"use client";

import { useRef, useState } from "react";
import {
  useLazyGetTransitByIdQuery,
  useCreateTransitMutation,
  useUpdateTransitMutation,
  useDeleteTransitMutation,
} from "@/lib/services/organizer/trip/itinerary/day-details/transit";
import { useCreateOrganizerTransitMutation } from "@/lib/services/organizer/trip/library/transit";
import { mapTransitToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

export function useTransit({ organizationId, tripPublicId, dayDetailId }: any) {
  const [editingTransit, setEditingTransit] = useState<any>(null);
  const [initialTransitData, setInitialTransitData] = useState<any>(null);
  const cacheRef = useRef<Record<string, any>>({});
  const [getTransitById] = useLazyGetTransitByIdQuery();
  const [createTransit] = useCreateTransitMutation();
  const [updateTransit] = useUpdateTransitMutation();
  const [deleteTransit] = useDeleteTransitMutation();

  const [createLibraryTransit] = useCreateOrganizerTransitMutation();

  const handleTransitEdit = async (itemId: string | number) => {
    if (cacheRef.current[itemId]) {
      setInitialTransitData(cacheRef.current[itemId]);
      return cacheRef.current[itemId];
    }
    const res = await getTransitById({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(itemId)
    }).unwrap();

    const data = (res as any)?.data ?? res;

    const mapped = {
      id: itemId,
      name: data.name || "",
      fromLocation: data.fromLocation,
      toLocation: data.toLocation,
      startTime: data.startTime?.slice(0, 5) || "",
      endTime: data.endTime?.slice(0, 5) || "",
      vehicleTypes: data.vehicleTypes || [],
      customVehicleType: data.customVehicleType || "",
      arrangedBy: data.arrangedBy || "ORGANIZER",
      description: data.description || "",
      packingSuggestion: data.packingSuggestion || "",
      documents: data.documents || []
    };
    cacheRef.current[itemId] = mapped;
    setEditingTransit({ id: itemId });
    setInitialTransitData(mapped);

    return mapped;
  };
  const handleTransitSave = async (
    data: any,
    itemId?: number,
    documents: any[] = []
  ) => {
    try {
      const form = mapTransitToFormData(
        {
          ...data,
          saveInLibrary: data.saveInLibrary ?? false,
        },
        documents
      );

      let res;

      if (itemId) {
        res = await updateTransit({
          organizationId,
          tripPublicId,
          dayDetailId,
          itemId: String(itemId),
          data: form,
        }).unwrap();

        delete cacheRef.current[String(itemId)];

        return {
          ...res,
          id: res.tripItemId,
          tripItemId: res.tripItemId || itemId,
          tripType: "TRANSIT",
        };
      }

      res = await createTransit({
        organizationId,
        tripPublicId,
        dayDetailId,
        data: form,
      }).unwrap();

      if (data.saveInLibrary) {
        try {
          await createLibraryTransit({
            organizationId,
            data: form,
          }).unwrap();
        } catch (libErr) {
          console.warn("Library save failed (but trip saved ok)", libErr);
        }
      }

      return {
        ...res,
        id: res.tripItemId,
        tripItemId: res.tripItemId,
        tripType: "TRANSIT",
      };
    } catch (err) {
      console.error("Transit save error:", err);
      throw err;
    }
  };



  const handleTransitDelete = async (id: number) => {
    try {
      await deleteTransit({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(id),
      }).unwrap();
      delete cacheRef.current[String(id)];
      return { id };
    } catch (err) {
      console.error("Transit delete error:", err);
      throw err;
    }
  };

  return {
    editingTransit,
    initialTransitData,
    setEditingTransit,
    setInitialTransitData,
    handleTransitSave,
    handleTransitEdit,
    handleTransitDelete,
  };
}

