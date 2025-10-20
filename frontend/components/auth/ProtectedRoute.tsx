"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Rols } from "@/config/app.interface";

interface Props {
  allowedRoles: Rols[];
  children: ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    } else if (!allowedRoles.includes(user!.rol)) {
      // Si está logueado pero no tiene permisos lo mandamos a su panel base
      if (user!.rol === Rols.ADMIN) router.replace("/admin");
      else if (user!.rol === Rols.CASHIER) router.replace("/");
      else router.replace("/"); // o página de error
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  return <>{children}</>;
}
