import { useQuery } from "@tanstack/react-query"
import { obtenerReporteVentas, obtenerReporteVentasXdia } from "../services/ventas.service"

export const useReporteVentas = (fechaInicial: Date, fechaFinal: Date) => {
    return useQuery({
        queryKey: ['reporteVentas', fechaInicial, fechaFinal],
        queryFn: () => obtenerReporteVentas(fechaInicial, fechaFinal),
        enabled: !!fechaInicial && !!fechaFinal,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
        retry: 1,
        retryDelay: 1000
    })
}

export const useResportesXdia = () => {
    return useQuery({
        queryKey: ['reporteVentasXDia'],
        queryFn: obtenerReporteVentasXdia,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
        retry: 1,
        retryDelay: 1000
    })
}