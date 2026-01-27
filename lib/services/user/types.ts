// Define your User type (adjust fields to your backend response)
export interface UserDetails extends Profile {
    id: string;
    publicId: string;
    createdDate?: string;
    updatedDate?: string;
}

export type Profile = {
    fullName: string;
    email: string;
    role?: string;
    phone?: string;
};

// lib/services/travelerProfile/types.ts
export type TravelerProfileResponse = {
    firstName: string | null
    middleName: string | null
    lastName: string | null
    tagline: string | null
    gender: string | null
    dateOfBirth: string // ISO date from LocalDate (e.g., "1995-06-15")
    bio: string | null

    mobileNumber: string | null
    email: string | null
    emergencyContactName: string | null
    emergencyContactNumber: string | null

    googleAccount: string | null
    facebookAccount: string | null

    moodPreferences: string[] // names only
    profileImageUrl: string | null
    documentsUrls: string[] | null
}

export type TravelerProfileUpdateRequest = Partial<TravelerProfileResponse>

export type TripQueryLastResponse = {
    id: number;
    userName: string;
    comment: string;
    createdDate: string;
    tripPublicId: string;
    tripQueryId: number;
};

export type TripQuery = {
    id: number;
    tripName: string;
    userName: string;
    status: "OPEN" | "RESPONDED" | "CLOSED";
    category:
    | "PRICING"
    | "ITINERARY"
    | "STAY"
    | "TRANSPORT"
    | "OTHER";
    question: string;
    createdDate: string;
    tripPublicId: string;
    lastResponse?: TripQueryLastResponse | null;
};


export interface User {
    publicId: string;
    email: string;
    mobileNumber: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    employeeNumber: string;
    userType: string;
    roles: string[];
    status: "ACTIVE" | "INACTIVE" | "PENDING" | "REJECTED" | "SUSPENDED" | "DELETED";
    otp: string;
    createdDate: string;
    updatedDate: string;
    profileImageUrl?: string;
}

export interface UserFilter {
    page?: number;
    size?: number;
    mobileNumber?: string;
    firstName?: string;
    lastName?: string;
    employeeNumber?: string;
    status?: string;
}
