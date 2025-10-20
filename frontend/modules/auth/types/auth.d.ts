import { Rols } from "@/constants/roles";
import { User } from "./app";

export interface RegisterDto {
  password: string;
  nombres: string;
  username: string;
  rol: Rols;
}

export interface RegisterResponse {
  user: User;
  refreshToken: string; // si el backend devuelve token
  accessToken: string; // si el backend devuelve token
}
export interface LoginDto {
  username: string;
  password: string;
}
export interface LoginResponse {
  user: User;
  refreshToken: string; // si el backend devuelve token
  accessToken: string; //  // si el backend devuelve token
}