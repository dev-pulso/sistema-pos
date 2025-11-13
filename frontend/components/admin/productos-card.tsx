import { useState, useEffect } from "react";
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
import DialogProducto from "./dialog-producto";
import { formatNumberInputCOP } from "@/lib/utils";

interface ProductoCardProps {
    producto: Productos[];
    isDialogOpen: boolean;
    setIsDialogOpen: (isOpen: boolean) => void;
}


export default function ProductosCard({ producto, isDialogOpen, setIsDialogOpen }: ProductoCardProps) {
    const [editingProduct, setEditingProduct] = useState<Productos | null>(null);
    const [productosState, setProductosState] = useState<Productos[]>(producto);

    useEffect(() => {
        setProductosState(producto);
    }, [producto]);


    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Inventario de Productos</CardTitle>
                        <CardDescription>Gestiona tu catálogo de productos</CardDescription>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingProduct(null)
                            setIsDialogOpen(true)
                        }}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Producto
                    </Button>
                    <DialogProducto
                        isOpen={isDialogOpen}
                        onClose={() => {
                            setIsDialogOpen(false)
                            setEditingProduct(null)
                        }}
                        editingProduct={editingProduct}
                        onCreated={(newP) => {
                            // prepend the new product so it appears at top of the table
                            setProductosState((prev) => [newP, ...prev]);
                            setIsDialogOpen(false);
                            setEditingProduct(null);
                            toast.success(`Producto "${newP.nombre}" agregado`);
                        }}

                    />
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
                        {productosState.map((product) => {
                            const margin = ((product.precio - product.costo) / product.precio) * 100
                            return (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.nombre}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{product.categoria.nombre}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">${formatNumberInputCOP(product.costo.toString())}</TableCell>
                                    <TableCell className="text-right">${formatNumberInputCOP(product.precio.toString())}</TableCell>
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
                                            <Button variant="ghost" size="icon" onClick={() => console.log(product.id)}>
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