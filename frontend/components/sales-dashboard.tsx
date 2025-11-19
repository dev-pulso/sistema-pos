import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton";
import { useResportesDiarias, useResportesMensual } from "@/modules/ventas/hooks/useReporteVentas";
import { formatCurrency } from "@/lib/utils";
import { obtenerReporteVentasDiarias } from "@/modules/ventas/services/ventas.service";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
// Tipos que devuelve tu backend
type PuntoGrafica = {
  key: string;
  label: string;
  total: number;
  cantidadVentas: number;
};

type RespuestaGrafica = {
  resumen: {
    totalVentas: number;
    montoTotal: number;
  };
  grafica: PuntoGrafica[];
};



function getDefaultDates() {
  const hoy = new Date();
  const hace7 = new Date();
  hace7.setDate(hoy.getDate() - 6); // últimos 7 días incl. hoy

  const toIso = (d: Date) => d.toISOString().slice(0, 10); // YYYY-MM-DD

  return {
    inicio: toIso(hace7),
    fin: toIso(hoy),
  };
}

const currentYear = new Date().getFullYear();
const yearsOptions = Array.from({ length: 5 }).map((_, i) => currentYear - i);

export function SalesDashboard() {
  const [open, setOpen] = React.useState(false)
  const [openFin, setOpenFin] = React.useState(false)
  const [inicio, setInicio] = React.useState<Date | undefined>(
    new Date()
  )
  const [fin, setFin] = React.useState<Date | undefined>(
    new Date()
  )
  const [month, setMonth] = React.useState<Date | undefined>(inicio)
  const [value, setValue] = React.useState(formatDate(inicio))
  const [tab, setTab] = React.useState<"diaria" | "mensual">("diaria");

  const defaultDates = React.useMemo(() => getDefaultDates(), []);

  const [year, setYear] = React.useState<number>(currentYear);



  const diariaQuery = useResportesDiarias(inicio!, fin!);

   function isValidDate(date: Date | undefined) {
    if (!date) {
      return false
    }
    return !isNaN(date.getTime())
  }
  function formatDate(date: Date | undefined) {
    if (!date) {
      return ""
    }


    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }
  const config = {
    theme: {
      label: 'ventas',
    }
  } satisfies ChartConfig

  const mensualQuery = useResportesMensual(year.toString());

  return (
    <Card className="w-full h-[calc(100vh-150px)]">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Reportes de ventas</CardTitle>
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "diaria" | "mensual")}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="diaria">Diario</TabsTrigger>
            <TabsTrigger value="mensual">Mensual</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        {/* ----------------- TAB DIARIA ----------------- */}
        <Tabs value={tab} className="space-y-4">
          <TabsContent value="diaria" className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex flex-col gap-3">
                <Label htmlFor="date" className="px-1">
                  Fecha inicio
                </Label>
                <div className="relative flex gap-2">
                  <Input
                    id="date"
                    value={inicio ? formatDate(inicio) : ""}
                    placeholder="Nov 01, 2025"
                    className="bg-background pr-10"
                    onChange={(e) => {
                      const date = new Date(e.target.value)
                      setInicio(date)
                      if (isValidDate(date)) {
                        setMonth(date)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setOpen(true)
                      }
                    }}
                  />
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-picker"
                        variant="ghost"
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                      >
                        <CalendarIcon className="size-3.5" />
                        <span className="sr-only">Select date</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="end"
                      alignOffset={-8}
                      sideOffset={10}
                    >
                      <Calendar
                        mode="single"
                        selected={inicio}
                        captionLayout="dropdown"
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={(date) => {
                          setInicio(date)
                          setOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="date" className="px-1">
                  Fecha final
                </Label>
                <div className="relative flex gap-2">
                  <Input
                    id="date"
                    value={fin ? formatDate(fin) : ""}
                    placeholder="Nov 01, 2025"
                    className="bg-background pr-10"
                    onChange={(e) => {
                      const date = new Date(e.target.value)
                      setFin(date)
                      if (isValidDate(date)) {
                        setMonth(date)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setOpen(true)
                      }
                    }}
                  />
                  <Popover open={openFin} onOpenChange={setOpenFin}>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-picker"
                        variant="ghost"
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                      >
                        <CalendarIcon className="size-3.5" />
                        <span className="sr-only">Select date</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="end"
                      alignOffset={-8}
                      sideOffset={10}
                    >
                      <Calendar
                        mode="single"
                        selected={fin}
                        captionLayout="dropdown"
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={(date) => {
                          setFin(date)
                          setOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => diariaQuery.refetch()}
                disabled={diariaQuery.isFetching}
              >
                Actualizar
              </Button>
            </div>

            {diariaQuery.isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : diariaQuery.isError ? (
              <p className="text-sm text-red-500">
                Error al cargar el reporte diario.
              </p>
            ) : !diariaQuery.data?.grafica.length ? (
              <p className="text-sm text-muted-foreground">
                No hay ventas en el rango seleccionado.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total ventas</p>
                    <p className="text-xl font-semibold">
                      {diariaQuery.data.resumen.totalVentas}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monto total</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(diariaQuery.data.resumen.montoTotal)}
                    </p>
                  </div>
                </div>

                <div className="h-48 w-1/2 p-2">                
                  <ChartContainer config={config}>
                    <BarChart data={diariaQuery.data.grafica}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="label"
                        tick={{
                          fontSize: 12,
                        }}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value}
                      />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value, name) => {
                        if (name === "total") {
                          return ["Total vendido ", value];
                        }
                        if (name === "cantidadVentas") {
                          return [value, "Número de ventas"];
                        }
                        return [name, formatCurrency(Number(value))];
                      }} />} />
                      <Bar
                        dataKey="total"
                        name="Total vendido: "
                        radius={8}
                        fill="var(--chart-1)"
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </>
            )}
          </TabsContent>

          {/* ----------------- TAB MENSUAL ----------------- */}
          <TabsContent value="mensual" className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="w-full max-w-xs space-y-1">
                <label className="text-sm font-medium">Año</label>
                <Select
                  value={String(year)}
                  onValueChange={(value) => setYear(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un año" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearsOptions.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                onClick={() => mensualQuery.refetch()}
                disabled={mensualQuery.isFetching}
              >
                Actualizar
              </Button>
            </div>

            {mensualQuery.isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : mensualQuery.isError ? (
              <p className="text-sm text-red-500">
                Error al cargar el reporte mensual.
              </p>
            ) : !mensualQuery.data?.grafica.length ? (
              <p className="text-sm text-muted-foreground">
                No hay ventas registradas para este año.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total ventas</p>
                    <p className="text-xl font-semibold">
                      {mensualQuery.data.resumen.totalVentas}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monto total</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(mensualQuery.data.resumen.montoTotal)}
                    </p>
                  </div>
                </div>

                <div className="h-72 w-1/2 p-2">           
                  <ChartContainer config={config}>
                    <BarChart data={mensualQuery.data.grafica}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="label"
                        tick={{
                          fontSize: 12,
                        }}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value}
                      />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value, name) => {
                        if (name === "total") {
                          return ["Total vendido ", value];
                        }
                        if (name === "cantidadVentas") {
                          return [value, "Número de ventas"];
                        }
                        return [name, formatCurrency(Number(value))];
                      }} />} />
                      <Bar
                        dataKey="total"
                        name="Total vendido: "
                        radius={8}
                        fill="var(--chart-1)"
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
