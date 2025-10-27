import { ENDPOINTS } from "@/lib/endpoint/endpoints";
import { CategoriaDto, CategoriaResponse } from "../types/categoria";

export const getCategorias = async () => {
  const response = await fetch(`${ENDPOINTS.build(ENDPOINTS.CATEGORIA.LISTAR)}`);
  const data = await response.json();
  return data;
};


export const createCategoria = async (data: CategoriaDto): Promise<CategoriaResponse> => {
   const res = await fetch(`${ENDPOINTS.build(ENDPOINTS.CATEGORIA.CREAR)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if(!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al crear categoria");
  }

  return res.json();

};