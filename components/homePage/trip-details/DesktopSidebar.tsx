"use client";

import { useState, useMemo } from "react";
import { LazyImage } from "@/components/ui/lazyImage";
import { Send, AlertCircle, MessageCircle } from "lucide-react";
import { TRIP_DETAILS } from "@/lib/constants/strings";

interface DesktopSidebarProps {
  onAsk: () => void;
  pricing: any;
  images: { url: string }[];
  onRequestInvite: (data: {
    options: Record<string, any>;
    addOns: string[];
    finalPrice: number;
    numTravelers: number;
    mode: "BOOK" | "INVITE";
  }) => void;
  onImageClick?: () => void;
  minGroupSize?: number;
  maxGroupSize?: number;
  reservedSeats?: number;
  totalSeats?: number;
  bookedSeats?: number;
}

export default function DesktopSidebar({
  onAsk,
  pricing,
  images,
  onImageClick,
  onRequestInvite,
  maxGroupSize = 20,
  reservedSeats = 0,
  totalSeats,
  bookedSeats,
}: DesktopSidebarProps) {
  const simple = pricing?.simplePricingRequest;
  const dynamic = pricing?.dynamicPricingRequest;
  const addOns = pricing?.addOns || [];

  const [numTravelers, setNumTravelers] = useState(1);

  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const getOptionFinalPrice = (price: number, discount: number) =>
    Math.round(price - (price * discount) / 100);

  // SIMPLE TOTAL
  const simpleFinal = useMemo(() => {
    if (!simple) return 0;
    return getOptionFinalPrice(simple.basePrice, simple.discountPercent);
  }, [simple]);

  // DYNAMIC TOTAL
  const dynamicTotal = useMemo(() => {
    if (!dynamic) return 0;

    return dynamic.pricingCategoryDtos?.reduce((sum: number, cat: any) => {
      // SINGLE → auto include first option
      if (cat.pricingCategoryType === "SINGLE") {
        const opt = cat.pricingCategoryOptionDTOs?.[0];
        if (!opt) return sum;
        return sum + getOptionFinalPrice(opt.price, opt.discount);
      }

      // MULTI → depends on selected
      const selected = selectedOptions[cat.categoryName];
      if (!selected) return sum;

      return (
        sum +
        getOptionFinalPrice(selected.price, selected.discount)
      );
    }, 0);
  }, [dynamic, selectedOptions]);

  const addOnTotal = selectedAddOns.reduce((sum, name) => {
    const add = addOns.find((a: any) => a.name === name);
    return sum + (add?.charge || 0);
  }, 0);

  const includesGst = pricing?.includesGst === true;
  const applyGst = (amount: number) =>
    Math.round(includesGst ? amount + amount * 0.18 : amount);


  const baseTotal =
    (pricing?.tripPricingType === "SIMPLE" ? simpleFinal : dynamicTotal) +
    addOnTotal;

  const finalPricePerPerson = applyGst(baseTotal);
  const finalTotalPrice = finalPricePerPerson * numTravelers;

  const seatCount = bookedSeats ?? reservedSeats ?? 12; 
  const maxSeats = totalSeats ?? maxGroupSize ?? 25; 
  const seatPercentage = (seatCount / maxSeats) * 100;
  const isSoldOut = seatCount >= maxSeats;

  const isButtonEnabled = !isSoldOut;

  return (
    <div className="hidden lg:block lg:col-span-1">
      <div className="space-y-4">

        {/* Images */}
        <div className="grid grid-cols-2 gap-2">
          {(images?.length ? images.slice(0, 6) : Array.from({ length: 6 })).map(
            (img: any, i: number) => (
              <div key={i} className="h-28 rounded-xl overflow-hidden relative">
                {img?.url ? (
                  <div onClick={onImageClick} className="w-full h-full cursor-pointer">
                    <LazyImage
                      src={img.url}
                      alt="Trip gallery"
                      fill
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                    No image available
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border p-6 space-y-5 shadow-sm">
          <div className="space-y-1">
            <p className="text-sm text-gray-400 font-medium">
              {TRIP_DETAILS.SIDEBAR.STARTING_FROM}
            </p>

            <p className="text-4xl font-extrabold text-gray-900 leading-tight">
              ₹{(finalTotalPrice || 0).toLocaleString()}
              <span className="text-sm text-gray-500 font-normal ml-1">
                ({numTravelers} {numTravelers === 1 ? 'person' : 'persons'})
              </span>
            </p>

            {simple && simple.discountPercent > 0 && (
              <p className="text-[15px] text-[#FF4D4D] font-bold">
                {simple.discountPercent}% OFF (₹{(simple.basePrice * numTravelers)?.toLocaleString()})
              </p>
            )}

            {includesGst && (
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                *Price includes 18% GST
              </p>
            )}
          </div>


          {/* Deposit Required Info */}
          {(pricing?.depositRequiredPercent || pricing?.depositRequiredAmount) && (
            <div className="bg-gray-50 px-5 py-4 rounded-2xl flex justify-between items-center w-full border border-gray-100">
              <span className="text-sm font-semibold text-gray-700">Deposit Required</span>
              <span className="text-base font-extrabold text-gray-900">
                {pricing.depositRequiredPercent
                  ? `${pricing.depositRequiredPercent}%`
                  : `₹${pricing.depositRequiredAmount?.toLocaleString()}`}
              </span>
            </div>
          )}


          {/* Traveler Selector */}
          <div className="py-4 border-y border-gray-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">Travelers</span>
              <span className="text-xs text-gray-500">Number of persons</span>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
              <button
                onClick={() => setNumTravelers(Math.max(1, numTravelers - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
              >
                -
              </button>
              <span className="text-base font-bold w-4 text-center">{numTravelers}</span>
              <button
                onClick={() => setNumTravelers(numTravelers + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Seats filling fast */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-700">Seats filling fast</span>
              <span className="font-bold text-gray-900">{seatCount}/{maxSeats}</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-gradient rounded-full transition-all duration-500"
                style={{ width: `${seatPercentage}%` }}
              />
            </div>
          </div>

          {/* DYNAMIC ONLY */}
          {pricing?.tripPricingType === "DYNAMIC" && (
            <>
              {dynamic?.pricingCategoryDtos?.map((cat: any, i: number) => {
                // -------------- SINGLE (visible + read-only) ----------------
                if (cat.pricingCategoryType === "SINGLE") {
                  const opt = cat.pricingCategoryOptionDTOs?.[0];

                  if (!opt) return null;

                  return (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-xl p-4 space-y-2 border border-green-200"
                    >
                      <p className="font-medium text-sm flex justify-between">
                        {cat.categoryName}
                        <span className="text-primary text-xs">
                          Included automatically
                        </span>
                      </p>

                      <div className="flex justify-between items-center p-3 rounded-xl border bg-white">
                        <div>
                          <p className="font-semibold text-sm">{opt.name}</p>
                          <p className="text-xs text-gray-500">
                            {opt.discount > 0 ? (
                              <>₹{opt.price} — {opt.discount}% OFF</>
                            ) : (
                              <>₹{opt.price}</>
                            )}
                          </p>
                        </div>

                        <p className="font-semibold text-sm">
                          ₹{(getOptionFinalPrice(opt.price, opt.discount) * numTravelers).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                }

                // -------------- MULTI (radio) ----------------
                return (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <p className="font-medium text-sm">{cat.categoryName}</p>

                    {cat.pricingCategoryOptionDTOs?.map(
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
                            className={`
      flex justify-between items-center p-3 rounded-xl border cursor-pointer
      transition-all
      ${checked ? "border-orange-400 bg-orange-50" : "hover:bg-gray-50"}
    `}
                          >
                            <div className="flex items-start gap-3">
                              {/* CUSTOM RADIO (NO onClick here) */}
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center mt-1 transition-all ${checked ? "bg-brand-gradient border-transparent" : "bg-white border-[2px] border-gray-300"}`}
                              >
                                {checked && (
                                  <div
                                    className="w-2.5 h-2.5 rounded-full bg-white"
                                  />
                                )}
                              </div>

                              {/* TEXT */}
                              <div>
                                <p className="font-semibold text-sm">{opt.name}</p>
                                <p className="text-xs text-gray-500">
                                  {opt.discount > 0 ? (
                                    <>₹{opt.price} — {opt.discount}% OFF</>
                                  ) : (
                                    <>₹{opt.price}</>
                                  )}
                                </p>
                              </div>
                            </div>

                            <p className="font-semibold text-sm">
                              ₹{(getOptionFinalPrice(opt.price, opt.discount) * numTravelers).toLocaleString()}
                            </p>
                          </label>

                        );
                      }
                    )}
                  </div>
                );
              })}

              {/* Add-ons */}
              {addOns.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p className="font-medium text-sm">Add-ons</p>

                  {addOns.map((add: any, i: number) => (
                    <label
                      key={i}
                      onClick={() =>
                        setSelectedAddOns((prev) =>
                          prev.includes(add.name)
                            ? prev.filter((n) => n !== add.name)
                            : [...prev, add.name]
                        )
                      }
                      className={`
      flex justify-between items-center p-3 rounded-xl border cursor-pointer
      transition-all
      ${selectedAddOns.includes(add.name)
                          ? "border-orange-400 bg-orange-50"
                          : "hover:bg-gray-50"
                        }
    `}
                    >
                      <div className="flex items-start gap-3">
                        {/* CUSTOM CHECKBOX */}
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center mt-1 transition-all ${selectedAddOns.includes(add.name) ? "bg-brand-gradient border-transparent" : "bg-white border-[1.5px] border-gray-300"}`}
                        >
                          {selectedAddOns.includes(add.name) && (
                            <svg
                              viewBox="0 0 24 24"
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>

                        {/* TEXT */}
                        <p className="text-sm">{add.name}</p>
                      </div>

                      <p className="font-semibold text-sm">
                        ₹{(add.charge * numTravelers).toLocaleString()}
                      </p>
                    </label>

                  ))}
                </div>
              )}
            </>
          )}

          {!isButtonEnabled && (
            <div className="flex gap-2 items-center text-xs text-orange-600 bg-orange-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <p>{TRIP_DETAILS.SIDEBAR.SELECT_OPTION_WARNING}</p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              disabled={!isButtonEnabled}
              onClick={() =>
                onRequestInvite({
                  options: selectedOptions,
                  addOns: selectedAddOns,
                  finalPrice: finalTotalPrice,
                  numTravelers,
                  mode: "BOOK",
                })
              }
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg cursor-pointer shadow-lg transition-all active:scale-[0.98] ${isButtonEnabled
                ? "bg-brand-gradient text-white hover:opacity-90"
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
                onClick={() =>
                  onRequestInvite({
                    options: selectedOptions,
                    addOns: selectedAddOns,
                    finalPrice: finalTotalPrice,
                    numTravelers,
                    mode: "INVITE",
                  })
                }
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-primary/20 text-primary font-bold text-sm cursor-pointer hover:bg-primary/5 transition-all active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                {TRIP_DETAILS.SIDEBAR.REQUEST_INVITE}
              </button>

              <button
                onClick={onAsk}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-primary/20 text-primary font-bold text-sm cursor-pointer hover:bg-primary/5 transition-all active:scale-[0.98]"
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
