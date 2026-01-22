"use client";
import React from "react";
import { AddTransitForm } from "@/components/library/AddTransitForm";
import { useGetOrganizerTransitByIdQuery } from "@/lib/services/organizer/trip/library/transit";
import { skipToken } from "@reduxjs/toolkit/query";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { normalizeDocuments as normalize } from "../utils/documentNormalizer";
import type { ModuleProps } from "./types";

export const TransitModule: React.FC<ModuleProps> = ({ updateId, onCancel, onSave }) => {
  const organizationId = useOrganizationId();
  const isEdit = !!updateId;

  const { data, isLoading, isFetching } = useGetOrganizerTransitByIdQuery(
    organizationId && updateId ? { organizationId, transitId: updateId } : skipToken
  );

  if (isEdit && (isLoading || isFetching)) {
    return <div className="text-center text-gray-500 py-10">Loading transit...</div>;
  }
  if (isEdit && !data) {
    return <div className="text-center text-gray-500 py-10">Unable to load transit data.</div>;
  }

  const initialData = isEdit && data ? { ...data, documents: normalize(data.documents || []) } : undefined;

  return <AddTransitForm mode="library" initialData={initialData} onCancel={onCancel} onSave={onSave} />;
};
