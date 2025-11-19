// dialog-producto.tsx
import { useEffect, useState } from "react";
import { z } from "zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { Package, Barcode, Layers, DollarSign, Hash, ChevronsUpDown, Check } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Productos } from "@/config/app.interface";
import { useCategorias } from "@/modules/categorias/hooks/useCategorias";
import { CategoriaResponse } from "@/modules/categorias/types/categoria";
import useProductos from "@/modules/productos/hooks/useProductos";
import { cn, formatNumberInputCOP } from "@/lib/utils";
import { useProductoStore } from "@/store/poducto.store";
import { ProductoDto } from "@/modules/productos/types/productos";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// 👇 ahora precio y costo son STRINGS en el form
const formSchema = z.object({
    barcode: z.string().min(1, { message: "El código de barras es requerido" }),
    nombre: z.string().min(1, { message: "El nombre es requerido" }),
    categoria: z.object({
        id: z.string().uuid({ message: "La categoría seleccionada no es válida" }),
        nombre: z.string().min(1),
    }),
    unidadMedida: z.enum(["unidad", "kg"], {
        message: "La unidad de medida es requerida",
    }),
    stock: z
        .number({
            invalid_type_error: "El stock debe ser numérico",
        })
        .min(0, { message: "El stock debe ser mayor o igual a 0" }),
    cantidad: z
        .number({
            invalid_type_error: "La cantidad debe ser numérica",
        })
        .min(0, { message: "La cantidad debe ser mayor o igual a 0" }),
    precio: z
        .string()
        .min(1, { message: "El precio es requerido" }),
    costo: z
        .string()
        .min(1, { message: "El costo es requerido" }),
});

interface DialogProductoProps {
    isOpen: boolean;
    onClose: () => void;
    editingProduct: Productos | null;
    onProductSaved?: (producto: Productos) => void;
}

// helper: parsear "10.000" → 10000
const parseCOPToNumber = (value: string | number): number => {
    if (typeof value === "number") return value;
    const cleaned = value.replace(/[^\d]/g, "");
    return cleaned ? Number(cleaned) : 0;
};

