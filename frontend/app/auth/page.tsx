"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { toast } from "sonner"

import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLogin } from "@/modules/auth/hooks/useLogin"
import { useRegister } from "@/modules/auth/hooks/useRegister"
import { useAuthStore } from "@/store/auth.store"
import { Rols } from "@/config/app.interface"


export default function AuthPage() {
  const { mutate, isPending, isError, error } = useRegister();
  const { mutate: loginMutate, data, isPending: loginIsPending, isError: loginIsError, error: loginError } = useLogin();
  const { login } = useAuthStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("signin")
  const [nombres, setNombres] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [rol, setRol] = useState(Rols.CASHIER)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  const { user } = useAuthStore();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      nombres,
      username: userName,
      password,
      rol,
    })

  }

  const onLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutate({
      username: userName,
      password,
    },
      {
        onSuccess: (data) => {
          if (data) {
            login(data.user, data.accessToken)
            router.push("/");
          }
        },
        onError: (error) => {
          toast.error('Error de autenticación', {
            description: error.message,
            duration: 5000,
          })
        }
      }
    )   
  }

  const setARol = (value: string) => {
    switch (value) {
      case Rols.SUPER_ADMIN:
        setRol(Rols.SUPER_ADMIN)
        break;
      case Rols.ADMIN:
        setRol(Rols.ADMIN)
        break;
      case Rols.CASHIER:
        setRol(Rols.CASHIER)
        break;
      default:
        setRol(Rols.CASHIER)
        break;
    }
  }

  const handleRedirect = () => {
    // window.open("https://www.youtube.com/@diecastbydollarall", "_blank")
  }



  return (
    <div className="w-full max-w-md mx-auto flex items-center justify-center h-screen">
      <div className="bg-white/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl hover:shadow-3xl">
        {/* Header with tabs and close button */}
        {/* < div className="flex items-center justify-between mb-8">
          <div className="flex bg-black/30 backdrop-blur-sm rounded-full p-1 border border-white/10">
           
            <button
              onClick={() => setActiveTab("signin")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${activeTab === "signin"
                ? "bg-white/20 backdrop-blur-sm text-white border border-white/20 shadow-lg"
                : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
            >
              Inicia sesión
            </button>
          </div>
        </div> */}

        <h1 className="text-3xl font-normal text-black mb-8 transition-all duration-300">
          {activeTab === "signup" ? "Crear cuenta" : "Bienvenido"}
        </h1>

        <div className="relative overflow-hidden">
          <div
            className={`transition-all duration-500 ease-in-out transform ${activeTab === "signup" ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 absolute inset-0"
              }`}
          >
            {/* Sign Up Form */}
            <form
              onSubmit={onSubmit}
              className="space-y-4"
            >
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    type="text"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-10 text-black placeholder:text-black/40 focus:border-white/30 focus:ring-0 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                    placeholder="Nombres"
                  />
                </div>
                <div className="relative">
                  <Input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-10 text-black placeholder:text-black/40 focus:border-white/30 focus:ring-0 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                    placeholder="Nombre usuario"
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-10 text-black placeholder:text-black/40 focus:border-white/30 focus:ring-0 pr-12 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                    placeholder="Ingrese su contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black/40 hover:text-white/60 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">

                  <Select onValueChange={(value) => setARol(value)}>
                    <SelectTrigger className="w-[180px] bg-black/20 backdrop-blur-sm border rounded-2xl border-white/10 text-black placeholder:text-black/40 focus:border-white/30 focus:ring-0 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30">
                      <SelectValue placeholder="Seleccione un rol" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30">
                      <SelectGroup>
                        <SelectLabel>Rol</SelectLabel>
                        <SelectItem value={Rols.SUPER_ADMIN}>Super Admin</SelectItem>
                        <SelectItem value={Rols.ADMIN}>Admin</SelectItem>
                        <SelectItem value={Rols.CASHIER}>Cajero</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Create account button */}
              <Button
                type="submit"
                className="w-full bg-black/20 backdrop-blur-sm border border-white/20 hover:bg-black/30 text-black font-medium rounded-2xl h-10 mt-8 text-base transition-all duration-300 transform hover:scale-[1] hover:shadow-lg active:scale-[0.98]"
                disabled={isPending}
              >
                {isPending ? "Creando su cuenta..." : "Crear cuenta"}
              </Button>
              {
                isError && (
                  <div className="text-red-500 text-sm mt-2">
                    {error?.message || "Error en la creación de la cuenta"}
                  </div>
                )
              }
            </form>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out transform ${activeTab === "signin" ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 absolute inset-0"
              }`}
          >
            <form
              onSubmit={onLoginSubmit}
              className="space-y-4"
            >
              <div className="relative">
                <Input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-[350px] bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-10 text-black placeholder:text-black/40 focus:border-white/30 focus:ring-0 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                  placeholder="Nombre usuario"
                />
              </div>

              {/* Password field */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-[350px] bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-10 text-black placeholder:text-black/40 focus:border-white/30 focus:ring-0 pr-12 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                  placeholder="Ingrese su contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black/40 hover:text-black/60 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Sign in button */}
              <Button
                // type="submit"
                className="w-full bg-black/20 backdrop-blur-sm border border-white/20 hover:bg-black/30 text-black font-medium rounded-2xl h-10 mt-8 text-base transition-all duration-300 transform hover:scale-[1] hover:shadow-lg active:scale-[0.98]"
                disabled={loginIsPending}
              >
                {loginIsPending ? "Iniciando..." : "Iniciar sesión"}
              </Button>
            </form>
          </div>
        </div>

        {/* Divider */}

        <div className="text-center mt-6 pt-4 border-t border-white/10">
          <p className="text-black/30 text-xs">
            CEO {" "}
            <button
              onClick={handleRedirect}
              className="text-black/50 hover:text-black/70 underline transition-colors duration-200"
            >
              jpulido.dev
            </button>
          </p>
        </div>
      </div>
    </div >
  )
}