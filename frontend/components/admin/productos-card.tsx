import { useState } from "react";
import { Barcode, DollarSign, Edit, Hash, Layers, Package, Plus, Tag, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Productos } from "@/config/app.interface";
import { useCategorias } from "@/modules/categorias/hooks/useCategorias";
import { toast } from "sonner";

interface ProductoCardProps {
    producto: Productos[];
    isDialogOpen: boolean;
    setIsDialogOpen: (isOpen: boolean) => void;
}


export default function ProductosCard({ producto, isDialogOpen, setIsDialogOpen }: ProductoCardProps) {
    const [editingProduct, setEditingProduct] = useState<Productos | null>(null);
    const [nombreCategoria, setNombreCategoria] = useState<string>("");

    const [product, setProduct] = useState({
        barcode: '',
        nombre: '',
        categoria: '',
        unidad: 'unidad',
        stock: '',
        precio: '',
        cantidad: ''
    });
    const units = ['unidad', 'lt', 'kg', 'lb', 'g', 'ml'];
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!product.barcode || !product.nombre || !product.categoria || !product.unidad || !product.stock || !product.precio || !product.cantidad) {
            alert('Por favor completa todos los campos');
            return;
        }

        setProduct({
            ...product

        });

        setProduct({
            barcode: '',
            nombre: '',
            categoria: '',
            unidad: 'unidad',
            stock: '',
            precio: '',
            cantidad: ''
        });

        alert('Producto agregado exitosamente');
    };

    const handleDelete = (id: string) => {
        // setProduct(prev => prev.filter(p => p.id !== id));
    };

    const { mutation } = useCategorias()

    const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNombreCategoria(e.target.value);
        mutation.mutate({
            nombre: e.target.value,
        }, {
            onSuccess(data) {
                toast.success("Categoría creada con éxito", {
                    description: `Se ha creado la categoría ${e.target.value}.`,
                });

            },
        })
    }


    const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingProduct) {
            // Lógica para actualizar el producto
        } else {
            // Lógica para agregar un nuevo producto
        }
    }

    const handleDeleteProduct = (id: string) => {
        // Lógica para eliminar el producto
    }



    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Inventario de Productos</CardTitle>
                        <CardDescription>Gestiona tu catálogo de productos</CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                        <DialogContent>
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
                                {/* <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="barcode">Código de Barras</Label>
                                        <Input id="barcode" name="barcode" defaultValue={editingProduct?.barcode} required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nombre</Label>
                                        <Input id="name" name="name" defaultValue={editingProduct?.nombre} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="price">Precio de Venta</Label>
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                step="0.01"
                                                defaultValue={editingProduct?.precio}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="cost">Costo</Label>
                                            <Input
                                                id="cost"
                                                name="cost"
                                                type="number"
                                                step="0.01"
                                                defaultValue={editingProduct?.costo}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="category">Categoría</Label>
                                            
                                            <Select name="category">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Bebidas">Bebidas</SelectItem>
                                                    <SelectItem value="aseo">Aseo</SelectItem>
                                                    <SelectItem value="lacteos">Lacteos</SelectItem>
                                                    <SelectItem value="limpieza">Limpieza</SelectItem>
                                                    <SelectItem value="mascotas">Mascotas</SelectItem>
                                                    <SelectItem value="aceites">Aceites</SelectItem>
                                                    <SelectItem value="granos">Granos</SelectItem>
                                                    <SelectItem value="proteinas">Proteínas</SelectItem>
                                                    <SelectItem value="fruver">Frutas y verduras</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="stock">Stock</Label>
                                            <Input
                                                id="stock"
                                                name="stock"
                                                type="number"
                                                defaultValue={editingProduct?.stock}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div> */}
                                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                                    <div className="max-w-4xl mx-auto">
                                        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                                            <div className="flex items-center gap-3 mb-6">
                                                <Package className="w-8 h-8 text-indigo-600" />
                                                <h1 className="text-3xl font-bold text-gray-800">Agregar Producto</h1>
                                            </div>

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
                                                            value={product.barcode}
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
                                                            value={product.nombre}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                            placeholder="Ej: Coca Cola 2L"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                            <Tag className="w-4 h-4" />
                                                            Categoría
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="category"
                                                            value={product.categoria}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                            placeholder="Ej: Bebidas"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                            <Layers className="w-4 h-4" />
                                                            Unidad de Medida
                                                        </label>
                                                        <select
                                                            name="unit"
                                                            value={product.unidad}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                                                        >
                                                            {units.map(unit => (
                                                                <option key={unit} value={unit}>{unit}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                            <Hash className="w-4 h-4" />
                                                            Stock Disponible
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            name="stock"
                                                            value={product.stock}
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
                                                            value={product.precio}
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
                                                            value={product.cantidad}
                                                            min="0"
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                            placeholder="Ej: 50"
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
                                                >
                                                    Agregar Producto
                                                </button>
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
                                                                            onClick={() => handleDelete(p.id)}
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
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead className="text-right">Costo</TableHead>
                            <TableHead className="text-right">Precio</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                            <TableHead className="text-right">Margen</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {producto.map((product) => {
                            const margin = ((product.precio - product.costo) / product.precio) * 100
                            return (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.nombre}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{product.categoria.nombre}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">${product.costo.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${product.precio.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={product.stock < 30 ? "destructive" : "default"}>{product.stock}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="text-sm font-medium">{margin.toFixed(1)}%</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setEditingProduct(product)
                                                    setIsDialogOpen(true)
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}