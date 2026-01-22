import { TRIP_DETAILS } from "@/lib/constants/strings";

interface MobilePricingBarProps {
  onOpen: () => void;
  pricing: any;
}

export default function MobilePricingBar({
  onOpen,
  pricing,
}: MobilePricingBarProps) {
  const simple = pricing?.simplePricingRequest;
  const dynamic = pricing?.dynamicPricingRequest;

  const getFinal = (price: number, discount: number) =>
    price - (price * discount) / 100;

  /* ---------------- BASE PRICE ---------------- */
  let basePrice = 0;
  let originalBase = 0;
  let discountPercent = 0;

  // ---------- SIMPLE ----------
  if (pricing?.tripPricingType === "SIMPLE" && simple) {
    originalBase = simple.basePrice;
    discountPercent = simple.discountPercent;
    basePrice = getFinal(simple.basePrice, simple.discountPercent);
  }

  // ---------- DYNAMIC ----------
  if (pricing?.tripPricingType === "DYNAMIC" && dynamic) {
    let total = 0;

    dynamic.pricingCategoryDtos?.forEach((cat: any) => {
      // SINGLE → always include
      if (cat.pricingCategoryType === "SINGLE") {
        const opt = cat.pricingCategoryOptionDTOs?.[0];
        if (opt) total += getFinal(opt.price, opt.discount);
      }

      // MULTI → minimum option as starting price
      if (cat.pricingCategoryType === "MULTI") {
        const min = cat.pricingCategoryOptionDTOs
          ?.map((o: any) => getFinal(o.price, o.discount))
          ?.sort((a: number, b: number) => a - b)?.[0];

        if (min) total += min;
      }
    });

    basePrice = total;
  }
  const finalPrice = pricing?.includesGst
    ? Math.round(basePrice + basePrice * 0.18)
    : Math.round(basePrice);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-30">
      <div className="flex justify-between items-center">
        {/* PRICE INFO */}
        <div>
          <p className="text-xs text-gray-500">
            {TRIP_DETAILS.MOBILE_BAR.STARTING_FROM}
          </p>

          <p className="text-2xl font-bold">
            ₹{finalPrice.toLocaleString()}
          </p>

          {/* SIMPLE DISCOUNT TEXT */}
          {pricing?.tripPricingType === "SIMPLE" && discountPercent > 0 && (
            <p className="text-xs text-green-600">
              {discountPercent}% {TRIP_DETAILS.MOBILE_BAR.OFF} (
              ₹{originalBase.toLocaleString()}{" "}
              {TRIP_DETAILS.MOBILE_BAR.ORIGINAL})
            </p>
          )}

          {/* GST LABEL */}
          {pricing?.includesGst && (
            <p className="text-xs text-gray-500">
              +18% GST included
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={onOpen}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg"
        >
          {TRIP_DETAILS.MOBILE_BAR.VIEW_OPTIONS}
        </button>
      </div>
    </div>
  );
}
