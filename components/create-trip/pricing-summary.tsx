import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type DynamicCategory } from "./dynamic-category-card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PricingSummaryProps {
  mode?: 'simple' | 'dynamic';
  simplePrice?: string;
  dynamicCategories?: DynamicCategory[];
  addOns?: { id: string; name: string; charge: number }[];
  gstMode?: 'includes' | 'excludes';
  depositPercent?: string | number;
  depositUnit?: 'percent' | 'flat';
  creditOptions?: { card: boolean; emi: boolean };
}

export function PricingSummary({
  mode = 'simple',
  simplePrice = '0',
  dynamicCategories = [],
  addOns = [],
  gstMode = 'excludes',
  depositPercent = '0',
  depositUnit = 'percent',
  creditOptions = { card: false, emi: false }
}: PricingSummaryProps) {

  const formatPrice = (p: number) => `₹${p.toLocaleString('en-IN')}`;

  const calculateDiscountedPrice = (priceStr: string, discountStr: string) => {
    const price = Number(priceStr) || 0;
    const discount = Number(discountStr) || 0;
    if (discount <= 0) return { original: price, final: price, hasDiscount: false };
    const final = price - (price * discount / 100);
    return { original: price, final: Math.round(final), hasDiscount: true };
  };

  // Calculate Range
  let rangeMin = 0;
  let rangeMax = 0;

  if (mode === 'dynamic' && dynamicCategories.length > 0) {
    dynamicCategories.forEach(cat => {
      const prices = cat.options.map(opt => calculateDiscountedPrice(opt.price, opt.discount).final);
      if (prices.length > 0) {
        rangeMin += Math.min(...prices);
        rangeMax += Math.max(...prices);
      }
    });
  }

  // Add fixed price addons to Max range only (as per user request)
  const totalAddonsCharge = addOns.reduce((sum, item) => sum + (Number(item.charge) || 0), 0);
  rangeMax += totalAddonsCharge;

  const applyGstIfNeeded = (amount: number) => {
    if (gstMode !== "includes") return amount;
    return Math.round(amount + amount * 0.18);
  };


  return (
    <div className="space-y-6">
      {/* Pricing Summary Widget */}
      <Card className="h-full bg-[#F7F7F7] border-[#F7F7F7]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Pricing Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">

          {mode === 'dynamic' && dynamicCategories.length > 0 ? (
            <>
              {dynamicCategories.map((firstCategory, idx) => {
                const allOptions = firstCategory.options || [];
                const displayedOptions = allOptions.slice(0, 3); // Limit summary
                const hasMore = allOptions.length > 3;

                return (
                  <div key={idx} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Category</span>
                      <span className="font-medium text-gray-900">{firstCategory.name || 'Uncategorized'}</span>
                    </div>

                    {/* Available Options (Screenshot Style) */}
                    <div className="mt-4">


                      {/* Soft white box wrapper */}
                      <div className="bg-white rounded-xl p-3 space-y-2 shadow-sm border border-gray-100">
                        <p className="text-xs font-semibold text-gray-800 mb-2">
                          Available Options
                        </p>
                        {displayedOptions.map((opt, optIdx) => {
                          const { original, final, hasDiscount } =
                            calculateDiscountedPrice(opt.price, opt.discount);

                          return (
                            <div
                              key={optIdx}
                              className="bg-gray-50 rounded-lg p-3 flex justify-between items-center border border-gray-200"
                            >
                              {/* LEFT — Option Name */}
                              <span className="text-sm text-gray-700">
                                {opt.name}
                              </span>

                              {/* RIGHT — Prices */}
                              <div className="text-right leading-tight">
                                {hasDiscount && (
                                  <div className="text-[10px] text-gray-400 line-through">
                                    {formatPrice(original)}
                                  </div>
                                )}
                                <div className="text-sm font-semibold text-gray-900">
                                  {formatPrice(final)}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {hasMore && (
                          <div className="text-xs text-center text-gray-400 italic">
                            ...and {allOptions.length - 3} more
                          </div>
                        )}

                      </div>
                    </div>

                  </div>
                );
              })}
            </>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Base Price:</span>
              <span className="font-medium">{formatPrice(Number(simplePrice))}</span>
            </div>
          )}

          {/* Add-ons Section */}
          {addOns.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                <span>Fixed Price Add-ons</span>
              </div>
              {addOns.map((addon) => (
                <div key={addon.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{addon.name}</span>
                  <span className="font-medium text-gray-900">{formatPrice(addon.charge)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">GST Status</span>
              <Badge variant="secondary" className={`font-normal px-2 py-0.5 ${gstMode === 'includes' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-100'}`}>
                {gstMode === "includes" ? "Included (18%)" : "Excluded"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Deposit Required</span>
              <span className="font-medium">
                {depositUnit === "percent"
                  ? `${depositPercent || 0}%`
                  : formatPrice(Number(depositPercent || 0))
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Payment Options</span>
              <div className="flex gap-1">
                {creditOptions.card && <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200 font-normal">Card</Badge>}
                {creditOptions.emi && <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200 font-normal">EMI</Badge>}
                {!creditOptions.card && !creditOptions.emi && <span className="text-xs text-gray-400">None</span>}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Price Range</p>
              <div className="text-lg font-bold text-gray-900">
                {mode === "simple"
                  ? formatPrice(applyGstIfNeeded(Number(simplePrice || 0)))
                  : `${formatPrice(rangeMin)} - ${formatPrice(applyGstIfNeeded(rangeMax))}`
                }
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
