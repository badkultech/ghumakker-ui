export interface DestinationCreateRequest {
    attraction: string;
    city: string;
    province: string;
    country: string;
    region: string;
    isDomestic: boolean;
    pinCode?: string;
}

export interface DestinationSearchResponse {
    tags: string; // comma-separated
}