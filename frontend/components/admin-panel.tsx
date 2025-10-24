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
import { Categorias, Productos } from "@/config/app.interface"

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
const initialProducts: Productos[] = [
  { id: "1", nombre: "Café Americano", precio: 3.5, costo: 1.5, stock: 50, barcode: "13123123123142", descripcion: "", sku: "", unidadMedida: "unidad", cantidad: 10, isActive: false, categoria: {} as Categorias, createdAt: new Date(), updatedAt: new Date() },
  { id: "2", nombre: "Cappuccino", precio: 4.5, costo: 2.0, stock: 45, barcode: "12312314234", descripcion: "", sku: "", unidadMedida: "unidad", cantidad: 20, isActive: false, categoria: {} as Categorias, createdAt: new Date(), updatedAt: new Date() },
  { id: "3", nombre: "Croissant", precio: 2.5, costo: 1.0, stock: 30, barcode: "4324322563441", descripcion: "", sku: "", unidadMedida: "unidad", cantidad: 30, isActive: false, categoria: {} as Categorias, createdAt: new Date(), updatedAt: new Date() },
  { id: "4", nombre: "Sandwich", precio: 6.0, costo: 3.0, stock: 25, barcode: "12312423441", descripcion: "", sku: "", unidadMedida: "unidad", cantidad: 40, isActive: false, categoria: {} as Categorias, createdAt: new Date(), updatedAt: new Date() },
]

const sampleSales: Sale[] = [
  { id: "V001", date: "2025-01-16 10:30", total: 15.5, items: 3, status: "Completada" },
  { id: "V002", date: "2025-01-16 11:15", total: 22.0, items: 5, status: "Completada" },
  { id: "V003", date: "2025-01-16 12:00", total: 8.5, items: 2, status: "Completada" },
  { id: "V004", date: "2025-01-16 13:45", total: 31.5, items: 7, status: "Completada" },
]

export function AdminPanel() {
  const [products, setProducts] = useState<Productos[]>(initialProducts)
  const [editingProduct, setEditingProduct] = useState<Productos | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Estadísticas
  const totalSales = sampleSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.stock < 30).length

  // Agregar/Editar producto
  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const productData: Productos = {
      id: editingProduct?.id || `${Date.now()}`,
      nombre: formData.get("nombre") as string,
      precio: Number.parseFloat(formData.get("precio") as string),
      costo: Number.parseFloat(formData.get("costo") as string),
      // categoria: formData.get("categoria") as string,
      stock: Number.parseInt(formData.get("stock") as string),
      barcode: "",
      descripcion: "",
      sku: "",
      unidadMedida: "unidad",
      cantidad: 0,
      isActive: false,
      categoria: initialCategories.find((c) => c.nombre === formData.get("categoria") as string) || {} as Categorias,
      createdAt: new Date(),
      updatedAt: new Date(),
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
                    onClose={() => setIsDialogOpen(false)}
                    editingProduct={editingProduct}
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
