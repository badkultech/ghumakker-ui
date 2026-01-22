export interface ReviewItem {
  confirmed: boolean;
}

export interface ReviewResponse {
  status: string;
  message: string;
  data: ReviewItem;
  timestamp: string;
}

export interface ReviewCreateRequest {
  confirmed: boolean;
}

export interface ReviewUpdateRequest {
  confirmed: boolean;
}
