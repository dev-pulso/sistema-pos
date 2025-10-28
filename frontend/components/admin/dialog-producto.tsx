import { useEffect, useState } from "react";
import { z } from "zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { Package, Barcode, Layers, DollarSign, Hash, ChevronsUpDown, Check, CheckCheck } from "lucide-react";
import { toast } from "sonner";


import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Spinner } from "../ui/spinner";

import { Productos } from "@/config/app.interface";
import { useCategorias } from "@/modules/categorias/hooks/useCategorias";
import { CategoriaResponse } from "@/modules/categorias/types/categoria";
import useProductos from "@/modules/productos/hooks/useProductos";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    barcode: z.string().min(1, { message: "El código de barras es requerido" }),
    nombre: z.string().min(1, { message: "El nombre es requerido" }),
    categoria: z.object({
        id: z.string().uuid({ message: "La categoría seleccionada no es válida" }),
        nombre: z.string().min(1),
    }),
    unidadMedida: z.enum(['unidad', 'g', 'kg', 'ml', 'lt'], { message: "La unidad de medida es requerida" }),
    stock: z.number().min(0, { message: "El stock debe ser mayor a 0" }),
    cantidad: z.number().min(0, { message: "La cantidad debe ser mayor a 0" }),
    precio: z.number().min(0, { message: "El precio debe ser mayor a 0" }),
    costo: z.number().min(0, { message: "El costo debe ser mayor a 0" }),
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
    const units = [
        { value: 'unidad', label: 'Unidad' },
        { value: 'g', label: 'Gramos (g)' },
        { value: 'kg', label: 'Kilogramos (kg)' },
        { value: 'ml', label: 'Mililitros (ml)' },
        { value: 'lt', label: 'Litros (lt)' },
    ];

    const [categorias, setCategorias] = useState<CategoriaResponse[]>();
    const [categoria, setCategoria] = useState<CategoriaResponse>();
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)


    const [value, setValue] = useState("");

    const { categorias: dataCategorias, mutation } = useCategorias();
    const { mutationProducto } = useProductos()

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            nombre: editingProduct?.nombre || "",
            barcode: editingProduct?.barcode || "",
            cantidad: editingProduct?.cantidad || 0,
            precio: editingProduct?.precio || 0,
            costo: editingProduct?.costo || 0,
            categoria: editingProduct ? { id: editingProduct.categoria.id, nombre: editingProduct.categoria.nombre } : { id: "", nombre: "" },
            unidadMedida: "unidad",
            stock: editingProduct?.stock || 0,
        }
    })
    async function hanldeCategoria(field: ControllerRenderProps<z.infer<typeof formSchema>, "categoria">) {
        if (!value.trim()) return;
        setIsLoading(true);

        mutation.mutate(
            { nombre: value },
            {
                onSuccess: (data) => {
                    toast.success("Categoría creada con éxito");

                    // Agregar la nueva categoría al listado
                    setCategoria(data);
                    setCategorias((prev) => [...(prev || []), data]);

                    // ✅ Establecer la categoría creada como seleccionada
                    field.onChange({ id: data.id, nombre: data.nombre });

                    // ✅ Mantener visible el nombre seleccionado
                    setValue(data.nombre);

                    // Cerrar popover
                    setOpen(false);
                    setIsLoading(false);

                },
                onError: (error) => {
                    console.error("Error al crear categoria", error);
                    toast.error("No se pudo crear la categoría", { description: error.message });
                },
                onSettled: () => {
                    setIsLoading(false);
                },
            }
        );
    }

    function limpiarFormulario() {
        form.reset();
    }

    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);
        mutationProducto.mutate({
            barcode: data.barcode,
            nombre: data.nombre,
            categoriaId: data.categoria.id,
            unidadMedida: data.unidadMedida,
            stock: data.stock,
            cantidad: data.cantidad,
            costo: data.costo,
            precio: data.precio,

        }, {
            onSuccess: (data) => {
                toast.success(`Producto "${data.nombre}" creado con éxito`);
                form.reset();
                setOpen(false);
            },
            onError: (error) => {
                console.error('Error al crear producto', error);
                toast.error("No se pudo crear el producto", { description: error.message });
            }
        })
        setIsLoading(false);

    }


    useEffect(() => {
        setCategorias(dataCategorias);
    }, [dataCategorias])

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
                                                            <Popover open={open} onOpenChange={setOpen}>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        role="combobox"
                                                                        aria-expanded={open}
                                                                        className=" justify-between"
                                                                    >
                                                                        {
                                                                            field.value?.nombre
                                                                                ? field.value.nombre
                                                                                : "Seleccionar una categoria..."
                                                                        }
                                                                        <ChevronsUpDown className="opacity-50" />
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className=" p-0">
                                                                    <Command>
                                                                        <div className="flex justify-between">
                                                                            <CommandInput
                                                                                placeholder="Buscar una categoria..."
                                                                                className="h-9"
                                                                                onValueChange={(search) => setValue(search)}
                                                                            />
                                                                            {
                                                                                !isLoading ? (
                                                                                    <Check onClick={() => hanldeCategoria(field)} className="mr-2 mt-2 h-6 w-6 cursor-pointer " />
                                                                                ) : (
                                                                                    <Spinner className="mr-2 mt-2 h-6 w-6 cursor-pointer " />
                                                                                )
                                                                            }

                                                                        </div>
                                                                        <CommandList>
                                                                            <CommandEmpty>No se encuentra la categoría</CommandEmpty>
                                                                            <CommandGroup>
                                                                                {categorias?.map((cate) => (
                                                                                    <CommandItem
                                                                                        key={cate.id}
                                                                                        value={cate.nombre}
                                                                                        onSelect={(currentValue) => {
                                                                                            field.onChange({ id: cate.id, nombre: cate.nombre });
                                                                                            setValue(cate.nombre);
                                                                                            setOpen(false);
                                                                                        }}
                                                                                    >
                                                                                        {cate.nombre}
                                                                                        <Check
                                                                                            className={cn(
                                                                                                "ml-auto",
                                                                                                value === cate.nombre ? "opacity-100" : "opacity-0"
                                                                                            )}
                                                                                        />
                                                                                    </CommandItem>
                                                                                ))}
                                                                            </CommandGroup>
                                                                        </CommandList>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>
                                                        </FormControl>
                                                    </FormItem>
                                                )
                                                }
                                            />
                                            <FormField
                                                control={form.control}
                                                name="unidadMedida"
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
                                                                                <SelectItem key={unit.value} value={unit.value}>
                                                                                    {unit.label}
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
                                                                placeholder="Ej: 1000"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="costo"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                            <DollarSign className="w-4 h-4" />
                                                            Costo
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
                            <Button onClick={limpiarFormulario}>Limpiar formulario</Button>

                            {
                                isLoading && <Spinner />
                            }
                            <Button>{editingProduct ? 'Guardar cambios' : 'Crear productos'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}