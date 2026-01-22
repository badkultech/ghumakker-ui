// Document interface
export interface Document {
    id: number;
    type: string;
    url: string;
    markedForDeletion?: boolean;
}

// Group Leader interface
export interface GroupLeader {
    id: number;
    name: string;
    documents: Document[];
    addedToLibrary: boolean;
    tripId: number;
    message?: string;
    bio?: string;
    tagline?: string;
}

// Time interface
export interface TimeInfo {
    hour: number;
    minute: number;
    second: number;
    nano: number;
}

// Wishlist Trip - matches API response
export interface WishlistTrip {
    tripId: number;
    publicId: string;
    name: string;
    startDate: string;
    endDate: string;
    startTime?: TimeInfo;
    endTime?: TimeInfo;
    minGroupSize?: number;
    maxGroupSize?: number;
    minAge?: number;
    maxAge?: number;
    moodTags?: string[];
    cityTags?: string[];
    startPoint?: string;
    endPoint?: string;
    highlights?: string;
    groupLeaders?: GroupLeader[];
    tripTimeStatus?: string;
    tripStatus?: string;
    document?: Document;
    organizerName?: string;
    startingFrom?: number;
    wishlisted: boolean;
}

export interface Pageable {
    page: number;
    size: number;
    sort?: string[];
}

export interface Sort {
    direction: string;
    nullHandling: string;
    ascending: boolean;
    property: string;
    ignoreCase: boolean;
}

export interface PageableInfo {
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    offset: number;
    sort: Sort[];
    unpaged: boolean;
}

export interface WishlistTripsResponse {
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    pageable: PageableInfo;
    size: number;
    content: WishlistTrip[];
    number: number;
    sort: Sort[];
    numberOfElements: number;
    empty: boolean;
}

export interface TripExistsResponse {
    exists: boolean;
}
