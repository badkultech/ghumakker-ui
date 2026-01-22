import { ApiResponse, UploadedFile } from "../common-types";

export interface PartnerData {
  displayPicture: UploadedFile;
  organizerName: string;
  bannerImage: UploadedFile;
  tagline: string;
  description: string;
  websiteUrl: string;
  instagramHandle: string;
  youtubeChannel: string;
  googleBusiness: string;
  testimonials: string;
  testimonialScreenshot: UploadedFile;
  certifications: UploadedFile[];
}

export interface PartnerRequest {
  organizationId: string;
  data: PartnerData;
}

export type PartnerResponse = ApiResponse<PartnerData>;

