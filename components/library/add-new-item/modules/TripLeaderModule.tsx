"use client";
import React from "react";
import { AddTripLeaderForm } from "@/components/library/AddTripLeaderForm";
import { useGetGroupLeaderByIdQuery } from "@/lib/services/organizer/trip/library/leader";
import { skipToken } from "@reduxjs/toolkit/query";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { normalizeDocuments as normalize } from "../utils/documentNormalizer";
import type { ModuleProps } from "./types";

export const TripLeaderModule: React.FC<ModuleProps> = ({ updateId, onCancel, onSave }) => {
  const organizationId = useOrganizationId();
  const isEdit = !!updateId;

  const { data, isLoading, isFetching } = useGetGroupLeaderByIdQuery(
    organizationId && updateId ? { organizationId, leaderId: updateId } : skipToken
  );

  if (isEdit && (isLoading || isFetching)) {
    return <div className="text-center text-gray-500 py-10">Loading leader...</div>;
  }
  if (isEdit && !data) {
    return <div className="text-center text-gray-500 py-10">Unable to load leader data.</div>;
  }

  const initialData = isEdit && data ? { ...data, documents: normalize(data.documents || []) } : undefined;

  return <AddTripLeaderForm mode="library" initialData={initialData} onCancel={onCancel} onSave={onSave} />;
};
