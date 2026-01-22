"use client";
import React from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useGetOrganizerFaqByIdQuery } from "@/lib/services/organizer/trip/library/faq";
import { AddFAQForm } from "../../AddFAQForm";

type FAQModuleProps = {
  updateId?: number | null;
  onCancel: () => void;
  onSave: (data: { question: string; answer: string }) => void;
};

export function FAQModule({ updateId, onCancel, onSave }: FAQModuleProps) {
  const organizationId = useOrganizationId();

  const { data, isLoading, isFetching, error } = useGetOrganizerFaqByIdQuery(
    organizationId && updateId
      ? { organizationId, faqId: updateId }
      : skipToken
  );

  if (isLoading || isFetching) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading FAQ details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load FAQ details.
      </div>
    );
  }

  // Normalize data
  const initialData = data
    ? {
        question: data.name ?? "",
        answer: data.answer ?? "",
      }
    : undefined;

  return (
    <AddFAQForm
      mode="library"
      updateId={updateId}
      onCancel={onCancel}
      onSave={onSave}
      initialData={initialData}
    />
  );
}
