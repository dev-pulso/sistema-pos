import { useQuery } from "@tanstack/react-query"
import { obtenerReporteVentas, obtenerReporteVentasDiarias, obtenerReporteVentasMensual, obtenerReporteVentasXdia } from "../services/ventas.service"
import { Reportes } from "../type/ventas"

export const useReporteVentas = (fechaInicial: Date, fechaFinal: Date) => {
    return useQuery({
        queryKey: ['reporteVentas', fechaInicial, fechaFinal],
        queryFn: () => obtenerReporteVentas(fechaInicial, fechaFinal),
        enabled: !!fechaInicial && !!fechaFinal,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 5,
        retry: 1,
        retryDelay: 1000
    })
}

export const useResportesXdia = () => {
    return useQuery({
        queryKey: ['reporteVentasXDia'],
        queryFn: obtenerReporteVentasXdia,
        refetchOnWindowFocus: true,
        staleTime: 0,
        retry: 1,
        retryDelay: 1000
    })
}

export const useResportesMensual = (year: string) => {
    return useQuery<Reportes, Error>({
        queryKey: ['reporteVentasMensual'],
        queryFn: () => obtenerReporteVentasMensual(year),
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 5,
        retry: 1,
        retryDelay: 1000
    })
}
export const useResportesDiarias = (fechaInicial: Date, fechaFinal: Date) => {
    return useQuery<Reportes, Error>({
        queryKey: ['reporteVentasDiarias'],
        queryFn: () => obtenerReporteVentasDiarias(fechaInicial, fechaFinal),
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 5,
        retry: 1,
        retryDelay: 1000
    })
}