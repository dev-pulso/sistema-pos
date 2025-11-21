export enum Rols {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  CASHIER = "cashier",
}

export type UnidadMedida = 'unidad' | 'kg';

export interface CategoriasResponse {
  id: string;
  nombre: string;
  descripcion?: string;
  productos: Productos[];
}

export interface Productos {
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
  categoria: CategoriasResponse;
  createdAt: Date;
  updatedAt: Date;
}