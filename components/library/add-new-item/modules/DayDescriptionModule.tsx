"use client";
import React from "react";
import { AddDayDescriptionForm } from "@/components/library/AddDayDescriptionForm";
import { useGetDayDescriptionByIdQuery } from "@/lib/services/organizer/trip/library/day-description";
import { skipToken } from "@reduxjs/toolkit/query";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { normalizeDocuments as normalize } from "../utils/documentNormalizer";
import type { ModuleProps } from "./types";

export const EventModule: React.FC<ModuleProps> = ({ updateId, onCancel, onSave }) => {
  const organizationId = useOrganizationId();
  const isEdit = !!updateId;

  const { data, isLoading, isFetching } = useGetDayDescriptionByIdQuery(
    organizationId && updateId ? { organizationId, dayDescriptionId: updateId } : skipToken
  );

  if (isEdit && (isLoading || isFetching)) {
    return <div className="text-center text-gray-500 py-10">Loading event...</div>;
  }
  if (isEdit && !data) {
    return <div className="text-center text-gray-500 py-10">Unable to load event data.</div>;
  }

  const initialData = isEdit && data ? { ...data, documents: normalize(data.documents || []) } : undefined;

  return <AddDayDescriptionForm mode="library" initialData={initialData} onCancel={onCancel} onSave={onSave} />;
};
