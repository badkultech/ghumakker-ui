export type PublicTripDTO = {
  tripId: number;
  publicId: string;
  name: string;
  startDate: string;
  endDate: string;
  minGroupSize: number;
  maxGroupSize: number;
  minAge: number;
  maxAge: number;
  moodTags: string[];
  cityTags: string[];
  highlights: string;
  tripStatus: string;
  tripTimeStatus: string;
};

export type SearchCriteria = {
  destination?: string;
  month?: number;
  year?: number;
  destinationTags?: string[];
  moods?: string[];
  isDomestic?: boolean;
  minDays?: number;
  maxDays?: number;
  minAge?: number;
  maxAge?: number;
  minBudget?: number;
  maxBudget?: number;
};


export type Pageable = {
  page: number;
  size: number;
  sort?: string[];
};
