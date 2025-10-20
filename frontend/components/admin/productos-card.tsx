import { useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Productos } from "@/config/app.interface";

interface ProductoCardProps {
    producto: Productos[];
    isDialogOpen: boolean;
    setIsDialogOpen: (isOpen: boolean) => void;
}


export default function ProductosCard({ producto, isDialogOpen, setIsDialogOpen }: ProductoCardProps) {
    const [editingProduct, setEditingProduct] = useState<Productos | null>(null);


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
                                <div className="grid gap-4 py-4">
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
                                            {/* <Select name="category" defaultValue={editingProduct?.categoria || "Bebidas"}> */}
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