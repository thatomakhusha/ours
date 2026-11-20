
import { apiRequest } from "@/lib/api/client";
import type {
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "./types";

export async function login(
  credentials: LoginRequest
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    }
  );
}

export async function changePassword(
  credentials: ChangePasswordRequest,
  token: string
): Promise<ChangePasswordResponse> {
  return apiRequest<ChangePasswordResponse>(
    "/api/auth/change-password",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    },
    token
  );
}
