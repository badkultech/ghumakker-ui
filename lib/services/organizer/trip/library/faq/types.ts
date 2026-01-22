import { LibraryRequest, LibraryResponse } from "../types";

export interface FaqResponse extends LibraryResponse {
  name: string;
  answer: string;
  groupName: string;
}

export interface FaqRequest extends LibraryRequest {
 name: string;
  answer: string;
  groupName: string;
}