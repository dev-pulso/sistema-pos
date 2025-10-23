import { useMutation, useQuery } from "@tanstack/react-query";
import { ProductoDto, ProductoResponse } from "../types/productos";
import { createProducto, getProductos } from "../services/productos.service";

export default function useProductos() {

    const { data, isLoading, error } = useQuery<ProductoResponse[], Error>({
        queryKey: ["productos"],
        queryFn: getProductos,
    });

    const mutationProducto = useMutation<ProductoResponse[], Error, ProductoDto>({
        mutationFn: createProducto,
    });

    return {
        productos: data,
        isLoading,
        error,
        mutationProducto,
    }
}