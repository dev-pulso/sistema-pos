import { useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProductoDto, ProductoResponse } from "../types/productos";
import { createProducto, getProductos } from "../services/productos.service";
import { Productos } from "@/config/app.interface";
import { useProductoStore } from "@/store/poducto.store";

export default function useProductos() {
    const { setProductos } = useProductoStore()

    const { data, isLoading, error } = useQuery<ProductoResponse[], Error>({
        queryKey: ["productos"],
        queryFn: getProductos,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
        retry: 2
    });

    const mutationProducto = useMutation<ProductoResponse, Error, ProductoDto>({
        mutationFn: createProducto,
    });

    const productos: Productos[] = useMemo(() => {
        if (!data) return [];
        return data.map((p) => ({
            id: p.id,
            nombre: p.nombre,
            precio: Number(p.precio),
            costo: Number(p.costo),
            stock: p.stock,
            barcode: p.barcode,
            descripcion: p.descripcion,
            sku: p.sku,
            unidadMedida: p.unidadMedida,
            cantidad: p.cantidad,
            isActive: p.isActive,
            categoria: p.categoria,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
    }, [data])
    

    return {
        productos,
        isLoading,
        error,
        mutationProducto,
    }
}