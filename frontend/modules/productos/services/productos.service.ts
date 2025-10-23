import { ENDPOINTS } from "@/lib/endpoint/endpoints";
import { ProductoDto, ProductoResponse } from "../types/productos";

export const getProductos = async (): Promise<ProductoResponse[]> => {
    const response = await fetch(`${ENDPOINTS.build(ENDPOINTS.PRODUCTO.LISTAR)}`);
    const data = await response.json();
    return data;
};

export const createProducto = async (data: ProductoDto): Promise<ProductoResponse[]> => {
    const res = await fetch(`${ENDPOINTS.build(ENDPOINTS.PRODUCTO.CREAR)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al crear producto");
    }
    return await res.json();
};



