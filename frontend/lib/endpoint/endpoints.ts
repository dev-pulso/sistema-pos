export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export enum PRODUCT_ENDPOINT {
  LISTAR = "/productos",
  CREAR = "/productos",
  DETALLE = "/productos/:id",
  ACTUALIZAR = "/productos/:id",
  ELIMINAR = "/productos/:id",
  FILTRAR = "/productos/categoria/:categoria/marca/:marca", // Ejemplo dinámico avanzado
}

export enum USER_ENDPOINT {
  LOGIN = "/auth/login",
  REGISTER = "/auth/register",
  PERFIL = "/auth/profile/:userId",
  POSTS = "/users/:userId/posts/:postId",
}
export enum CAJON_ENDPOINT {
  ABRIR = "/cajon",
}

export enum VENTAS_ENDPOINT{
  CREAR_VENTAS ='/ventas',
  REPORTE_VENTAS = '/ventas'
}


export enum CATEGORY_ENDPOINT {
  LISTAR = "/categorias",
  CREAR = "/categorias",
  DETALLE = "/categorias/:id",
  ACTUALIZAR = "/categorias/:id",
  ELIMINAR = "/categorias/:id",
}



/**
 * Reemplaza los valores dinámicos en la ruta como :id, :slug, :userId, etc.
 * Ejemplo: buildEndpoint("/productos/:id/:slug", { id: 10, slug: "zapato-nike" })
 * Resultado: http://localhost:3000/api/productos/10/zapato-nike
 */
export const buildEndpoint = (path: string, params: Record<string, any> = {}) => {
  let fullPath = path;

  Object.keys(params).forEach((key) => {
    fullPath = fullPath.replace(new RegExp(`:${key}(?![a-zA-Z0-9])`, "g"), params[key]);
  });

  return `${API_BASE}${fullPath}`;
};

export const ENDPOINTS = {
  PRODUCTO: PRODUCT_ENDPOINT,
  USUARIO: USER_ENDPOINT,
  CATEGORIA: CATEGORY_ENDPOINT,
  CAJON: CAJON_ENDPOINT,
  VENTAS:VENTAS_ENDPOINT,
  build: buildEndpoint,
};
