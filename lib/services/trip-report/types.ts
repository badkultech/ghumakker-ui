
export type ReportType =
  | "SPAM_OR_IRRELEVANT_CONTENT"
  | "INAPPROPRIATE_OR_OFFENSIVE_LANGUAGE"
  | "MISLEADING_OR_FALSE_INFORMATION"
  | "INVALID_CONTACT_INFORMATION"
  | "OTHER";

export interface ReportTripRequest {
  tripPublicId: string;
  reportType: ReportType;
  comments?: string;
  userId?: number;
}
