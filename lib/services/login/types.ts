export interface loginRequest {
  email: string;
  password: string;
}

export interface changePasswordRequest{
  currentPassword : string;
  newPassword: string;
  email: string;
}