
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  email: string;
  tokenType: string;
  mustChangePassword: boolean;
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  userId: number;
  email: string;
  tokenType: string;
  mustChangePassword: boolean;
  token: string;
}
