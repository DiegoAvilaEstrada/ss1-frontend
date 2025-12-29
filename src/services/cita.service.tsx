import { api } from "./api.service";

export const getAllCitas = (params?: any) => {
  // El endpoint /cita/all no tiene prefijo /api/
  return api.getWithoutPrefix("cita/all", params, true);
};

export const getCitaById = (id: number) => {
  // El endpoint /cita/{id} no tiene prefijo /api/
  return api.getWithoutPrefix(`cita/${id}`, undefined, true);
};

export const createCita = (data: any) => {
  // El endpoint /cita/create no tiene prefijo /api/
  return api.postWithoutPrefix("cita/create", data, true);
};

export const updateCita = (id: number, data: any) => {
  // El endpoint /cita/update no tiene prefijo /api/ y es POST
  return api.postWithoutPrefix("cita/update", { ...data, id }, true);
};

export const cancelarCita = (id: number) => {
  // El endpoint /cita/cancelar/{id} o /cita/{id}/cancelar no tiene prefijo /api/
  return api.postWithoutPrefix(`cita/cancelar/${id}`, {}, true);
};

export const reprogramarCita = (id: number, data: any) => {
  // El endpoint /cita/reprogramar/{id} o /cita/{id}/reprogramar no tiene prefijo /api/
  return api.postWithoutPrefix(`cita/reprogramar/${id}`, data, true);
};

export const getCitasPorPaciente = (dpiPaciente: string) => {
  // El endpoint /cita/paciente/{dpi} no tiene prefijo /api/
  return api.getWithoutPrefix(`cita/paciente/${dpiPaciente}`, undefined, true);
};

export const getCitasPorProfesional = (dpiProfesional: string, params?: any) => {
  // El endpoint /cita/profesional/{dpi} no tiene prefijo /api/
  return api.getWithoutPrefix(`cita/profesional/${dpiProfesional}`, params, true);
};

export const getMisCitas = () => {
  // El endpoint /cita/mis-citas no tiene prefijo /api/
  return api.getWithoutPrefix("cita/mis-citas", undefined, true);
};

