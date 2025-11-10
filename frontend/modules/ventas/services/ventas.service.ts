import { ENDPOINTS } from "@/lib/endpoint/endpoints";
import { VentasDto, VentasResponse } from "../type/ventas";

export const abrirCajon = async (): Promise<void> => {
    const res = await fetch(`${ENDPOINTS.build(ENDPOINTS.CAJON.ABRIR)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al abrir el cajón");
    }
    return;
};


export const crearVentas = async (body: VentasDto): Promise<VentasResponse> => {

    const res = await fetch(`${ENDPOINTS.build(ENDPOINTS.VENTAS.CREAR_VENTAS)}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al registar la venta");
    }
    return res.json();

}





