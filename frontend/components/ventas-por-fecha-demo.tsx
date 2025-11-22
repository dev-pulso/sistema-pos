"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Search } from 'lucide-react';

interface Venta {
  id: string;
  fecha: string;
  total: number;
  cliente: string;
  estado: string;
  metodoPago: string;
}

// Datos de ejemplo para demostrar la funcionalidad
const ventasEjemplo: Venta[] = [
  {
    id: '1',
    fecha: '2024-01-15T10:30:00.000Z',
    total: 1250.50,
    cliente: 'Juan Pérez',
    estado: 'Completada',
    metodoPago: 'Efectivo'
  },
  {
    id: '2',
    fecha: '2024-01-15T14:20:00.000Z',
    total: 850.00,
    cliente: 'María García',
    estado: 'Completada',
    metodoPago: 'Tarjeta'
  },
  {
    id: '3',
    fecha: '2024-01-16T09:15:00.000Z',
    total: 2100.75,
    cliente: 'Carlos Rodríguez',
    estado: 'Completada',
    metodoPago: 'Transferencia'
  }
];

export default function VentasPorFechaDemo() {
  const [fechaInicial, setFechaInicial] = useState<Date>();
  const [fechaFinal, setFechaFinal] = useState<Date>();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [buscando, setBuscando] = useState(false);

  const buscarVentas = async () => {
    if (!fechaInicial || !fechaFinal) {
      alert('Por favor seleccione ambas fechas');
      return;
    }

    // Validar que las fechas sean válidas
    const fechaInicioValida = fechaInicial instanceof Date && !isNaN(fechaInicial.getTime())
    const fechaFinValida = fechaFinal instanceof Date && !isNaN(fechaFinal.getTime())
    
    if (!fechaInicioValida || !fechaFinValida) {
      alert('Por favor seleccione fechas válidas');
      return;
    }

    // Validar que la fecha inicial no sea posterior a la fecha final
    if (fechaInicial > fechaFinal) {
      alert('La fecha inicial no puede ser posterior a la fecha final');
      return;
    }

    setBuscando(true);
    
    // Simular búsqueda con datos de ejemplo
    setTimeout(() => {
      const ventasFiltradas = ventasEjemplo.filter(venta => {
        const fechaVenta = new Date(venta.fecha);
        return fechaVenta >= fechaInicial && fechaVenta <= fechaFinal;
      });
      
      setVentas(ventasFiltradas);
      setBuscando(false);
    }, 1000);
  };

  const calcularTotal = () => {
    return ventas.reduce((total, venta) => total + venta.total, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Búsqueda de Ventas por Fecha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>Fecha Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !fechaInicial && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaInicial ? (
                      format(fechaInicial, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fechaInicial}
                    onSelect={setFechaInicial}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !fechaFinal && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaFinal ? (
                      format(fechaFinal, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
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
              onClick={buscarVentas} 
              disabled={buscando}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Search className="mr-2 h-4 w-4" />
              {buscando ? 'Buscando...' : 'Buscar Ventas'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {ventas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de la Búsqueda</CardTitle>
            <div className="text-sm text-gray-600">
              Total de ventas: {ventas.length} | Total: ${calcularTotal().toFixed(2)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Fecha</th>
                    <th className="text-left p-2">Cliente</th>
                    <th className="text-left p-2">Método de Pago</th>
                    <th className="text-right p-2">Total</th>
                    <th className="text-center p-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((venta) => (
                    <tr key={venta.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        {format(new Date(venta.fecha), "dd/MM/yyyy HH:mm", { locale: es })}
                      </td>
                      <td className="p-2">{venta.cliente}</td>
                      <td className="p-2">{venta.metodoPago}</td>
                      <td className="p-2 text-right">${venta.total.toFixed(2)}</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          venta.estado === 'Completada' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {venta.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {ventas.length === 0 && fechaInicial && fechaFinal && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No se encontraron ventas en el período seleccionado.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}