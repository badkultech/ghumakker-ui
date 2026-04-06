export interface TripBookingRequest {
  tripId: string | number;
  groupSize: number;
  selectedOptions: Array<{
    pricingCategoryId: string | number;
    pricingCategoryOptionId: string | number;
  }>;
  addOns: Array<{
    addOnId: string | number;
  }>;
}

export interface TripBookingResponse {
  bookingId: number;
  bookingRef: string;
  tripId: number;
  groupSize: number;
  totalAmount: number;
  pricePerPerson: number;
  status: string;
  items: Array<{
    type: string;
    name: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }>;
}
