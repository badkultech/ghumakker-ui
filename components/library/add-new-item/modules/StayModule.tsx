"use client";
import React from "react";
import { AddStayForm } from "@/components/library/AddStayForm";
import { useGetStayByIdQuery } from "@/lib/services/organizer/trip/library/stay";
import { skipToken } from "@reduxjs/toolkit/query";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { normalizeDocuments as normalize } from "../utils/documentNormalizer";
import type { ModuleProps } from "./types";

export const StayModule: React.FC<ModuleProps> = ({ updateId, onCancel, onSave }) => {
  const organizationId = useOrganizationId();
  const isEdit = !!updateId;

  const { data, isLoading, isFetching } = useGetStayByIdQuery(
    organizationId && updateId ? { organizationId, stayId: updateId } : skipToken
  );

  if (isEdit && (isLoading || isFetching)) {
    return <div className="text-center text-gray-500 py-10">Loading stay details...</div>;
  }

  if (isEdit && !data) {
    return <div className="text-center text-gray-500 py-10">Unable to load stay data.</div>;
  }

  const initialData = isEdit && data ? { ...data, documents: normalize(data.documents || []) } : undefined;

  return <AddStayForm mode="library" initialData={initialData} onCancel={onCancel} onSave={onSave} />;
};
