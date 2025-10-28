import { ENDPOINTS } from "@/lib/endpoint/endpoints";
import { ProductoDto, ProductoResponse } from "../types/productos";

export const getProductos = async (): Promise<ProductoResponse[]> => {
    const response = await fetch(`${ENDPOINTS.build(ENDPOINTS.PRODUCTO.LISTAR)}`);
    const data = await response.json();
    return data;
};

export const createProducto = async (data: ProductoDto): Promise<ProductoResponse> => {

    const payload:ProductoDto = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: Number(data.precio),
        stock: Number(data.stock),
        categoriaId: data.categoriaId,
        barcode: data.barcode,
        unidadMedida: data.unidadMedida,
        cantidad: Number(data.cantidad),
        costo: Number(data.costo),
    }

    const res = await fetch(`${ENDPOINTS.build(ENDPOINTS.PRODUCTO.CREAR)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al crear producto");
    }
    return await res.json();
};



