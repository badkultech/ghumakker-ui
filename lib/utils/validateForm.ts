import { z, ZodTypeAny } from "zod";

export const validateForm = <T extends ZodTypeAny>(
  schema: T,
  data: unknown
): { valid: true; data: z.infer<T> } | { valid: false; errors: Record<string, string> } => {
  const result = schema.safeParse(data);

  if (!result.success) {
    // Format errors from Zod
    const formattedErrors: Record<string, string> = Object.fromEntries(
      Object.entries(result.error.format()).map(([key, val]) => {
        const maybe = val as { _errors?: string[] };
        return [key, maybe._errors?.[0] ?? "Invalid value"];
      })
    );

    return { valid: false, errors: formattedErrors };
  }

  return { valid: true, data: result.data };
};

