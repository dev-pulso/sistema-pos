"use client";

import { useMutation } from "@tanstack/react-query";
import { LoginDto, LoginResponse, RegisterDto, RegisterResponse } from "../types/auth";
import { loginUser } from "../services/auth.services";

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginDto>({
    mutationFn: loginUser,
  });
}
