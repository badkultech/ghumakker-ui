"use client";

import { useState } from "react";
import {
  Calendar,
  Pencil,
  Trash2,
  Car,
  Home,
  Utensils,
  Activity,
} from "lucide-react";
import { ModalWrapper } from "@/components/ui/ModalWrapper";
import { AddDayDescriptionForm } from "@/components/library/AddDayDescriptionForm";
import { AddTransitForm } from "@/components/library/AddTransitForm";
import { AddStayForm } from "@/components/library/AddStayForm";
import { AddMealForm } from "@/components/library/AddMealForm";
import { AddActivityForm } from "@/components/library/AddActivityForm";
import { useDayDescription } from "./useDayDescription";
import { useTransit } from "./useTransit";
import { useStay } from "./useStay";
import { useMeal } from "./useMeal";
import { useActivity } from "./useActivity";

interface DetailsOptionsProps {
  organizationId: string;
  tripPublicId: string;
  dayDetailId: string;
  items: any[];
  onLocalChange: (op: "create" | "update" | "delete", item: any) => void;
}

export function DetailsOptions({
  organizationId,
  tripPublicId,
  dayDetailId,
  items = [],
  onLocalChange,
}: DetailsOptionsProps) {
  const [modalType, setModalType] = useState<
    "event" | "transit" | "stay" | "meal" | "activity" | null
  >(null);

  const [initialData, setInitialData] = useState<any>(null);
  const dayDesc = useDayDescription({ organizationId, tripPublicId, dayDetailId });
  const transit = useTransit({ organizationId, tripPublicId, dayDetailId });
  const stay = useStay({ organizationId, tripPublicId, dayDetailId });
  const meal = useMeal({ organizationId, tripPublicId, dayDetailId });
  const activity = useActivity({ organizationId, tripPublicId, dayDetailId });

  const handleSave = async (formData: any, documents: any[] = [], saveInLibrary?: boolean) => {
    let apiResult = null;

    const itemId = getItemId(initialData);
    const isEdit = Boolean(itemId);

    try {
      switch (modalType) {
        case "event":
          apiResult = await dayDesc.handleSave(formData, itemId, documents);
          break;

        case "transit":
          apiResult = await transit.handleTransitSave(formData, itemId, documents);
          break;

        case "stay":
          apiResult = await stay.handleStaySave(formData, itemId, documents);
          break;

        case "meal":
          apiResult = await meal.handleMealSave(formData, itemId, documents);
          break;

        case "activity":
          apiResult = await activity.handleActivitySave(formData, itemId, documents, saveInLibrary);
          break;
      }

      onLocalChange(isEdit ? "update" : "create", apiResult);
    } catch (err) {
      console.error("❌ Save failed:", err);
    }

    setModalType(null);
    setInitialData(null);
  };

  const handleDelete = async (item: any) => {
    const itemId = item.id || item.tripItemId;

    if (!itemId) {
      console.error("❌ No valid item id found for deletion");
      return;
    }
    try {
      switch (item.tripType) {
        case "DAY_DESCRIPTION":
          await dayDesc.handleDelete(itemId);
          break;
        case "TRANSIT":
          await transit.handleTransitDelete(itemId);
          break;
        case "STAY":
          await stay.handleStayDelete(itemId);
          break;
        case "MEAL":
          await meal.handleMealDelete(itemId);
          break;
        case "ACTIVITY":
          await activity.handleActivityDelete(itemId);
          break;
      }

      onLocalChange("delete", { id: itemId });
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  const getItemId = (item: any) => item?.id || item?.tripItemId;

  const handleEditClick = async (item: any) => {
    const itemId = item.id || item.tripItemId;
    if (!itemId) return;

    let mapped = null;
    const getModalTypeFromTripType = (tripType: string) => {
      switch (tripType) {
        case "DAY_DESCRIPTION":
          return "event";
        case "TRANSIT":
          return "transit";
        case "STAY":
          return "stay";
        case "MEAL":
          return "meal";
        case "ACTIVITY":
          return "activity";
        default:
          return null;
      }
    };


    switch (item.tripType) {
      case "DAY_DESCRIPTION":
        const id = item.id || item.tripItemId;
        mapped = await dayDesc.handleEdit({ ...item, id });
        break;


      case "TRANSIT":
        mapped = await transit.handleTransitEdit(itemId);
        break;

      case "STAY":
        mapped = await stay.handleStayEdit(itemId);
        break;

      case "MEAL":
        mapped = await meal.handleMealEdit(itemId);
        break;

      case "ACTIVITY":
        mapped = await activity.handleActivityEdit(itemId);
        break;
    }

    setInitialData(mapped);
    setModalType(getModalTypeFromTripType(item.tripType));

  };

  return (
    <div className="flex flex-col gap-6 mt-4">
      <div className="flex w-full gap-4">

        {[
          { type: "event", label: "Day Description", icon: <Calendar size={22} />, single: true },
          { type: "transit", label: "Transit", icon: <Car size={22} />, single: false },
          { type: "stay", label: "Stay", icon: <Home size={22} />, single: false },
          { type: "meal", label: "Meal", icon: <Utensils size={22} />, single: false },
          { type: "activity", label: "Activity", icon: <Activity size={22} />, single: false },
        ].map((btn) => {
          const isActive = modalType === btn.type;

          const hasDayDescription = items.some(
            (i) => i.tripType === "DAY_DESCRIPTION"
          );

          const disabled =
            btn.type === "event" && hasDayDescription ? true : false;

          const colorMap: any = {
            event: "from-orange-100 to-orange-50 border-orange-400",
            transit: "from-blue-100 to-blue-50 border-blue-400",
            stay: "from-green-100 to-green-50 border-green-400",
            meal: "from-rose-100 to-rose-50 border-rose-400",
            activity: "from-yellow-100 to-yellow-50 border-yellow-400",
          };

          return (
            <button
              key={btn.type}
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  setModalType(btn.type as any);
                  setInitialData(null);
                }
              }}
              className={`
          flex flex-col items-center justify-center gap-2
          flex-1 h-26 rounded-2xl shadow-md border
          bg-gradient-to-b
          transition-all duration-200
          ${disabled
                  ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-300"
                  : isActive
                    ? colorMap[btn.type] + " scale-[1.03]"
                    : "bg-white border-gray-200"
                }
        `}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                {btn.icon}
              </div>

              <span className="text-[13px] font-medium text-gray-700">
                {btn.label}
              </span>
            </button>
          );
        })}
      </div>


      {/* List items */}
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No items added yet.</p>
      ) : (
        <div className="space-y-5 w-full">

          {items.map((item, index) => {
            const colorMap: any = {
              DAY_DESCRIPTION: "border-orange-400 bg-orange-50",
              TRANSIT: "border-blue-400 bg-blue-50",
              STAY: "border-green-400 bg-green-50",
              MEAL: "border-rose-400 bg-rose-50",
              ACTIVITY: "border-yellow-400 bg-yellow-50",
            };

            const iconMap: any = {
              DAY_DESCRIPTION: <Calendar className="text-orange-500" size={20} />,
              TRANSIT: <Car className="text-blue-500" size={20} />,
              STAY: <Home className="text-green-500" size={20} />,
              MEAL: <Utensils className="text-rose-500" size={20} />,
              ACTIVITY: <Activity className="text-yellow-500" size={20} />,
            };

            const colorClass = colorMap[item.tripType] || "border-gray-300 bg-gray-50";

            return (
              <div
                key={`${item.tripType}-${(item.id || item.tripItemId)}-${index}`}
                className={`rounded-xl border-l-4 ${colorClass} p-5 shadow-sm`}
              >

                {/* TOP ROW */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    {/* Icon Box */}
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow border">
                      {iconMap[item.tripType]}
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <p className="font-semibold text-gray-800 text-[15px]">
                        {item.name || item.title || "Untitled"}
                      </p>

                      {(item.location || item.from || item.to) && (
                        <p className="text-gray-600 text-sm">
                          {item.location ||
                            `${item.from || ""} ${item.to ? "to " + item.to : ""}`}
                        </p>
                      )}

                      {/* Time */}
                      {item.time || item.startTime || item.endTime ? (
                        <p className="text-gray-500 text-xs mt-1">
                          {item.time ||
                            `${item.startTime || ""}${item.endTime ? " - " + item.endTime : ""
                            }`}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* EDIT + DELETE */}
                  <div className="flex gap-2">
                    <button
                      className="p-2 rounded-full hover:bg-gray-200 transition"
                      onClick={() => handleEditClick(item)}
                    >
                      <Pencil size={14} className="text-gray-700" />
                    </button>

                    <button
                      className="p-2 rounded-full hover:bg-red-100 transition text-red-500"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* IMAGES ROW */}
                {item.documents?.length > 0 && (
                  <div className="flex gap-3 mt-3 flex-wrap">
                    {item.documents
                      .filter((d: any) => d?.url || d?.file)
                      .map((doc: any, idx: number) => {

                        const src =
                          doc?.file instanceof File
                            ? URL.createObjectURL(doc.file)
                            : doc?.url
                              ? doc.url
                              : typeof doc === "string"
                                ? doc
                                : null;

                        return src ? (
                          <img
                            key={idx}
                            src={src}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                        ) : (
                          <div
                            key={idx}
                            className="w-20 h-20 rounded-lg border bg-gray-200 flex items-center justify-center text-xs text-gray-500"
                          >
                            No Image
                          </div>
                        );
                      })}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* --------- MODALS --------- */}

      {modalType === "event" && (
        <ModalWrapper onClose={() => setModalType(null)}>
          <AddDayDescriptionForm
            header={initialData ? "Edit Day Description" : "Add Day Description"}
            initialData={initialData}
            onCancel={() => setModalType(null)}
            onSave={handleSave}
          />
        </ModalWrapper>
      )}

      {modalType === "transit" && (
        <ModalWrapper onClose={() => setModalType(null)}>
          <AddTransitForm
            header={initialData ? "Edit Transit" : "Add Transit"}
            initialData={initialData}
            onCancel={() => setModalType(null)}
            onSave={handleSave}
          />
        </ModalWrapper>
      )}

      {modalType === "stay" && (
        <ModalWrapper onClose={() => setModalType(null)}>
          <AddStayForm
            header={initialData ? "Edit Stay" : "Add Stay"}
            initialData={initialData}
            onCancel={() => setModalType(null)}
            onSave={handleSave}
          />
        </ModalWrapper>
      )}

      {modalType === "meal" && (
        <ModalWrapper onClose={() => setModalType(null)}>
          <AddMealForm
            header={initialData ? "Edit Meal" : "Add Meal"}
            initialData={initialData}
            onCancel={() => setModalType(null)}
            onSave={handleSave}
          />
        </ModalWrapper>
      )}

      {modalType === "activity" && (
        <ModalWrapper onClose={() => setModalType(null)}>
          <AddActivityForm
            header={initialData ? "Edit Activity" : "Add Activity"}
            initialData={initialData}
            onCancel={() => setModalType(null)}
            onSave={handleSave}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
