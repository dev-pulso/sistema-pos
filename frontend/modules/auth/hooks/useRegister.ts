"use client";

import { useMutation } from "@tanstack/react-query";
import { RegisterDto, RegisterResponse } from "../types/auth";
import { registerUser } from "../services/auth.services";

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterDto>({
    mutationFn: registerUser,
  });
}
