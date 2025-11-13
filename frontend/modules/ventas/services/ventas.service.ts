import { ENDPOINTS } from "@/lib/endpoint/endpoints";
import { ReportesventasResponse, VentasDto, VentasResponse } from "../type/ventas";
import api from "@/api/axiosInstance";

export const abrirCajon = async (): Promise<void> => {
    const res = await api.post(`${ENDPOINTS.build(ENDPOINTS.CAJON.ABRIR)}`);

    return res.data;
};


export const crearVentas = async (body: VentasDto): Promise<VentasResponse> => {

    const res = await api.post(`${ENDPOINTS.build(ENDPOINTS.VENTAS.CREAR_VENTAS)}`, body);

    return res.data;
}

export const obtenerReporteVentas = async (fechaInicial: Date, fechaFinal: Date): Promise<any> => {

    console.log(fechaInicial, fechaFinal);

    const res = await api.get(`${ENDPOINTS.build(ENDPOINTS.VENTAS.REPORTE_VENTAS)}`, {
        params: {
            fechaInicial: fechaInicial.toISOString().split('T')[0],
            fechaFinal: fechaFinal.toISOString().split('T')[0],
        }
    });
    console.log(res.data);

    return res.data;
}
export const obtenerReporteVentasXdia = async (): Promise<ReportesventasResponse> => {

    const res = await api.get(`${ENDPOINTS.build(ENDPOINTS.VENTAS.REPORTE_VENTAS_DIA)}`);

    return res.data;
}




