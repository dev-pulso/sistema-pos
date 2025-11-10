import { ENDPOINTS } from "@/lib/endpoint/endpoints";
import { CategoriaDto, CategoriaResponse } from "../types/categoria";
import api from "@/api/axiosInstance";

export const getCategorias = async () => {
  const response = await api.get(`${ENDPOINTS.build(ENDPOINTS.CATEGORIA.LISTAR)}`);
  return response.data;
};


export const createCategoria = async (data: CategoriaDto): Promise<CategoriaResponse> => {
   const res = await api.post(`${ENDPOINTS.build(ENDPOINTS.CATEGORIA.CREAR)}`, data);
  if(!res.data) {
    throw new Error(res.data.message || "Error al crear categoria");
  }

  return res.data;

};