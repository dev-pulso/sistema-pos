import { z } from "zod";
import { useForm } from "react-hook-form";
import { Package, Barcode, Layers, DollarSign, Hash } from "lucide-react";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import { Productos } from "@/config/app.interface";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";

const formSchema = z.object({
    barcode: z.string().min(1, { message: "El código de barras es requerido" }),
    nombre: z.string().min(1, { message: "El nombre es requerido" }),
    categoria: z.string().min(1, { message: "La categoría es requerida" }),
    unidad: z.string().min(1, { message: "La unidad es requerida" }),
    stock: z.number().min(0, { message: "El stock debe ser mayor a 0" }),
    cantidad: z.number().min(0, { message: "La cantidad debe ser mayor a 0" }),
    precio: z.number().min(0, { message: "El precio debe ser mayor a 0" }),
})

export default function DialogProducto({
    isOpen,
    onClose,
    editingProduct,
}: {
    isOpen: boolean;
    onClose: () => void;
    editingProduct: Productos | null;
}) {
    const units = ['unidad', 'lt', 'kg', 'lb', 'g', 'ml'];
    const categorias = [{
        id: 1,
        nombre: "Frutas",
    }, {
        id: 2,
        nombre: "Verduras",
    }, {
        id: 3,
        nombre: "Lácteos",
    }, {
        id: 4,
        nombre: "Carnes",
    }, {
        id: 5,
        nombre: "Grasas",
    }, {
        id: 6,
        nombre: "Otros",
    }]

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            nombre: editingProduct?.nombre || "",
            barcode: editingProduct?.barcode || "",
            cantidad: editingProduct?.cantidad || 0,
            precio: editingProduct?.precio || 0,
            categoria: editingProduct?.categoria.nombre || "",
            unidad: "",
            stock: editingProduct?.stock || 0,
        }
    })
    function onSubmit(data: z.infer<typeof formSchema>) {

        console.log('DATA', data);


        // if (editingProduct) {
        //     // onSubmit({ ...editingProduct, ...data })
        // } else {
        //     // onSubmit(data)
        // }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-h-[50vh] min-w-[800px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
                            <DialogDescription>
                                {
                                    editingProduct
                                        ? "Modifica los datos del producto"
                                        : "Agrega un nuevo producto al inventario"
                                }
                            </DialogDescription>
                        </DialogHeader>

                        <div className="max-w-[1000px] p-6">
                            <div className="max-w-4xl mx-auto">
                                <div className="p-8 mb-6">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                            <FormField
                                                control={form.control}
                                                name="barcode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                            <Barcode className="w-4 h-4" />
                                                            Código de barras
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                                placeholder="Ej: 1234567890123"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="nombre"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                            <Package className="w-4 h-4" />
                                                            Nombre
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                                placeholder="Ej: Arroz, Frijoles, etc."
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="categoria"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                            <Hash className="w-4 h-4" />
                                                            Categoría
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Seleccione una categoría" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        {
                                                                            categorias.map((category) => (
                                                                                <SelectItem key={category.id} value={category.nombre}>
                                                                                    {category.nombre}
                                                                                </SelectItem>
                                                                            ))
                                                                        }
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                    </FormItem>
                                                )
                                                }
                                            />
                                            <FormField
                                                control={form.control}
                                                name="unidad"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                            <Layers className="w-4 h-4" />
                                                            Unidad de medida
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Seleccione una unidad" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        {
                                                                            units.map((unit) => (
                                                                                <SelectItem key={unit} value={unit}>
                                                                                    {unit}
                                                                                </SelectItem>
                                                                            ))
                                                                        }
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                    </FormItem>
                                                )
                                                }
                                            />
                                            <FormField
                                                control={form.control}
                                                name="stock"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                            <Hash className="w-4 h-4" />
                                                            Stock Disponible
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                                placeholder="Ej: 100"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="precio"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                            <DollarSign className="w-4 h-4" />
                                                            Precio
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                                placeholder="Ej: 1000"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="cantidad"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                            <Layers className="w-4 h-4" />
                                                            Cantidad por Unidad
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                                placeholder="Ej: 100"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit">{editingProduct ? "Guardar Cambios" : "Crear Producto"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}