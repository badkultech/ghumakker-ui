// utils/validateRequiredFields.ts
export type ErrorMap<TFieldKey extends string = string> = Record<TFieldKey, string>;

interface RequiredFieldConfig<TFieldKey extends string = string> {
    key: TFieldKey;
    label: string;
    value: string | string[];
}

export function validateRequiredFields<TFieldKey extends string = string>(
    fields: RequiredFieldConfig<TFieldKey>[]
): ErrorMap<TFieldKey> {
    const errors = {} as ErrorMap<TFieldKey>;

    fields.forEach(({ key, label, value }) => {
        if (
            value === null ||
            value === undefined ||
            (typeof value === "string" && value.trim() === "") ||
            (Array.isArray(value) && value.length === 0)
        ) {
            errors[key] = `${label} is required`;
        }
    });

    return errors;
}
