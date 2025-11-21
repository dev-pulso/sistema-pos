import { ENDPOINTS } from "@/lib/endpoint/endpoints";
import { ProductoDto, ProductoResponse } from "../types/productos";
import api from "@/api/axiosInstance";

export const getProductos = async (): Promise<ProductoResponse[]> => {
    const response = await api.get(`${ENDPOINTS.build(ENDPOINTS.PRODUCTO.LISTAR)}`);
    return response.data;
};

export const createProducto = async (data: ProductoDto): Promise<ProductoResponse> => {
    try {
        const payload: ProductoDto = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            precio: Number(data.precio),
            stock: Number(data.stock),
            categoriaId: data.categoriaId,
            barcode: data.barcode,
            unidadMedida: data.unidadMedida,
            costo: Number(data.costo),
        }

        const res = await api.post(`${ENDPOINTS.build(ENDPOINTS.PRODUCTO.CREAR)}`, payload);

        return res.data;
    } catch (error: any) {
        throw error;
    }
}

export const updateProducto = async (data: ProductoDto): Promise<ProductoResponse> => {

    try {
        const payload: ProductoDto = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            precio: Number(data.precio),
            stock: Number(data.stock),
            categoriaId: data.categoriaId,
            barcode: data.barcode,
            unidadMedida: data.unidadMedida,
            costo: Number(data.costo),
        }

        const res = await api.post(`${ENDPOINTS.build(ENDPOINTS.PRODUCTO.ACTUALIZAR, { id: data.id })}`, payload);

        return res.data;
    } catch (error: any) {
        throw error;
    }
}