export default function DialogProducto({
    isOpen,
    onClose,
    editingProduct,
    onProductSaved,
}: DialogProductoProps) {
    const units = [
        { value: "unidad", label: "Unidad" },
        { value: "kg", label: "Kilogramos (kg)" },
    ];

    const [categorias, setCategorias] = useState<CategoriaResponse[]>();
    const [openCategoria, setOpenCategoria] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState("");

    const { categorias: dataCategorias, mutation } = useCategorias();
    const { mutationProducto, mutationActualizarProducto } = useProductos();
    const productoStore = useProductoStore();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            nombre: "",
            barcode: "",
            cantidad: 0,
            precio: "",
            costo: "",
            categoria: { id: "", nombre: "" },
            unidadMedida: "unidad",
            stock: 0,
        },
    });

    // convertir kg → gramos (según tu lógica actual)
    const convertirKgAGramos = (kg: number) => kg * 1000;

    useEffect(() => {
        if (editingProduct) {
            form.reset({
                nombre: editingProduct.nombre || "",
                barcode: editingProduct.barcode || "",
                cantidad: editingProduct.cantidad || 0,
                // mostramos formateado en el input
                precio: formatNumberInputCOP(String(editingProduct.precio ?? 0)),
                costo: formatNumberInputCOP(String(editingProduct.costo ?? 0)),
                categoria: editingProduct.categoria
                    ? {
                        id: editingProduct.categoria.id,
                        nombre: editingProduct.categoria.nombre,
                    }
                    : { id: "", nombre: "" },
                unidadMedida: editingProduct.unidadMedida || "unidad",
                stock: editingProduct.stock || 0,
            });
        } else {
            form.reset({
                nombre: "",
                barcode: "",
                cantidad: 0,
                precio: "",
                costo: "",
                categoria: { id: "", nombre: "" },
                unidadMedida: "unidad",
                stock: 0,
            });
        }
    }, [editingProduct, form]);

    async function hanldeCategoria(
        field: ControllerRenderProps<z.infer<typeof formSchema>, "categoria">
    ) {
        if (!value.trim()) return;
        setIsLoading(true);

        mutation.mutate(
            { nombre: value },
            {
                onSuccess: (data) => {
                    toast.success("Categoría creada con éxito");
                    setCategorias((prev) => [...(prev || []), data]);
                    field.onChange({ id: data.id, nombre: data.nombre });

                    setValue(data.nombre);
                    setOpenCategoria(false);
                },
                onError: (error: any) => {
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

        // parsear strings formateados a number
        const costoNumber = parseCOPToNumber(data.costo);
        const precioNumber = parseCOPToNumber(data.precio);

        if (editingProduct) {           

            // 🔹 EDITAR
            const productoEditado: ProductoDto = {
                id: editingProduct.id,
                barcode: data.barcode,
                nombre: data.nombre,
                categoriaId: data.categoria.id,
                unidadMedida: data.unidadMedida,
                stock: data.unidadMedida === 'kg' ? convertirKgAGramos(data.stock) : data.stock,
                cantidad: data.cantidad,
                costo: costoNumber,
                precio: precioNumber,
            };


            mutationActualizarProducto.mutate(productoEditado, {
                onSuccess: (resp) => {
                    queryClient.invalidateQueries({ queryKey: ["productos"] });

                    const actualizado: Productos = {
                        id: resp.id,
                        nombre: resp.nombre,
                        precio: resp.precio,
                        costo: resp.costo,
                        stock: resp.stock,
                        barcode: resp.barcode,
                        descripcion: resp.descripcion,
                        sku: resp.sku,
                        unidadMedida: resp.unidadMedida,
                        cantidad: resp.cantidad,
                        isActive: resp.isActive,
                        categoria: resp.categoria,
                        createdAt: resp.createdAt,
                        updatedAt: resp.updatedAt,
                    };

                    productoStore.updateProducto(actualizado);
                    onProductSaved?.(actualizado);

                    toast.success(`Producto "${resp.nombre}" actualizado con éxito`);
                    form.reset();
                    onClose();
                },
                onError: (error: any) => {
                    const resp = error?.response?.data;
                    const messages = Array.isArray(resp?.message)
                        ? resp.message
                        : [resp?.message || "Error al actualizar el producto"];
                    toast.error("Error al actualizar el producto", {
                        description: messages.join("\n"),
                    });
                },
                onSettled: () => {
                    setIsLoading(false);
                },
            });
        } else {
            // 🔹 CREAR
            const stock = data.unidadMedida === 'kg' ? convertirKgAGramos(data.stock) : data.stock;

            const newProductoDto: ProductoDto = {
                barcode: data.barcode,
                nombre: data.nombre,
                categoriaId: data.categoria.id,
                unidadMedida: data.unidadMedida,
                stock: stock,
                cantidad: data.cantidad,
                costo: costoNumber,
                precio: precioNumber,
            };

            mutationProducto.mutate(newProductoDto, {
                onSuccess: (resp) => {
                    queryClient.invalidateQueries({ queryKey: ["productos"] });

                    const creado: Productos = {
                        id: resp.id,
                        nombre: resp.nombre,
                        precio: resp.precio,
                        costo: resp.costo,
                        stock: resp.stock,
                        barcode: resp.barcode,
                        descripcion: resp.descripcion,
                        sku: resp.sku,
                        unidadMedida: resp.unidadMedida,
                        cantidad: resp.unidadMedida === 'kg' ? convertirKgAGramos(resp.cantidad) : resp.cantidad,
                        isActive: resp.isActive,
                        categoria: resp.categoria,
                        createdAt: resp.createdAt,
                        updatedAt: resp.updatedAt,
                    };

                    productoStore.addProducto(creado);
                    onProductSaved?.(creado);

                    toast.success(`Producto "${resp.nombre}" creado con éxito`);
                    form.reset();
                    onClose();
                },
                onError: (error: any) => {
                    const resp = error?.response?.data;
                    const messages = Array.isArray(resp?.message)
                        ? resp.message
                        : resp?.message
                            ? [resp.message]
                            : ["Ocurrió un error al crear el producto"];
                    toast.error("No se pudo crear el producto", {
                        description: (
                            <div>
                                {messages.map((m: string, i: number) => (
                                    <div key={i}>{m}</div>
                                ))}
                            </div>
                        ),
                    });
                },
                onSettled: () => {
                    setIsLoading(false);
                },
            });
        }
    }

    useEffect(() => {
        setCategorias(dataCategorias);
    }, [dataCategorias]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="min-h-[50vh] min-w-[800px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
                            <DialogDescription>
                                {editingProduct
                                    ? "Modifica los datos del producto"
                                    : "Agrega un nuevo producto al inventario"}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* BARCODE */}
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
                                                    disabled={!!editingProduct}
                                                    {...field}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                    placeholder="Ej: 1234567890123"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* NOMBRE */}
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

                                {/* CATEGORIA */}
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
                                                <Popover open={openCategoria} onOpenChange={setOpenCategoria}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={openCategoria}
                                                            className=" justify-between"
                                                        >
                                                            {field.value?.nombre ? field.value.nombre : "Seleccionar una categoria..."}
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
                                                                {!isLoading ? (
                                                                    <Check
                                                                        onClick={() => hanldeCategoria(field)}
                                                                        className="mr-2 mt-2 h-6 w-6 cursor-pointer "
                                                                    />
                                                                ) : (
                                                                    <Spinner className="mr-2 mt-2 h-6 w-6 cursor-pointer " />
                                                                )}
                                                            </div>
                                                            <CommandList>
                                                                <CommandEmpty>No se encuentra la categoría</CommandEmpty>
                                                                <CommandGroup>
                                                                    {categorias?.map((cate) => (
                                                                        <CommandItem
                                                                            key={cate.id}
                                                                            value={cate.nombre}
                                                                            onSelect={() => {
                                                                                field.onChange({ id: cate.id, nombre: cate.nombre });
                                                                                setValue(cate.nombre);
                                                                                setOpenCategoria(false);
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
                                    )}
                                />

                                {/* UNIDAD MEDIDA */}
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Seleccione una unidad" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {units.map((unit) => (
                                                                <SelectItem key={unit.value} value={unit.value}>
                                                                    {unit.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* STOCK */}
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
                                                    value={field.value ?? 0}
                                                    onChange={(e) => {
                                                        const num = Number(e.target.value.replace(/[^\d]/g, "")) || 0;
                                                        field.onChange(num);
                                                    }}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                    placeholder="Ej: 100"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* CANTIDAD */}
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
                                                    value={field.value ?? 0}
                                                    onChange={(e) => {
                                                        const num = Number(e.target.value.replace(/[^\d]/g, "")) || 0;
                                                        field.onChange(num);
                                                    }}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                    placeholder="Ej: 100"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* COSTO */}
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
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        const formatted = formatNumberInputCOP(e.target.value);
                                                        field.onChange(formatted);
                                                    }}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                    placeholder="Ej: 10.000"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* PRECIO */}
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
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        const formatted = formatNumberInputCOP(e.target.value);
                                                        field.onChange(formatted);
                                                    }}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                    placeholder="Ej: 100.000"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="button" onClick={limpiarFormulario}>
                                Limpiar formulario
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Spinner className="mr-2" />}
                                {editingProduct ? "Guardar cambios" : "Crear producto"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
