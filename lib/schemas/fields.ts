import { z } from "zod";

export const titleField = z.string().min(1, "Title is required").max(70, "Max 70 characters");
export const descriptionField = z.string().min(1, "Description is required").max(800, "Max 800 characters");
export const locationField = z.string().min(1, "Location is required");
export const timeField = z.string().optional(); // "HH:mm" or similar
export const packingField = z.string().max(800, "Max 800 characters").optional();

