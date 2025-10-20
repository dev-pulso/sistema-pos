export type UnidadMedida = 'unidad' | 'g' | 'kg' | 'ml' | 'lt';

export interface ProductoDto {
    nombre: string;
    barcode: string;
    unidadMedida: UnidadMedida;
    cantidad: number;
    descripcion?: string;
    precio: number;
    costo: number;
    stock?: number;
    isActive?: boolean;
    categoriaId: string;
}
export interface ProductoResponseDto {
    id: string;
    barcode: string;
    nombre: string;
    descripcion: string;
    sku: string;
    unidadMedida: UnidadMedida;
    cantidad: number;
    precio: number;
    costo: number;
    stock: number;
    isActive: boolean;
    categoria: string;
    createdAt: Date;
    updatedAt: Date;
}