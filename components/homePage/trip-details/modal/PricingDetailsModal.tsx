"use client";

import { X, CheckCircle2 } from "lucide-react";
import { TRIP_DETAILS } from "@/lib/constants/strings";
import { useCreatePublicTripLeadWithPricingMutation } from "@/lib/services/organizer/trip/leads";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { toast } from "@/hooks/use-toast";

export default function PricingDetailsModal({
  pricing,
  selectedPricing,
  tripId,
  onClose,
}: {
  pricing: any;
  selectedPricing: {
    options: Record<string, any>;
    addOns: string[];
    finalPrice: number;
  };
  tripId: string;
  onClose: () => void;
}) {
  const simple = pricing?.simplePricingRequest;
  const dynamic = pricing?.dynamicPricingRequest;
  const addOns = pricing?.addOns || [];

  const organizationId = useOrganizationId();
  const { userData } = useAuthActions();

  const [createLead, { isLoading }] = useCreatePublicTripLeadWithPricingMutation();

  const handleRequestInvite = async () => {
    try {
      // Build complete pricing object with checked flags
      let pricingPayload: any = {
        tripPricingType: pricing?.tripPricingType,
        includesGst: pricing?.includesGst,
        depositRequiredPercent: pricing?.depositRequiredPercent,
        depositRequiredAmount: pricing?.depositRequiredAmount,
        creditOptions: pricing?.creditOptions,
        cancellationPolicy: pricing?.cancellationPolicy,
      };

      // Handle SIMPLE pricing
      if (pricing?.tripPricingType === "SIMPLE") {
        pricingPayload.simplePricingRequest = pricing.simplePricingRequest;
        pricingPayload.dynamicPricingRequest = null;
        pricingPayload.addOns = null;
      }

      // Handle DYNAMIC pricing
      if (pricing?.tripPricingType === "DYNAMIC" && dynamic) {
        pricingPayload.dynamicPricingRequest = {
          pricingCategoryDtos: dynamic.pricingCategoryDtos.map((cat: any) => {
            // For SINGLE type, keep as is
            if (cat.pricingCategoryType === "SINGLE") {
              return cat;
            }

            // For MULTI type, mark selected option as checked
            const selectedOpt = selectedPricing.options?.[cat.categoryName];

            return {
              ...cat,
              pricingCategoryOptionDTOs: cat.pricingCategoryOptionDTOs.map((opt: any) => ({
                ...opt,
                checked: selectedOpt && opt.name === selectedOpt.name,
              })),
            };
          }),
        };
        pricingPayload.simplePricingRequest = null;

        // Handle add-ons
        if (addOns && addOns.length > 0) {
          pricingPayload.addOns = addOns.map((addon: any) => ({
            ...addon,
            checked: selectedPricing.addOns.includes(addon.name),
          }));
        } else {
          pricingPayload.addOns = null;
        }
      }

      // Build pricing summary message for display
      let pricingDetails = `Final price: ₹${selectedPricing.finalPrice}`;

      if (pricing?.tripPricingType === "DYNAMIC") {
        const selectedOpts = Object.entries(selectedPricing.options)
          .map(([cat, opt]: [string, any]) => `${cat}: ${opt.name}`)
          .join(", ");
        pricingDetails += `\nSelected: ${selectedOpts}`;
      }

      if (selectedPricing.addOns.length > 0) {
        pricingDetails += `\nAdd-ons: ${selectedPricing.addOns.join(", ")}`;
      }

      const requestPayload = {
        tripTitle: pricing?.tripTitle || "Trip Inquiry",
        preferredCommunication: "PHONE" as const,
        email: userData?.email || "",
        phone: userData?.mobileNumber || "",
        customerName: `${userData?.firstName} ${userData?.lastName ?? ""}`,
        message: pricingDetails,
        tripLeadsStatus: "OPEN" as const,
        pricingDetails: pricingPayload, // Add complete pricing object
      };

      await createLead({
        organizationId,
        tripId: tripId,
        body: requestPayload,
      }).unwrap();

      toast({
        title: "Request Sent Successfully! ✅",
        description: "Our team will contact you soon.",
      });

      onClose();
    } catch (err: any) {
      console.error("Failed to send request:", err);
      toast({
        title: "Failed to Send Request ❌",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };


  const getFinal = (price: number, discount: number) =>
    Math.round(price - (price * discount) / 100);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between">
          <h3 className="font-bold">
            {TRIP_DETAILS.PRICING_DETAILS_MODAL.TITLE}
          </h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* ================= SIMPLE ================= */}
          {pricing?.tripPricingType === "SIMPLE" && simple && (
            <div className="flex justify-between border-b pb-3">
              <div>
                <p className="font-semibold">
                  {TRIP_DETAILS.PRICING_MODAL.BASE_PACKAGE}
                </p>
                <p className="text-sm text-gray-500">
                  {simple.discountPercent > 0
                    ? `${simple.discountPercent}% OFF`
                    : TRIP_DETAILS.PRICING_MODAL.STANDARD_PRICING}
                </p>
              </div>

              <span className="font-bold text-orange-500">
                ₹
                {getFinal(
                  simple.basePrice,
                  simple.discountPercent
                ).toLocaleString()}
              </span>
            </div>
          )}

          {/* ================= DYNAMIC ================= */}
          {pricing?.tripPricingType === "DYNAMIC" &&
            dynamic?.pricingCategoryDtos?.map((cat: any, i: number) => {
              /* -------- SINGLE (auto included) -------- */
              if (cat.pricingCategoryType === "SINGLE") {
                const opt = cat.pricingCategoryOptionDTOs?.[0];
                if (!opt) return null;

                return (
                  <div key={i} className="flex justify-between border-b pb-3">
                    <div>
                      <p className="font-semibold">{cat.categoryName}</p>
                      <p className="text-sm text-gray-500">
                        {opt.name} (Auto included)
                      </p>
                    </div>
                    <span className="font-bold text-orange-500">
                      ₹{getFinal(opt.price, opt.discount)}
                    </span>
                  </div>
                );
              }

              /* -------- MULTI (ONLY SELECTED) -------- */
              const selectedOpt =
                selectedPricing.options?.[cat.categoryName];

              if (!selectedOpt) return null;

              return (
                <div key={i} className="flex justify-between border-b pb-3">
                  <div>
                    <p className="font-semibold">{cat.categoryName}</p>
                    <p className="text-sm text-gray-500">
                      {selectedOpt.name}
                    </p>
                  </div>
                  <span className="font-bold text-orange-500">
                    ₹
                    {getFinal(
                      selectedOpt.price,
                      selectedOpt.discount
                    )}
                  </span>
                </div>
              );
            })}

          {/* ================= ADD-ONS (ONLY SELECTED) ================= */}
          {selectedPricing.addOns.length > 0 &&
            selectedPricing.addOns.map((name: string, i: number) => {
              const add = addOns.find((a: any) => a.name === name);
              if (!add) return null;

              return (
                <div key={i} className="flex justify-between border-b pb-3">
                  <p className="font-semibold">{add.name}</p>
                  <span className="font-bold text-orange-500">
                    ₹{(add.charge || add.price || 0).toLocaleString()}
                  </span>
                </div>
              );
            })}

          {/* ================= TOTAL ================= */}
          <div className="flex justify-between pt-4 border-t font-bold text-orange-600">
            <p>Total Payable</p>
            <span>
              ₹{selectedPricing.finalPrice.toLocaleString()}
            </span>
          </div>

          {/* ================= EMI ================= */}
          <div className="flex items-center gap-2 text-sm pt-2">
            <CheckCircle2 className="text-green-600" />
            {TRIP_DETAILS.PRICING_DETAILS_MODAL.EMI_AVAILABLE}
          </div>

          {/* ================= CANCELLATION ================= */}
          {pricing?.cancellationPolicy && (
            <div className="border-t pt-4">
              <p className="font-semibold mb-2">
                {TRIP_DETAILS.PRICING_DETAILS_MODAL.CANCELLATION_POLICY}
              </p>
              <div
                className="text-sm text-gray-600 space-y-1"
                dangerouslySetInnerHTML={{ __html: pricing.cancellationPolicy }}
              />
            </div>
          )}

          {/* ================= BUTTONS ================= */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 border py-3 rounded-lg"
            >
              {TRIP_DETAILS.PRICING_DETAILS_MODAL.CANCEL}
            </button>

            <button
              onClick={handleRequestInvite}
              disabled={isLoading}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg disabled:opacity-50"
            >
              {isLoading ? "Requesting..." : TRIP_DETAILS.PRICING_DETAILS_MODAL.REQUEST_INVITE}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
