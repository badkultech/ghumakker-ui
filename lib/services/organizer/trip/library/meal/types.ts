import { LibraryRequest, LibraryResponse } from "../types";

export interface MealRequest extends LibraryRequest {
    chargeable: boolean;
    location: string;
    mealType: MealType;
    description?: string;
    packingSuggestion?: string;
}

export enum MealType {

    BREAKFAST,
    LUNCH,
    DINNER,
    SNACKS,
    BRUNCH,
    SUPPER,
    TEA_TIME,
    OTHER
}

export interface MealResponse extends LibraryResponse {
    chargeable: boolean;
    location: string;
    mealType: MealType;
    description?: string;
    packingSuggestion?: string;
    time: string;
}

export const mealTypeLabels: Record<string, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACKS: "Snacks",
  BRUNCH: "Brunch",
  SUPPER: "Supper",
  TEA_TIME: "Tea Time",
  OTHER: "Other",
};