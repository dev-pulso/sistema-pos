import { Productos } from "@/config/app.interface";
import { create } from "zustand";

interface ProductoStore {
    productos: Productos[];
    addProducto: (producto: Productos) => void;      // crea o actualiza
    updateProducto: (producto: Productos) => void;   // solo actualiza
    removeProducto: (productoId: string) => void;
    setProductos: (productos: Productos[]) => void;
}

export const useProductoStore = create<ProductoStore>()((set) => ({
    productos: [],

    // 🔹 upsert: si ya existe por id, lo reemplaza
    addProducto: (producto) =>
        set((state) => {
            const index = state.productos.findIndex((p) => p.id === producto.id);
            if (index === -1) {
                // no existe, lo agregamos
                return { productos: [...state.productos, producto] };
            }
            // existe, lo reemplazamos
            const updated = [...state.productos];
            updated[index] = producto;
            return { productos: updated };
        }),

    // 🔹 solo actualizar (más explícito si quieres usarlo desde el diálogo de edición)
    updateProducto: (producto) =>
        set((state) => {
            const index = state.productos.findIndex((p) => p.id === producto.id);
            if (index === -1) {
                // si quieres que en este caso también lo agregue, puedes devolver addProducto-like
                return state;
            }
            const updated = [...state.productos];
            updated[index] = producto;
            return { productos: updated };
        }),

    removeProducto: (productoId) =>
        set((state) => ({
            productos: state.productos.filter((producto) => producto.id !== productoId),
        })),

    setProductos: (productos) =>
        set(() => ({
            productos,
        })),
}));
