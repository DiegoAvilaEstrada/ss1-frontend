import { api } from "./api.service";

export const getAllTratamientos = (params?: any) => {
  // El endpoint /tratamiento/all no tiene prefijo /api/
  return api.getWithoutPrefix("tratamiento/all", params, true);
};

export const getTratamientoById = (id: number) => {
  // El endpoint /tratamiento/{id} no tiene prefijo /api/
  return api.getWithoutPrefix(`tratamiento/${id}`, undefined, true);
};

export const createTratamiento = (data: any) => {
  return api.postWithoutPrefix("tratamiento/create", data, true);
};

export const updateTratamiento = (id: number, data: any) => {
  // El endpoint /tratamiento/update no tiene prefijo /api/ y es POST
  return api.postWithoutPrefix("tratamiento/update", { ...data, id }, true);
};

export const deleteTratamiento = (id: number) => {
  return api.delete(`tratamiento/${id}`);
};

