// types/otp.ts

export interface OtpResponse {
  message: string;
  success: boolean;
  accessToken?: string;
}

export interface GenerateOtpRequest {
  identifier: string; // email or mobile
  type: "EMAIL" | "MOBILE"; // matches your OTPType enum
  organization: boolean;
  userPublicId?: string; // optional, required if organization is true
}


export interface ValidateOtpRequest {
  identifier: string; // email or mobile
  otp: string;
  type: "EMAIL" | "MOBILE"; // matches your OTPType enum
  userPublicId?: string; // optional, required if organization is true
}

export interface LoginDTO {
  email: string;
  password?: string; // write-only in backend, optional for response
  accessToken?: string;
  refreshToken?: string;
}