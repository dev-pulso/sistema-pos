import { Rols } from "@/config/app.interface";
import { User } from "@/modules/auth/types/app";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";


interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
  hasRole: (requiredRole: Rols | Rols[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        set({ user, token, isAuthenticated: true })
        Cookies.set("auth-storage", token, { expires: 7, sameSite: "strict" });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        Cookies.remove("auth-storage");},

      hasRole: (requiredRole) => {
        const currentRole = get().user?.rol;
        if (!currentRole) return false;

        return Array.isArray(requiredRole)
          ? requiredRole.includes(currentRole)
          : currentRole === requiredRole;
      },
    }),
    { name: "auth-storage" }
  )
);
