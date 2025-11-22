import { CategoriaResponse } from "@/modules/categorias/types/categoria";

export type UnidadMedida = 'unidad' | 'kg';

export interface ProductoDto {
    id?: string;
    nombre: string;
    barcode: string;
    unidadMedida: UnidadMedida;
    descripcion?: string;
    precio: number;
    costo: number;
    stock?: number;
    isActive?: boolean;
    categoriaId: string;
}
export interface ProductoResponse {
    id: string;
    barcode: string;
    nombre: string;
    descripcion: string;
    sku: string;
    unidadMedida: UnidadMedida;
    precio: number;
    costo: number;
    stock: number;
    isActive: boolean;
    categoria: CategoriaResponse;
    createdAt: Date;
    updatedAt: Date;
}