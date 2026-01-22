import { z } from "zod";
import {
  titleField,
  descriptionField,
  locationField,
  timeField,
  packingField,
} from "../fields";

export const addDayDescriptionSchema = z.object({
  title: titleField,
  description: descriptionField,
  location: locationField,
  time: timeField,
  packing: packingField
});

export type AddDayDescriptionData = z.infer<typeof addDayDescriptionSchema>;
