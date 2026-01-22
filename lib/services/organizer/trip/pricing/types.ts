export interface AddOn {
  id: string;
  name: string;
  charge: string;
}

export interface SimplePricingDTO {
  basePrice: number;
  discountPercent: number;
  discountValidUntil: string | null;
}

export interface DynamicPricingOptionDTO {
  name: string;
  price: number;
  discount: number;
}

export interface DynamicPricingCategoryDTO {
  categoryName: string;
  description: string;
  pricingCategoryType: "SINGLE" | "MULTI";
  pricingCategoryOptionDTOs: DynamicPricingOptionDTO[];
}

export interface DynamicPricingDTO {
  pricingCategoryDtos: DynamicPricingCategoryDTO[];
}

export interface PricingItem {
  tripPricingType: "SIMPLE" | "DYNAMIC";

  includesGst: boolean;
  depositRequiredPercent: number;
  depositRequiredAmount: number;
  creditOptions: string;
  cancellationPolicy: string;

  // optional because backend may send null
  addOns: { name: string; charge: number }[] | null;

  simplePricingRequest?: SimplePricingDTO | null;
  dynamicPricingRequest?: DynamicPricingDTO | null;
}

export type PricingCreateRequest = PricingItem;
export type PricingUpdateRequest = PricingItem;

export interface PricingResponse {
  status: string;
  message: string;
  data: PricingItem;
  timestamp: string;
}
