import { ENDPOINTS } from "@/lib/endpoint/endpoints";
import { LoginDto, LoginResponse, RegisterDto, RegisterResponse } from "../types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function registerUser(data: RegisterDto): Promise<RegisterResponse> {
  const res = await fetch(`${ENDPOINTS.build(ENDPOINTS.USUARIO.REGISTER)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al registrar usuario");
  }

  return res.json();
}
export async function loginUser(data: LoginDto): Promise<LoginResponse> {
  const res = await fetch(`${ENDPOINTS.build(ENDPOINTS.USUARIO.LOGIN)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al registrar usuario");
  }

  return res.json();
}
