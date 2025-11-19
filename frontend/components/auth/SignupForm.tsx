"use client"
import { useState } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Rols } from "@/config/app.interface"
import { Vegan } from "lucide-react"
import { useRegister } from "@/modules/auth/hooks/useRegister"
import { toast } from "sonner"

export function SignupForm() {
    const { mutate, isPending, isError, error, data } = useRegister();
    const [nombres, setNombres] = useState("")
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [rol, setRol] = useState(Rols.CASHIER)
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

    const onSubmit = (e: React.FormEvent) => {

        e.preventDefault();
        mutate({
            nombres,
            username: userName,
            password,
            rol,
        },{
            onSuccess: () => {
                toast.success("Usuario creado exitosamente")
            },
            onError: (error) => {
                toast.error("Error al crear usuario", { description: error.message })
            }
        })
    }

    return (
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={onSubmit}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Crea una cuenta</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Ingrese un nombre de usuario
                                </p>
                            </div>
                            <Field className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="email">Usuario</FieldLabel>
                                    <Input
                                        id="email"
                                        type="text"
                                        placeholder="usuario"
                                        required
                                        value={nombres}
                                        onChange={(e) => setNombres(e.target.value)}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="email">Nombre de usuario</FieldLabel>
                                    <Input
                                        id="email"
                                        type="text"
                                        placeholder="usuario"
                                        required
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                </Field>
                            </Field>
                            <Field>
                                <Field className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                                        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </Field>
                                    <Field>
                                        <div className="flex flex-col gap-2">
                                            <FieldLabel htmlFor="rol">Rol</FieldLabel>
                                            <Select onValueChange={(value) => setARol(value)} value={rol}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Seleccione un rol" />
                                                </SelectTrigger>
                                                <SelectContent >
                                                    <SelectGroup>
                                                        <SelectLabel>Rol</SelectLabel>
                                                        <SelectItem value={Rols.SUPER_ADMIN}>Super Admin</SelectItem>
                                                        <SelectItem value={Rols.ADMIN}>Admin</SelectItem>
                                                        <SelectItem value={Rols.CASHIER}>Cajero</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </Field>
                                </Field>
                            </Field>
                            <Field>
                                <Button type="submit">Crear Cuenta</Button>
                            </Field>
                            <FieldDescription className="text-center">
                                Tienes cuenta? <Link href={"/auth/login"}>Iniciar sesión</Link>
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
