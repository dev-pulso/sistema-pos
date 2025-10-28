export enum Rols {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  CASHIER = "cashier",
}

export type UnidadMedida = 'unidad' | 'g' | 'kg' | 'ml' | 'lt';

export interface Categorias{
    id: string;
    nombre: string;
    descripcion?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Productos{
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
    categoria: Categorias;
    createdAt: Date;
    updatedAt: Date;
}