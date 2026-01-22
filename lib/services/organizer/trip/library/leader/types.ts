import { LibraryRequest, LibraryResponse } from "../types";

// --- Group Leader Response ---
export interface GroupLeaderResponse extends LibraryResponse {
  bio?: string;
  tagline?: string;
}

// --- Group Leader Request ---
export interface GroupLeaderRequest extends LibraryRequest {
  bio?: string;
  tagline?: string;
}