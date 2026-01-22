export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  error?: string;
  timestamp: string; // LocalDate as string
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface UploadedFile {
  id: number;
  type: string;
  url: string;
  file?: string;
  markedForDeletion?: boolean;
}
