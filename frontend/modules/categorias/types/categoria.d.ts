import { ProductoResponse } from "@/modules/productos/types/productos";

export interface CategoriaDto {
  nombre: string;
}
export interface CategoriaResponse {
  id: number;
  nombre: string;
  productos: ProductoResponse[];
}
