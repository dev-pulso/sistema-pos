"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { User, Settings, LogOut, Vegan, UserPlus, Sun, Moon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store/auth.store";
import { Rols } from "@/config/app.interface";
import { useTheme } from "next-themes";

export function POSHeader() {
  const { user, logout } = useAuthStore();
  const { setTheme, theme } = useTheme()
  const router = useRouter();
  const [rol, setRol] = useState('')

  useEffect(() => {
    switch (user?.rol) {
      case Rols.SUPER_ADMIN:
        setRol('SUPER ADMIN')
        break;
      case Rols.ADMIN:
        setRol('ADMIN')
        break;
      case Rols.CASHIER:
        setRol('VENDEDOR')
        break;
      default:
        setRol('VENDEDOR')
        break;
    }
  }, [user])


  const handleAdminClick = () => {
    if (user?.rol === Rols.SUPER_ADMIN || user?.rol === Rols.ADMIN) {
      router.push("/admin");
    }
  }

  const handleSuperAdminClick = () => {
    if (user?.rol === Rols.SUPER_ADMIN) {
      router.push("auth/register");
    }
  }

  const handleLogout = () => {
    logout();
    router.push("/auth");

  }

  return (
    <header className="flex h-16 items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg">
          <Vegan className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold leading-none text-foreground">Tienda Oriental</h1>
          <p className="text-sm text-muted-foreground">Sistema de Punto de Venta</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">Caja 01</p>
          <p className="text-xs text-muted-foreground">Rol: {rol ? rol : "No Logueado"}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {
              user?.rol === Rols.SUPER_ADMIN || user?.rol === Rols.ADMIN ? (
                <DropdownMenuItem className="cursor-pointer" onClick={handleAdminClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  Administración
                </DropdownMenuItem>
              ) : null
            }
            {
              user?.rol === Rols.SUPER_ADMIN ? (
                <DropdownMenuItem className="cursor-pointer" onClick={handleSuperAdminClick}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Registrar usuario
                </DropdownMenuItem>
              )
                : null
            }
            {
              theme === 'dark' ? (
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  Modo Claro
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  Modo Oscuro
                </DropdownMenuItem>
              )
            }
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
