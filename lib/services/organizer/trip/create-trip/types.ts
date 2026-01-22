import { GroupLeaderResponse } from "../library/leader/types";

// Define response types (you can update according to your backend response)
export interface Trip {
  tripId: string;
  publicId: string;
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  totalDays: number;
  minGroupSize: number;
  maxGroupSize: number;
  minAge: number;
  maxAge: number;
  moodTags: string[];
  cityTags: string[];
  highlights: string;
  groupLeaderId: number;
  groupLeader?: GroupLeaderResponse;
  groupLeaders?: {
    id: number;
    name: string;
    tagline?: string;
    bio?: string;
    documents?: { id: number; url: string; type: string }[];
  }[];
}

export interface TripResponse {
  status: string;
  message: string;
  data: Trip;
  error?: string;
  timestamp?: string;
}
