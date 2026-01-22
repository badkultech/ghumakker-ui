
export interface ActivityItem {
  id: number;  
  tripItemId?: number;  
  tripType?: string;      
  name: string;
  location?: string;
  time?: string;
  moodTags?: string[];
  priceCharge?: string;
  description?: string;
  documents?: any[];      
  packingSuggestion?: string;
}

export interface ActivityResponse {
  tripItemId: number;
  name: string;
  location?: string;
  time?: string;
  description?: string;
  documents?: any[];
  moodTags?: string[];
  priceCharge?: string;
  packingSuggestion?: string;
  dayDetailId: number;
  tripType: string; 
}

export interface CreateActivityRequest {
  name: string;
  location?: string;
  time?: string;
  description?: string;
  moodTags?: string[];
  priceCharge?: string;
  packingSuggestion?: string;
  documents?: File[] | string[];
}

export interface UpdateActivityRequest extends CreateActivityRequest {}

export interface DeleteActivityResponse {
  message: string;
  status: string;
}
