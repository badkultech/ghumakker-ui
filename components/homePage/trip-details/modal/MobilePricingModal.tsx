"use client";

import { useState, useMemo } from "react";
import { X, Bike, Send, CheckCircle2, MessageCircle } from "lucide-react";
import { TRIP_DETAILS } from "@/lib/constants/strings";

export default function MobilePricingModal({
  options,
  onClose,
  onRequestInvite,
  onAsk,
  totalSeats,
  bookedSeats,
}: {
  options: any;
  onAsk: () => void;
  onClose: () => void;
  onRequestInvite: (data: {
    options: Record<string, any>;
    addOns: string[];
    finalPrice: number;
    numTravelers: number;
    mode: "BOOK" | "INVITE";
  }) => void;
  totalSeats?: number;
  bookedSeats?: number;
}) {
  const simple = options?.simplePricingRequest;
  const dynamic = options?.dynamicPricingRequest;
  const addOns = options?.addOns || [];

  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [numTravelers, setNumTravelers] = useState(1);

  const seatCount = bookedSeats ?? 12;
  const maxSeats = totalSeats ?? 25;
  const seatPercentage = (seatCount / maxSeats) * 100;

  const getFinal = (price: number, discount: number) =>
    Math.round(price - (price * discount) / 100);

  /* ---------------- SIMPLE TOTAL ---------------- */
  const simpleTotal = useMemo(() => {
    if (!simple) return 0;
    return getFinal(simple.basePrice, simple.discountPercent);
  }, [simple]);

  /* ---------------- DYNAMIC TOTAL ---------------- */
  const dynamicTotal = useMemo(() => {
    if (!dynamic) return 0;

    return dynamic.pricingCategoryDtos.reduce((sum: number, cat: any) => {
      // SINGLE → auto include
      if (cat.pricingCategoryType === "SINGLE") {
        const opt = cat.pricingCategoryOptionDTOs?.[0];
        if (!opt) return sum;
        return sum + getFinal(opt.price, opt.discount);
      }

      // MULTI → selected
      const selected = selectedOptions[cat.categoryName];
      if (!selected) return sum;

      return sum + getFinal(selected.price, selected.discount);
    }, 0);
  }, [dynamic, selectedOptions]);

  /* ---------------- ADD ONS TOTAL ---------------- */
  const addOnTotal = useMemo(() => {
    return selectedAddOns.reduce((sum, name) => {
      const add = addOns.find((a: any) => a.name === name);
      return sum + (add?.charge || add?.price || 0);
    }, 0);
  }, [selectedAddOns, addOns]);

  /* ---------------- RAW FINAL ---------------- */
  const rawFinalPrice =
    (options?.tripPricingType === "SIMPLE" ? simpleTotal : dynamicTotal) +
    addOnTotal;

  /* ---------------- GST (18%) ---------------- */
  const finalPricePerPerson = useMemo(() => {
    if (options?.includesGst) {
      return Math.round(rawFinalPrice + rawFinalPrice * 0.18);
    }
    return Math.round(rawFinalPrice);
  }, [rawFinalPrice, options?.includesGst]);

  const finalTotalPrice = finalPricePerPerson * numTravelers;

  const isSoldOut = seatCount >= maxSeats;

  /* ---------------- BUTTON ENABLE ---------------- */
  const isButtonEnabled = !isSoldOut;

  /* ---------------- SUBMIT ---------------- */
  const handleResponse = (mode: "BOOK" | "INVITE") => {
    onRequestInvite({
      options: selectedOptions,
      addOns: selectedAddOns,
      finalPrice: finalTotalPrice,
      numTravelers,
      mode,
    });
  };
  const handleAsk = () => {
    onClose();   // pricing modal close
    onAsk();     // query modal open
  };


  return (
    <div className="lg:hidden fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="border-b px-6 py-4 flex justify-between">
          <h3 className="font-bold">
            {TRIP_DETAILS.PRICING_MODAL.TITLE}
          </h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* TOTAL */}
          <div className="flex justify-between border-b pb-3">
            <p className="text-sm font-medium">Total Price</p>
            <span className="font-bold text-primary">
              ₹{finalTotalPrice.toLocaleString()}
            </span>
          </div>

          {/* Traveler Selector */}
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="text-sm font-medium">Travelers</p>
              <p className="text-xs text-gray-500">Number of persons</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl border">
              <button
                onClick={() => setNumTravelers(Math.max(1, numTravelers - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 shadow-sm"
              >
                -
              </button>
              <span className="text-base font-bold w-4 text-center">{numTravelers}</span>
              <button
                onClick={() => setNumTravelers(numTravelers + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 shadow-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Seats filling fast */}
          <div className="space-y-2 border-b pb-4">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-gray-700">Seats filling fast</span>
              <span className="text-gray-900">{seatCount}/{maxSeats}</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-gradient rounded-full transition-all duration-500"
                style={{ width: `${seatPercentage}%` }}
              />
            </div>
          </div>

          {/* SIMPLE */}
          {options?.tripPricingType === "SIMPLE" && (
            <div className="flex justify-between border-b pb-3">
              <div className="flex gap-2">
                <Bike className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium">
                    {TRIP_DETAILS.PRICING_MODAL.BASE_PACKAGE}
                  </p>
                  {simple?.discountPercent > 0 ? (
                    <p className="text-xs text-primary font-semibold mt-1">
                      {simple.discountPercent}% OFF
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      {TRIP_DETAILS.PRICING_MODAL.STANDARD_PRICING}
                    </p>
                  )}
                </div>
              </div>

              <span className="font-semibold">
                ₹{(simpleTotal * numTravelers).toLocaleString()}
              </span>
            </div>
          )}

          {/* DYNAMIC */}
          {options?.tripPricingType === "DYNAMIC" &&
            dynamic?.pricingCategoryDtos.map((cat: any, i: number) => {
              // SINGLE
              if (cat.pricingCategoryType === "SINGLE") {
                const opt = cat.pricingCategoryOptionDTOs?.[0];
                if (!opt) return null;

                return (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-xl p-4 border space-y-2"
                  >
                    <p className="text-sm font-medium flex justify-between">
                      {cat.categoryName}
                      <span className="text-primary text-xs">
                        Auto included
                      </span>
                    </p>

                    <div className="flex justify-between">
                      <p className="text-sm">{opt.name}</p>
                      <span className="font-semibold">
                        ₹{(getFinal(opt.price, opt.discount) * numTravelers).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              }

              // MULTI
              return (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl p-4 border space-y-3"
                >
                  <p className="text-sm font-medium">{cat.categoryName}</p>

                  {cat.pricingCategoryOptionDTOs.map(
                    (opt: any, idx: number) => {
                      const checked =
                        selectedOptions[cat.categoryName]?.name === opt.name;

                      return (
                        <label
                          key={idx}
                          onClick={() =>
                            setSelectedOptions((prev: any) => ({
                              ...prev,
                              [cat.categoryName]: opt,
                            }))
                          }
                          className={`flex justify-between items-center border rounded-xl p-3 cursor-pointer ${checked
                            ? "border-primary bg-primary/5"
                            : ""
                            }`}
                        >
                          <p className="text-sm">{opt.name}</p>
                          <span className="font-semibold">
                            ₹{(getFinal(opt.price, opt.discount) * numTravelers).toLocaleString()}
                          </span>
                        </label>
                      );
                    }
                  )}
                </div>
              );
            })}

          {/* ADD ONS */}
          {addOns.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 border space-y-3">
              <p className="text-sm font-medium">Add-ons</p>

              {addOns.map((a: any, i: number) => (
                <label
                  key={i}
                  onClick={() =>
                    setSelectedAddOns((prev) =>
                      prev.includes(a.name)
                        ? prev.filter((n) => n !== a.name)
                        : [...prev, a.name]
                    )
                  }
                  className={`flex justify-between items-center border rounded-xl p-3 cursor-pointer ${selectedAddOns.includes(a.name)
                    ? "border-primary bg-primary/5"
                    : ""
                    }`}
                >
                  <p className="text-sm">{a.name}</p>
                  <span className="font-semibold">
                    ₹{((a.charge || a.price || 0) * numTravelers).toLocaleString()}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* INFO */}
          <div className="bg-primary/5 p-3 rounded-lg flex gap-2">
            <CheckCircle2 className="text-primary" />
            <p className="text-xs text-foreground">
              {TRIP_DETAILS.PRICING_MODAL.WARNING}
            </p>
          </div>

          {/* BUTTON */}
          {/* BUTTONS */}
          <div className="space-y-3">
            <button
              onClick={() => handleResponse("BOOK")}
              disabled={!isButtonEnabled}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg shadow-lg transition-all active:scale-[0.98] ${isButtonEnabled
                ? "bg-brand-gradient text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {!isSoldOut && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.3751 13.1253C20.6251 16.8753 17.7978 20.4057 13.8291 21.1951C9.86042 21.9846 5.83311 20.1385 3.84055 16.6167C1.848 13.0949 2.33991 8.69208 5.06059 5.69685C7.78128 2.70161 12.3751 1.87529 16.1251 3.37529" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.625 11.625L12.375 15.375L21.375 5.625" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {isSoldOut ? "Sold Out" : "Book Now"}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleResponse("INVITE")}
                className="w-full py-3 rounded-xl border-2 border-primary/20 text-primary font-bold text-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {TRIP_DETAILS.PRICING_MODAL.REQUEST_INVITE}
              </button>
              <button
                onClick={handleAsk}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary/20 text-primary font-bold text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                {TRIP_DETAILS.SIDEBAR.SEND_QUERY}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
