"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { TRIP_DETAILS } from "@/lib/constants/strings";
import { useCreatePublicTripLeadWithPricingMutation } from "@/lib/services/organizer/trip/leads";
import { useCreateTripBookingMutation } from "@/lib/services/organizer/trip/bookings";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useUserId } from "@/hooks/useUserId";
import { toast } from "@/hooks/use-toast";

export default function PricingDetailsModal({
  pricing,
  selectedPricing,
  tripId,
  tripDbId,
  onClose,
}: {
  pricing: any;
  selectedPricing: {
    options: Record<string, any>;
    addOns: string[];
    finalPrice: number;
    numTravelers: number;
    mode: "BOOK" | "INVITE";
  };
  tripId: string;
  tripDbId: any;
  onClose: () => void;
}) {
  const simple = pricing?.simplePricingRequest;
  const dynamic = pricing?.dynamicPricingRequest;
  const addOns = pricing?.addOns || [];

  const organizationId = useOrganizationId();
  const userId = useUserId();
  const { userData } = useAuthActions();

  // Load Razorpay script on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("razorpay-sdk")) {
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => console.log("Razorpay SDK loaded successfully.");
      script.onerror = () => console.error("Razorpay SDK failed to load.");
      document.body.appendChild(script);
    }
  }, []);

  const [createLead, { isLoading: isLeadLoading }] = useCreatePublicTripLeadWithPricingMutation();
  const [createBooking, { isLoading: isBookingLoading }] = useCreateTripBookingMutation();

  const isLoading = isLeadLoading || isBookingLoading;

  const handleBookNow = async () => {
    try {
      console.log("Creating booking intent...");
      
      console.log("Full Pricing Object:", pricing);
      console.log("Dynamic Pricing DTOs:", dynamic?.pricingCategoryDtos);

      // 1. Map selected options to schema IDs
      const selectedOptions: any[] = [];
      const missingIds: string[] = [];

      if (dynamic?.pricingCategoryDtos) {
        dynamic.pricingCategoryDtos.forEach((cat: any) => {
          if (cat.pricingCategoryType === "SINGLE") {
            const opt = cat.pricingCategoryOptionDTOs?.[0];
            const catId = cat.id || cat.pricingCategoryId || cat.publicId;
            const optId = opt?.id || opt?.pricingCategoryOptionId || opt?.publicId;
            
            console.log(`Checking category ${cat.categoryName}: catId=${catId}, optId=${optId}`);

            if (catId && optId) {
              selectedOptions.push({
                pricingCategoryId: catId,
                pricingCategoryOptionId: optId
              });
            } else {
              missingIds.push(`${cat.categoryName} (SINGLE)`);
            }
          } else {
            const selectedOpt = selectedPricing.options[cat.categoryName];
            const catId = cat.id || cat.pricingCategoryId || cat.publicId;
            const optId = selectedOpt?.id || selectedOpt?.pricingCategoryOptionId || selectedOpt?.publicId;

            console.log(`Checking category ${cat.categoryName}: catId=${catId}, optId=${optId}`);

            if (catId && optId) {
              selectedOptions.push({
                pricingCategoryId: catId,
                pricingCategoryOptionId: optId
              });
            } else if (selectedOpt) {
              missingIds.push(`${cat.categoryName} (MULTI)`);
            }
          }
        });
      }

      // 2. Map add-ons to schema IDs
      const addOnIds = selectedPricing.addOns.map(name => {
        const fullAddon = addOns.find((a: any) => a.name === name);
        const addonId = fullAddon?.id || fullAddon?.addOnId || fullAddon?.publicId;
        if (!addonId) missingIds.push(`Addon: ${name}`);
        return { addOnId: addonId };
      }).filter(a => a.addOnId);

      // 3. Trip ID (Numeric if possible from prop)
      const finalTripId = tripDbId || pricing?.tripId || tripId;

      const bookingPayload = {
        tripId: finalTripId,
        groupSize: selectedPricing.numTravelers,
        selectedOptions,
        addOns: addOnIds
      };

      console.log(`OrganizationID: ${organizationId}`);
      console.log("Final Booking JSON Payload:", JSON.stringify(bookingPayload, null, 2));

      if (missingIds.length > 0) {
        console.error("Missing IDs for these items:", missingIds);
        toast({
          title: "Technical Issue",
          description: `Some IDs are missing in the data: ${missingIds.join(", ")}. Checking logs.`,
          variant: "destructive",
        });
      }

      // 4. Call Booking API
      const bookingData = await createBooking({
        organizationId,
        tripPublicId: tripId, // Use prop (UUID) for URL
        userPublicId: userId || userData?.userPublicId || "",
        body: bookingPayload
      }).unwrap();

      console.log("Booking created successfully:", JSON.stringify(bookingData, null, 2));
      
      const savedBookingId = bookingData?.bookingId;
      const savedBookingRef = bookingData?.bookingRef;
      const savedTotalAmount = bookingData?.totalAmount;

      if (!savedBookingId) {
        throw new Error("Booking response was successful but missing bookingId.");
      }

      // 4. Handle Redirection / Razorpay
      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!rzpKey || rzpKey === "rzp_test_placeholder") {
        console.warn("Razorpay Key ID missing. Redirecting to confirmation page directly (Test Mode).");
        toast({
          title: "Booking Created! 🚀",
          description: "Redirecting to confirmation page...",
        });
        
        setTimeout(() => {
          onClose();
          window.location.href = `/home/booking-confirmation/${savedBookingRef}`;
        }, 1500);
        return;
      }

      // 5. Initiate Razorpay
      if (!(window as any).Razorpay) {
        console.error("Razorpay SDK not loaded.");
        toast({
          title: "Booking Success, but Payment SDK failed",
          description: "Redirecting to your booking details...",
        });
        window.location.href = `/home/booking-confirmation/${savedBookingRef}`;
        return;
      }

      const options = {
        key: rzpKey,
        amount: Math.round((savedTotalAmount || 0) * 100), // Amount in paise
        currency: "INR",
        name: "Ghumakker",
        description: `Trip Booking: ${savedBookingRef}`,
        image: "/logo.svg",
        handler: function (response: any) {
          toast({
            title: "Payment Successful! 🎉",
            description: `Booking #${savedBookingRef} confirmed.`,
          });
          onClose();
          window.location.href = `/home/booking-confirmation/${savedBookingRef}`;
        },
        prefill: {
          name: `${userData?.firstName} ${userData?.lastName ?? ""}`,
          email: userData?.email || "",
          contact: userData?.mobileNumber || "",
        },
        notes: {
          booking_id: savedBookingId,
          booking_ref: savedBookingRef,
          trip_id: tripId,
        },
        theme: {
          color: "#FF3E3E",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);

      rzp1.on("payment.failed", function (response: any) {
        console.error("Payment Failed:", response.error);
        toast({
          title: "Payment Failed ❌",
          description: response.error.description || "The payment could not be processed. Please try again.",
          variant: "destructive",
        });
      });

      rzp1.open();

    } catch (err: any) {
      console.error("Booking creation failed (Full Details):", JSON.stringify(err, null, 2));
      console.error("Original Error Object:", err);
      toast({
        title: "Booking Failed ❌",
        description: err?.data?.message || "Something went wrong while creating your booking. Check console logs.",
        variant: "destructive",
      });
    }
  };

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
      const prefix = selectedPricing.mode === "BOOK" ? "Booking" : "Inquiry";
      let pricingDetails = `${prefix} for ₹${selectedPricing.finalPrice} (${selectedPricing.numTravelers} travelers)`;

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
        title: "Booking Request Sent! ✅",
        description: "Our team will contact you soon to finalize your trip.",
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
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between z-10">
          <h3 className="font-bold">
            {selectedPricing.mode === "BOOK" ? "Confirm Your Booking" : "Request Trip Invite"}
          </h3>
          <button onClick={onClose} className="cursor-pointer">
            <X />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* ================= TRAVELERS ================= */}
          <div className="flex justify-between border-b pb-3">
            <p className="font-semibold text-gray-700">Travelers</p>
            <span className="font-bold text-gray-900">{selectedPricing.numTravelers} Persons</span>
          </div>
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

              <span className="font-bold text-primary">
                ₹
                {(getFinal(
                  simple.basePrice,
                  simple.discountPercent
                ) * selectedPricing.numTravelers).toLocaleString()}
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
                    <span className="font-bold text-primary">
                      ₹{(getFinal(opt.price, opt.discount) * selectedPricing.numTravelers).toLocaleString()}
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
                  <span className="font-bold text-primary">
                    ₹
                    {(getFinal(
                      selectedOpt.price,
                      selectedOpt.discount
                    ) * selectedPricing.numTravelers).toLocaleString()}
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
                  <span className="font-bold text-primary">
                    ₹{((add.charge || add.price || 0) * selectedPricing.numTravelers).toLocaleString()}
                  </span>
                </div>
              );
            })}

          {/* ================= TOTAL ================= */}
          <div className="flex justify-between pt-4 border-t font-bold text-primary">
            <p>Total Payable</p>
            <span>
              ₹{selectedPricing.finalPrice.toLocaleString()}
            </span>
          </div>

          {/* ================= EMI ================= */}
          <div className="flex items-center gap-2 text-sm pt-2">
            <CheckCircle2 className="text-primary" />
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
              onClick={selectedPricing.mode === "BOOK" ? handleBookNow : handleRequestInvite}
              disabled={isLoading}
              className="flex-1 bg-brand-gradient text-white py-3 rounded-lg disabled:opacity-50 cursor-pointer shadow-lg hover:opacity-90 font-bold transition-all active:scale-[0.98]"
            >
              {isLoading ? "Processing..." : selectedPricing.mode === "BOOK" ? "Book Now" : "Request Invite"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
