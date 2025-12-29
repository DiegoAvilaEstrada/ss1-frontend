import { api } from "./api.service";

export const getAllSesiones = (params?: any) => {
  // El endpoint /sesion_psicologica/all no tiene prefijo /api/
  return api.getWithoutPrefix("sesion_psicologica/all", params, true);
};

export const getSesionById = (id: number) => {
  // El endpoint /sesion_psicologica/{id} no tiene prefijo /api/
  return api.getWithoutPrefix(`sesion_psicologica/${id}`, undefined, true);
};

export const createSesion = (data: any) => {
  // El endpoint /sesion_psicologica/create no tiene prefijo /api/
  return api.postWithoutPrefix("sesion_psicologica/create", data, true);
};

export const updateSesion = (id: number, data: any) => {
  return api.patch(`sesion_psicologica/${id}`, data);
};

export const deleteSesion = (id: number) => {
  return api.delete(`sesion_psicologica/${id}`);
};

