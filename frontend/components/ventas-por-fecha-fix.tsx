"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { obtenerReporteVentas } from '@/modules/ventas/services/ventas.service';

// Componente de ejemplo para mostrar el formato correcto de fechas
export default function VentasPorFechaFix() {
  const [fechaInicial, setFechaInicial] = useState<Date>();
  const [fechaFinal, setFechaFinal] = useState<Date>();
  const [ventas, setVentas] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string>('');

  // Función para formatear fecha en formato ISO (yyyy-MM-dd)
  const formatearFechaISO = (fecha: Date): string => {
    return format(fecha, 'yyyy-MM-dd');
  };

  // Función para validar fechas
  const validarFechas = (): boolean => {
    setError('');

    if (!fechaInicial || !fechaFinal) {
      setError('Por favor seleccione ambas fechas');
      return false;
    }

    // Validar que las fechas sean objetos Date válidos
    const fechaInicioValida = fechaInicial instanceof Date && !isNaN(fechaInicial.getTime());
    const fechaFinValida = fechaFinal instanceof Date && !isNaN(fechaFinal.getTime());

    if (!fechaInicioValida || !fechaFinValida) {
      setError('Las fechas seleccionadas no son válidas');
      return false;
    }

    // Validar que la fecha inicial no sea posterior a la fecha final
    if (fechaInicial > fechaFinal) {
      setError('La fecha inicial no puede ser posterior a la fecha final');
      return false;
    }

    return true;
  };

  const buscarVentas = async () => {
    if (!validarFechas()) {
      return;
    }

    setBuscando(true);

    try {
      // Mostrar el formato de las fechas que se enviarían al backend
      const fechaInicioISO = formatearFechaISO(fechaInicial!);
      const fechaFinISO = formatearFechaISO(fechaFinal!);

      // Aquí normalmente se llamaría al servicio
      const response = await obtenerReporteVentas(fechaInicial!, fechaFinal!);

      console.log('Respuesta del backend:', response);
      

      // Simular respuesta exitosa
      setTimeout(() => {
        setVentas([
          {
            id: '1',
            fecha: `${fechaInicioISO}T10:30:00.000Z`,
            total: 1250.50,
            cliente: 'Juan Pérez',
            estado: 'Completada'
          }
        ]);
        setBuscando(false);
      }, 1500);

    } catch (err) {
      setError('Error al buscar ventas: ' + (err as Error).message);
      setBuscando(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Búsqueda de Ventas por Fecha</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Información sobre el formato de fecha */}


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>Fecha Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!fechaInicial && "text-muted-foreground"
                      }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaInicial ? (
                      <>
                        {format(fechaInicial, "PPP", { locale: es })}
                        <span className="text-xs text-gray-500 ml-2">
                          ({formatearFechaISO(fechaInicial)})
                        </span>
                      </>
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
                    className={`w-full justify-start text-left font-normal ${!fechaFinal && "text-muted-foreground"
                      }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaFinal ? (
                      <>
                        {format(fechaFinal, "PPP", { locale: es })}
                        <span className="text-xs text-gray-500 ml-2">
                          ({formatearFechaISO(fechaFinal)})
                        </span>
                      </>
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

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {ventas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de la Búsqueda</CardTitle>
            <div className="text-sm text-gray-600">
              Total de ventas: {ventas.length}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-green-600 mb-4">
              ✓ Fechas enviadas correctamente al backend
            </div>
            <div className="bg-gray-100 p-3 rounded-md text-sm font-mono">
              <div>Fecha Inicial: {fechaInicial && formatearFechaISO(fechaInicial)}</div>
              <div>Fecha Final: {fechaFinal && formatearFechaISO(fechaFinal)}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {ventas.length === 0 && fechaInicial && fechaFinal && !error && (
        <Card>
          <CardContent className="text-center py-8 text-gray-500">
            No se encontraron ventas en el período seleccionado.
          </CardContent>
        </Card>
      )}
    </div>
  );
}