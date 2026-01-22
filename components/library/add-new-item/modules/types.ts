import { DocumentItem } from "@/lib/services/organizer/trip/library/common/formDataMappers";

// modules/types.ts
export type Step =
  | "select"
  | "day-description"
  | "stay"
  | "transit"
  | "meal"
  | "activity"
  | "trip-leader"
  | "faq";

export type DocumentShape = {
  id: number | null;
  url: string | null;
  type?: string | null;
  file?: File | null;
  markedForDeletion?: boolean;
};

export type FormDataShape = Record<string, any>;

// ✅ Fix: first arg is Step
export type OnSaveHandler = (
  step: Step,
  data: FormDataShape,
  docs?: DocumentItem[]
) => Promise<void> | void;

export type ModuleProps<T = FormDataShape> = {
  updateId?: number | null;
  onCancel: () => void;
  onClose?: () => void;
  onSave: (data: T, documents?: DocumentItem[]) => void | Promise<void>;
};
