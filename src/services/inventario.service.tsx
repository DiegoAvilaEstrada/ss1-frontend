import { api } from "./api.service";

export const getAllInventario = (params?: any) => {
  // El endpoint /inventario/all no tiene prefijo /api/
  return api.getWithoutPrefix("inventario/all", params, true);
};

export const getItemById = (id: number) => {
  return api.get(`inventario/${id}`);
};

export const createItem = (data: any) => {
  // El endpoint /inventario/create no tiene prefijo /api/
  return api.postWithoutPrefix("inventario/create", data, true);
};

export const updateItem = (id: number, data: any) => {
  return api.patchFile(`inventario/${id}`, data);
};

export const deleteItem = (id: number) => {
  return api.delete(`inventario/${id}`);
};

export const getItemsMinimos = () => {
  return api.get("inventario/minimos");
};

export const registrarEntrada = (data: any) => {
  return api.post("inventario/entrada", data);
};

export const registrarSalida = (data: any) => {
  return api.post("inventario/salida", data);
};

export const getHistorialMovimientos = (itemId: number) => {
  return api.get(`inventario/${itemId}/movimientos`);
};

