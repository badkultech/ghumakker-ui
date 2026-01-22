"use client";
import React from "react";
import { AddMealForm } from "@/components/library/AddMealForm";
import { useGetMealByIdQuery } from "@/lib/services/organizer/trip/library/meal";
import { skipToken } from "@reduxjs/toolkit/query";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { normalizeDocuments as normalize } from "../utils/documentNormalizer";
import type { ModuleProps } from "./types";

export const MealModule: React.FC<ModuleProps> = ({ updateId, onCancel, onSave }) => {
  const organizationId = useOrganizationId();
  const isEdit = !!updateId;

  const { data, isLoading, isFetching } = useGetMealByIdQuery(
    organizationId && updateId ? { organizationId, mealId: updateId } : skipToken
  );

  if (isEdit && (isLoading || isFetching)) {
    return <div className="text-center text-gray-500 py-10">Loading meal...</div>;
  }
  if (isEdit && !data) {
    return <div className="text-center text-gray-500 py-10">Unable to load meal data.</div>;
  }

  const initialData = isEdit && data ? { ...data, documents: normalize(data.documents || []) } : undefined;

  return <AddMealForm mode="library" initialData={initialData} onCancel={onCancel} onSave={onSave} />;
};
