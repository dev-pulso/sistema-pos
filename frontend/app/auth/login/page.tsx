"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useLogin } from "@/modules/auth/hooks/useLogin"
import { useAuthStore } from "@/store/auth.store"
import { Vegan } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useState } from "react"
import { toast } from "sonner"

export default function LoginForm() {

  const { mutate, isPending, isError, error } = useLogin();
  const { user, login } = useAuthStore();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");


  const onLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      username: userName,
      password,
    },
      {
        onSuccess: (data) => {
          if (data) {
            const { user, accessToken } = data;
            login(user, accessToken)
            router.push("/auth");
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

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm md:max-w-4xl mx-auto h-screen  justify-center">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onLoginSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Bienvenido</h1>
                <p className="text-muted-foreground text-balance">
                  Inicia sesión para continuar
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="text">Usuario</FieldLabel>
                <Input
                  id="text"
                  type="text"
                  placeholder="Usuario"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
              </Field>

              <FieldDescription className="text-center">
                No tienes una cuenta? <Link href={"/auth/register"}>Registrate</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className=" flex items-center justify-center">
            {/* <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            /> */}
            <div className="flex flex-col items-center gap-2">
              <Vegan className="w-48 h-48" />
              <span className="text-2xl font-bold">Tienda Oriental</span>

            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}