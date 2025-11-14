"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, DollarSign, ShoppingCart, ArrowLeft } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Productos } from "@/config/app.interface"
import ProductosCard from "./admin/productos-card"
import { useProductoStore } from "@/store/poducto.store"
import SalesDashboard from "./sales-dashboard"
import VentasCard from "./admin/ventas-card"
import { useResportesXdia } from "@/modules/ventas/hooks/useReporteVentas"
import { formatCurrency } from "@/lib/utils"


export function AdminPanel() {
  const [editingProduct, setEditingProduct] = useState<Productos | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { productos, setProductos } = useProductoStore()
  const data = useResportesXdia()

  // Estadísticas
  const totalSales = 0//sampleSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalProducts = productos.length
  const lowStockProducts = productos.filter((p) => p.stock < 30).length

  const handleDeleteProduct = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      setProductos(productos.filter((p) => p.id !== id))
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
              <div className="text-2xl font-bold">{formatCurrency(data.data?.montoTotal || 0)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total ventas del Día</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.data?.totalVentas || 0}</div>
              <p className="text-xs text-muted-foreground">Hoy</p>
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

          
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="sales">Ventas</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          {/* Tab de Productos */}
          <TabsContent value="products" className="space-y-4">
            <ProductosCard producto={productos} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />

          </TabsContent>

          {/* Tab de Ventas */}
          <TabsContent value="sales" className="space-y-4">
            {
              data.data && <VentasCard reporteVentas={data.data}/>
            }
          </TabsContent>

          {/* Tab de Reportes */}
          <TabsContent value="reports" className="space-y-4">
            <SalesDashboard/>
            {/* <Card>
              <CardHeader>
                <CardTitle>Reportes</CardTitle>
                <CardDescription>Genera reportes detallados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ReportCard title="Ventas por Día" />
                  <ReportCard title="Productos más Vendidos" />
                  <ReportCard title="Productos con Bajo Stock" />
                  <ReportCard title="Ventas por Mes" />
                </div>
              </CardContent>
            </Card> */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
