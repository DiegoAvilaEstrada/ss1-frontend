import { api } from "./api.service";

export const getAllProductos = (params?: any) => {
  // El endpoint /producto/all no tiene prefijo /api/
  return api.getWithoutPrefix("producto/all", params, true);
};

export const getProductoById = (id: number) => {
  // El endpoint /producto/{id} no tiene prefijo /api/
  return api.getWithoutPrefix(`producto/${id}`, undefined, true);
};

export const createProducto = (data: any) => {
  return api.postWithoutPrefix("producto/create", data, true);
};

export const updateProducto = (id: number, data: any) => {
  return api.patch(`producto/${id}`, data);
};

export const deleteProducto = (id: number) => {
  return api.delete(`producto/${id}`);
};

