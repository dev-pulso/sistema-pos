"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Plus, Edit, Trash2, DollarSign, ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import DialogProducto from "./admin/dialog-producto"
import { Productos } from "@/config/app.interface"
import useProductos from "@/modules/productos/hooks/useProductos"
import { formatCurrency } from "@/lib/utils"
import ProductosCard from "./admin/productos-card"


export function AdminPanel() {
  const [products, setProducts] = useState<Productos[]>([])
  const [editingProduct, setEditingProduct] = useState<Productos | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Estadísticas
  const totalSales = 0//sampleSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.stock < 30).length
  const { productos } = useProductos()

  const handleDeleteProduct = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  useEffect(() => {
    setProducts(productos)
  }, [productos])

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
              <div className="text-2xl font-bold">{0}</div>
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
            <ProductosCard producto={products!} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
           {/*  <Card>
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
                          <TableCell className="text-right">{formatCurrency(product.costo)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.precio)}</TableCell>
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
            </Card>*/}
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
                    {productos.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.id}</TableCell>
                        <TableCell>{sale.createdAt.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{sale.cantidad}</TableCell>
                        <TableCell className="text-right font-medium">${sale.costo}</TableCell>
                        <TableCell>
                          <Badge variant="default">{sale.isActive ? "Activo" : "Inactivo"}</Badge>
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
