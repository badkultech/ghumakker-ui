"use client";
import React from "react";
import { AddActivityForm } from "@/components/library/AddActivityForm";
import { useGetActivityByIdQuery } from "@/lib/services/organizer/trip/library/activity";
import { skipToken } from "@reduxjs/toolkit/query";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { normalizeDocuments as normalize } from "../utils/documentNormalizer";
import type { ModuleProps } from "./types";

export const ActivityModule: React.FC<ModuleProps> = ({ updateId, onCancel, onSave }) => {
  const organizationId = useOrganizationId();
  const isEdit = !!updateId;

  const { data, isLoading, isFetching } = useGetActivityByIdQuery(
    organizationId && updateId ? { organizationId, activityId: updateId } : skipToken
  );

  if (isEdit && (isLoading || isFetching)) {
    return <div className="text-center text-gray-500 py-10">Loading activity...</div>;
  }
  if (isEdit && !data) {
    return <div className="text-center text-gray-500 py-10">Unable to load activity data.</div>;
  }

  const initialData = isEdit && data ? { ...data, documents: normalize(data.documents || []) } : undefined;

  return <AddActivityForm mode="library" initialData={initialData} onCancel={onCancel} onSave={onSave} />;
};
