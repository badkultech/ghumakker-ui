"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Send, AlertCircle, MessageCircle } from "lucide-react";
import { TRIP_DETAILS } from "@/lib/constants/strings";

interface DesktopSidebarProps {
  onAsk: () => void;
  pricing: any;
  images: { url: string }[];
  onRequestInvite: (data: {
    options: any;
    addOns: string[];
    finalPrice: number;
  }) => void;
  onImageClick?: () => void;

}

export default function DesktopSidebar({
  onAsk,
  pricing,
  images,
  onImageClick,
  onRequestInvite,
}: DesktopSidebarProps) {
  const simple = pricing?.simplePricingRequest;
  const dynamic = pricing?.dynamicPricingRequest;
  const addOns = pricing?.addOns || [];

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

  const finalPrice = applyGst(baseTotal);


  const isButtonEnabled = true;

  return (
    <div className="hidden lg:block lg:col-span-1">
      <div className="space-y-4">

        {/* Images */}
        <div className="grid grid-cols-2 gap-2">
          {(images?.length ? images : Array.from({ length: 6 })).map(
            (img: any, i: number) => (
              <div key={i} className="h-28 rounded-xl overflow-hidden relative">
                {img?.url ? (
                  <Image
                    src={img.url}
                    onClick={onImageClick}
                    alt="Trip gallery"
                    width={200}
                    height={150}
                    className="w-full h-full object-cover"
                  />
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
        <div className="bg-white rounded-2xl border p-5 space-y-4">
          <div>
            <p className="text-xs text-gray-500">
              {TRIP_DETAILS.SIDEBAR.STARTING_FROM}
            </p>

            <p className="text-3xl font-bold">
              ₹{(finalPrice || 0).toLocaleString()}
              <span className="text-sm text-gray-500 font-normal">
                {" "}
                {TRIP_DETAILS.SIDEBAR.PER_PERSON}
              </span>
            </p>

            {simple && simple.discountPercent > 0 && (
              <p className="text-sm text-green-600">
                {simple.discountPercent}% OFF (₹{simple.basePrice})
              </p>
            )}
            {includesGst && (
              <p className="text-xs text-gray-500">
                *Price includes 18% GST
              </p>
            )}

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
                        <span className="text-green-600 text-xs">
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
                          ₹{getOptionFinalPrice(opt.price, opt.discount)}
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
                                className="w-5 h-5 rounded-full flex items-center justify-center mt-1"
                                style={
                                  checked
                                    ? {
                                      border: "2px solid transparent",
                                      background: `
                  linear-gradient(white, white) padding-box,
                  linear-gradient(90deg, #FEA901, #FD6E34, #FE336A, #FD401A) border-box
                `,
                                    }
                                    : {
                                      border: "2px solid #D1D5DB",
                                      background: "white",
                                    }
                                }
                              >
                                {checked && (
                                  <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{
                                      background:
                                        "linear-gradient(90deg, #FEA901, #FD6E34, #FE336A, #FD401A)",
                                    }}
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
                              ₹{getOptionFinalPrice(opt.price, opt.discount)}
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
                          className="w-5 h-5 rounded-md flex items-center justify-center mt-1"
                          style={
                            selectedAddOns.includes(add.name)
                              ? {
                                background:
                                  "linear-gradient(90deg, #FEA901, #FD6E34, #FE336A, #FD401A)",
                                border: "1px solid transparent",
                              }
                              : {
                                background: "white",
                                border: "1.5px solid #D1D5DB",
                              }
                          }
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
                        ₹{add.charge}
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

          <button
            disabled={!isButtonEnabled}
            onClick={() =>
              onRequestInvite({
                options: selectedOptions,
                addOns: selectedAddOns,
                finalPrice,
              })
            }
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium ${isButtonEnabled
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            <Send className="w-4 h-4" />
            {TRIP_DETAILS.SIDEBAR.REQUEST_INVITE}
          </button>

          <button
            onClick={onAsk}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-orange-500 text-orange-500 font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            {TRIP_DETAILS.SIDEBAR.SEND_QUERY}
          </button>
        </div>
      </div>
    </div>
  );
}
