"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useReporteVentas } from "@/modules/ventas/hooks/useReporteVentas"
import { Badge } from "@/components/ui/badge"
import { obtenerReporteVentas } from "@/modules/ventas/services/ventas.service"

export function VentasPorFecha() {
  const [fechaInicial, setFechaInicial] = useState<Date>()
  const [fechaFinal, setFechaFinal] = useState<Date>()
  const [buscarActivado, setBuscarActivado] = useState(false)

  const { data: reporte, isLoading, error } = useReporteVentas(
    new Date(fechaInicial!),
    new Date(fechaFinal!)
  )

  const handleBuscar = async () => {
    if (fechaInicial && fechaFinal) {
      // Validar que las fechas sean válidas 
      const fechaInicioValida = fechaInicial instanceof Date && !isNaN(fechaInicial.getTime())
      const fechaFinValida = fechaFinal instanceof Date && !isNaN(fechaFinal.getTime())

      const response = await obtenerReporteVentas(fechaInicial!, fechaFinal!);

      console.log('Respuesta del backend:', response);

      if (fechaInicioValida && fechaFinValida) {
        setBuscarActivado(true)
      } else {
        alert('Por favor seleccione fechas válidas')
      }
    } else {
      alert('Por favor seleccione ambas fechas')
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Búsqueda de Ventas por Fecha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Fecha Inicial</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !fechaInicial && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaInicial ? format(fechaInicial, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaInicial}
                    onSelect={setFechaInicial}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Fecha Final</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !fechaFinal && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaFinal ? format(fechaFinal, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaFinal}
                    onSelect={setFechaFinal}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              onClick={handleBuscar}
              disabled={!fechaInicial || !fechaFinal || isLoading}
            >
              {isLoading ? "Buscando..." : "Buscar Ventas"}
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">Error al buscar ventas: {error.message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {reporte && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-600">Total de Ventas</p>
                  <p className="text-2xl font-bold text-blue-900">{reporte.totalVentas}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-600">Monto Total</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(reporte.montoTotal)}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-600">Productos Vendidos</p>
                  <p className="text-2xl font-bold text-purple-900">{reporte.productosVendidos?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalle de Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Venta</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Detalles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reporte.ventas?.map((venta: any) => (
                    <TableRow key={venta.id}>
                      <TableCell className="font-medium">{venta.id}</TableCell>
                      <TableCell>
                        {venta.fecha ? new Date(venta.fecha).toLocaleString('es-ES') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${formatCurrency(venta.total ? venta.total : 0)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {venta.detalles?.map((detalle: any, index: number) => (
                            <div key={index} className="text-sm">
                              <Badge variant="outline" className="mr-1">
                                {detalle.cantidad}x
                              </Badge>
                              {detalle.producto} - {formatCurrency(detalle.subtotal ? detalle.subtotal : 0)}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {(!reporte.ventas || reporte.ventas.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron ventas en el período seleccionado.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}