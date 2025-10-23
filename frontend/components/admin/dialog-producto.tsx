import { Plus, Package, Barcode, Tag, Layers, DollarSign, Hash } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Categorias, Productos } from "@/config/app.interface";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function DialogProducto({
    isOpen,
    onClose,
    onSubmit,
    producto,
    categories
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: Productos) => void;
    producto: Productos[];
    categories: Categorias[];
}) {

    const units = ['unidad', 'lt', 'kg', 'lb', 'g', 'ml'];
    const [editingProduct, setEditingProduct] = useState<Productos | null>(null)
    const [barCode, setBarCode] = useState<string>("")
    const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    }
    const handleDeleteProduct = () => {
        if (editingProduct) {
            onSubmit(editingProduct)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <Button
                    onClick={() => {
                        setEditingProduct(null)
                    }}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Producto
                </Button>
            </DialogTrigger>
            <DialogContent className="min-h-[50vh] min-w-[800px]">
                <form onSubmit={handleSaveProduct}>
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
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                <Barcode className="w-4 h-4" />
                                                Código de Barra
                                            </label>
                                            <Input
                                                type="text"
                                                name="barcode"
                                                value={barCode}
                                                onChange={(e) => setBarCode(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                placeholder="Ej: 7501234567890"
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                <Package className="w-4 h-4" />
                                                Nombre del Producto
                                            </label>
                                            <Input
                                                type="text"
                                                name="name"
                                                // value={product.nombre}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                placeholder="Ej: Coca Cola 2L"
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                <Tag className="w-4 h-4" />
                                                Categoría
                                            </label>
                                            <Select>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccione una unidad" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {
                                                            producto.map((category) => (
                                                                <SelectItem key={category.id} value={category.id}>
                                                                    {category.nombre}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                <Layers className="w-4 h-4" />
                                                Unidad de Medida
                                            </label>
                                            <Select>
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
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                <Hash className="w-4 h-4" />
                                                Stock Disponible
                                            </label>
                                            <Input
                                                type="number"
                                                name="stock"
                                                // value={product.stock}
                                                min="0"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                placeholder="Ej: 100"
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                <DollarSign className="w-4 h-4" />
                                                Precio
                                            </label>
                                            <Input
                                                type="number"
                                                name="price"
                                                // value={product.precio}
                                                min="0"
                                                step="0.01"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                placeholder="Ej: 25.50"
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                <Hash className="w-4 h-4" />
                                                Cantidad
                                            </label>
                                            <Input
                                                type="number"
                                                name="quantity"
                                                // value={product.cantidad}
                                                min="0"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                placeholder="Ej: 50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {producto.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-xl p-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Productos Agregados</h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b-2 border-gray-200">
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Código</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nombre</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Categoría</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Unidad</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Precio</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cantidad</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {producto.map((p) => (
                                                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="py-3 px-4 text-sm text-gray-600">{p.barcode}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-800 font-medium">{p.nombre}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-600">{p.categoria.nombre}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-600">{p.unidadMedida}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-600">{p.stock}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-600">${p.precio}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-600">{p.cantidad}</td>
                                                        <td className="py-3 px-4">
                                                            <button
                                                                // onClick={() => handleDelete(p.id)}
                                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">{editingProduct ? "Guardar Cambios" : "Crear Producto"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}