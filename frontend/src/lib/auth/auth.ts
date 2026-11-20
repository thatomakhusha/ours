
import { apiRequest } from "@/lib/api/client";
import type { LoginRequest, LoginResponse } from "./types";

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
