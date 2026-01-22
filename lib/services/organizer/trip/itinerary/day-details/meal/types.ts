export interface MealItem {
  id: number;
  tripItemId?: number;  
  name: string;
  mealType: string;
  priceCharge?: "INCLUDED" | "CHARGEABLE";
  chargeable?:string,
  location?: string; 
  time?: string;
  packingSuggestion?:string;
  description?: string;
  documents?: any[];
  tripType?: string;
}


export interface MealResponse {
  status: string;
  message: string;
  data: MealItem[];
}

export interface CreateMealRequest {
  name: string;
  description: string;
  location: string;
  time: string;
  mealType: string;
  priceCharge: "INCLUDED" | "CHARGEABLE";
  documents?: File[];
}

export interface UpdateMealRequest extends CreateMealRequest {}

export interface DeleteMealResponse {
  message: string;
}
