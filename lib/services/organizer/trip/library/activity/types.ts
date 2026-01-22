import { LibraryRequest, LibraryResponse } from "../types";

export interface ActivityRequest extends LibraryRequest {
  moodTags: string[];                // @NotNull
  priceCharge: PriceCharge;          // @NotNull
  location?: string;                 // optional
  time?: string;                     // LocalTime -> ISO time string "HH:mm:ss"
  description?: string;
  packingSuggestion?: string;
}

// if PriceCharge is already a shared type, you can import it instead
export interface PriceCharge {
  amount?: number;                   // e.g. 200
  currency?: string;                 // e.g. "INR"
  type?: "included" | "chargeable";  // adjust to your backend enum if any
}

export interface ActivityResponse extends LibraryResponse {
  moodTags: string[];
  priceCharge: PriceCharge;
  location?: string;
  time?: string;
  description?: string;
  packingSuggestion?: string;
}
