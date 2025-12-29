import { api } from "./api.service";

export const getAllPacientes = (params?: any) => {
  // El endpoint /paciente/all no tiene prefijo /api/
  return api.getWithoutPrefix("paciente/all", params, true);
};

export const getPacienteById = (id: number) => {
  return api.get(`paciente/${id}`);
};

export const getPacienteByDpi = (dpi: string) => {
  // El endpoint /paciente/{dpi} no tiene prefijo /api/
  return api.getWithoutPrefix(`paciente/${dpi}`, undefined, true);
};

export const createPaciente = (data: any) => {
  // El endpoint /paciente/create no tiene prefijo /api/
  return api.postWithoutPrefix("paciente/create", data, true);
};

export const updatePaciente = (data: any) => {
  // El endpoint /paciente/update no tiene prefijo /api/ y es POST
  return api.postWithoutPrefix("paciente/update", data, true);
};

export const deletePaciente = (dpi: string) => {
  // El endpoint /paciente/delete/{dpi} no tiene prefijo /api/ y es POST
  return api.postWithoutPrefix(`paciente/delete/${dpi}`, {}, true);
};

export const getHistorialPaciente = (id: number) => {
  return api.get(`paciente/${id}/historial`);
};

