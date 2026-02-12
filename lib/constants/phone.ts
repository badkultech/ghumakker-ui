/**
 * Phone number configuration constants
 * 
 * To change the default country code:
 * 1. Update DEFAULT_COUNTRY_CODE
 * 2. Update PHONE_NUMBER_LENGTH if needed
 * 3. Update PHONE_NUMBER_PATTERN if needed
 */

export const PHONE_CONFIG = {
    // Default country code (change this to update globally)
    DEFAULT_COUNTRY_CODE: "+91",

    // Phone number length (without country code)
    PHONE_NUMBER_LENGTH: 10,

    // Validation pattern for phone number (digits only)
    PHONE_NUMBER_PATTERN: /^\d+$/,

    // Placeholder text
    PLACEHOLDER: "9876543210",

    // Error messages
    ERRORS: {
        INVALID_LENGTH: "Please enter a valid 10-digit phone number.",
        INVALID_FORMAT: "Phone number can only contain digits.",
        REQUIRED: "Phone number is required.",
    },
} as const;

/**
 * Format phone number with country code
 * @param phoneNumber - Phone number without country code
 * @returns Full phone number with country code
 */
export function formatPhoneWithCountryCode(phoneNumber: string): string {
    return `${PHONE_CONFIG.DEFAULT_COUNTRY_CODE}${phoneNumber}`;
}

/**
 * Extract phone number without country code
 * @param fullPhone - Full phone number with country code
 * @returns Phone number without country code
 */
export function extractPhoneNumber(fullPhone: string): string {
    // Remove all non-digit characters
    const digits = fullPhone.replace(/\D/g, "");
    // Return last PHONE_NUMBER_LENGTH digits
    return digits.slice(-PHONE_CONFIG.PHONE_NUMBER_LENGTH);
}

/**
 * Validate phone number length
 * @param phoneNumber - Phone number to validate
 * @returns true if valid length
 */
export function isValidPhoneLength(phoneNumber: string): boolean {
    return phoneNumber.length === PHONE_CONFIG.PHONE_NUMBER_LENGTH;
}
