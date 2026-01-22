import { LibraryRequest, LibraryResponse } from "../types";

export interface StayRequest extends LibraryRequest {
    sharingType: SharingType;
    checkInTime: string;
    checkOutTime: string;
    location: string;

    description?: string;
    packingSuggestion?: string;
}

export enum SharingType {
    SINGLE,
    DOUBLE,
    TRIPLE,
}

export interface StayResponse extends LibraryResponse {
    sharingType: SharingType;
    checkInTime: string;
    checkOutTime: string;
    location: string;

    description?: string;
    packingSuggestion?: string;

}