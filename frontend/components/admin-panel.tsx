"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Plus, Edit, Trash2, DollarSign, ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import DialogProducto from "./admin/dialog-producto"
import { Categorias } from "@/config/app.interface"

// Tipos
interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  cost: number
}

interface Sale {
  id: string
  date: string
  total: number
  items: number
  status: string
}
const initialCategories: Categorias[] = [
  { id: "1", nombre: "Bebidas", descripcion: '', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "2", nombre: "Comida", descripcion: '', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "3", nombre: "Panadería", descripcion: '', isActive: true, createdAt: new Date(), updatedAt: new Date() },
]
// Datos de ejemplo
const initialProducts: Product[] = [
  { id: "1", name: "Café Americano", price: 3.5, category: "Bebidas", stock: 50, cost: 1.5 },
  { id: "2", name: "Cappuccino", price: 4.5, category: "Bebidas", stock: 45, cost: 2.0 },
  { id: "3", name: "Croissant", price: 2.5, category: "Panadería", stock: 30, cost: 1.0 },
  { id: "4", name: "Sandwich", price: 6.0, category: "Comida", stock: 25, cost: 3.0 },
  { id: "5", name: "Ensalada", price: 7.5, category: "Comida", stock: 20, cost: 3.5 },
  { id: "6", name: "Jugo Natural", price: 4.0, category: "Bebidas", stock: 35, cost: 2.0 },
  { id: "7", name: "Muffin", price: 3.0, category: "Panadería", stock: 40, cost: 1.2 },
  { id: "8", name: "Té Verde", price: 3.0, category: "Bebidas", stock: 60, cost: 1.0 },
]

const sampleSales: Sale[] = [
  { id: "V001", date: "2025-01-16 10:30", total: 15.5, items: 3, status: "Completada" },
  { id: "V002", date: "2025-01-16 11:15", total: 22.0, items: 5, status: "Completada" },
  { id: "V003", date: "2025-01-16 12:00", total: 8.5, items: 2, status: "Completada" },
  { id: "V004", date: "2025-01-16 13:45", total: 31.5, items: 7, status: "Completada" },
]

export function AdminPanel() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Estadísticas
  const totalSales = sampleSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.stock < 30).length

  // Agregar/Editar producto
  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const productData: Product = {
      id: editingProduct?.id || `${Date.now()}`,
      name: formData.get("name") as string,
      price: Number.parseFloat(formData.get("price") as string),
      cost: Number.parseFloat(formData.get("cost") as string),
      category: formData.get("category") as string,
      stock: Number.parseInt(formData.get("stock") as string),
    }

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? productData : p)))
    } else {
      setProducts([...products, productData])
    }

    setIsDialogOpen(false)
    setEditingProduct(null)
  }

  // Eliminar producto
  const handleDeleteProduct = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Panel de Administración</h1>
                <p className="text-sm text-muted-foreground">Gestiona tu negocio</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ventas del Día</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+12% vs ayer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">{lowStockProducts} con stock bajo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sampleSales.length}</div>
              <p className="text-xs text-muted-foreground">Hoy</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="sales">Ventas</TabsTrigger>
          </TabsList>

          {/* Tab de Productos */}
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Inventario de Productos</CardTitle>
                    <CardDescription>Gestiona tu catálogo de productos</CardDescription>
                  </div>
                  {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                            {editingProduct
                              ? "Modifica los datos del producto"
                              : "Agrega un nuevo producto al inventario"}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input id="name" name="name" defaultValue={editingProduct?.name} required />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="price">Precio de Venta</Label>
                              <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                defaultValue={editingProduct?.price}
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
                                defaultValue={editingProduct?.cost}
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="category">Categoría</Label>
                              <Select name="category" defaultValue={editingProduct?.category || "Bebidas"}>
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
                  </Dialog> */}

                  <DialogProducto
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSubmit={() => setIsDialogOpen(false)}
                    producto={[]}
                    categories={initialCategories}
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
                    {products.map((product) => {
                      const margin = ((product.price - product.cost) / product.price) * 100
                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{product.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right">${product.cost.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={product.stock < 30 ? "destructive" : "default"}>{product.stock}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-sm font-medium">{margin.toFixed(1)}%</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                className="cursor-pointer"
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
          </TabsContent>

          {/* Tab de Ventas */}
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Ventas</CardTitle>
                <CardDescription>Registro de todas las transacciones</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Venta</TableHead>
                      <TableHead>Fecha y Hora</TableHead>
                      <TableHead className="text-right">Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.id}</TableCell>
                        <TableCell>{sale.date}</TableCell>
                        <TableCell className="text-right">{sale.items}</TableCell>
                        <TableCell className="text-right font-medium">${sale.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="default">{sale.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
