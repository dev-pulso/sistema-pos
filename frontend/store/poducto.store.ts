import { Productos } from "@/config/app.interface";
import { create } from "zustand";

interface ProductoStore {
    productos: Productos[];
    addProducto: (producto: Productos) => void;
    removeProducto: (productoId: string) => void;
    setProductos: (productos: Productos[]) => void;
}


export const useProductoStore = create<ProductoStore>()((set) => ({
    productos: [],

    addProducto: (producto) => 
        set((state) => ({
            productos: [...state.productos, producto],
        })),

    removeProducto: (productoId) => 
        set((state) => ({
            productos: state.productos.filter(
                (producto) => producto.id !== productoId
            ),
        })),

    setProductos: (productos) => 
        set(() => ({
            productos,
        })),
}));
