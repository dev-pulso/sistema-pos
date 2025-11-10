import { ENDPOINTS } from "@/lib/endpoint/endpoints";
import { LoginDto, LoginResponse, RegisterDto, RegisterResponse } from "../types/auth";
import api from "@/api/axiosInstance";


export async function registerUser(data: RegisterDto): Promise<RegisterResponse> {
  const res = await api.post(`${ENDPOINTS.build(ENDPOINTS.USUARIO.REGISTER)}`, data);

  if (!res.data) {
    throw new Error(res.data.message || "Error al registrar usuario");
  }

  return res.data;
}
export async function loginUser(data: LoginDto): Promise<LoginResponse> {
  const res = await api.post(`${ENDPOINTS.build(ENDPOINTS.USUARIO.LOGIN)}`, data);
  return res.data;
}
