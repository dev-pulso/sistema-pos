import { useMutation, useQuery } from "@tanstack/react-query";
import { CategoriaDto, CategoriaResponse } from "../types/categoria";
import { createCategoria, getCategorias } from "../services/categorias.service";

export const useCategorias = () => {

  const { data, isLoading, error } = useQuery<CategoriaResponse[], Error>({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });


  const mutation = useMutation<CategoriaResponse[], Error, CategoriaDto>({
    mutationFn: createCategoria,
  });


 return {
    categorias: data || [],
    isLoading,
    error,
    mutation,
 }
};