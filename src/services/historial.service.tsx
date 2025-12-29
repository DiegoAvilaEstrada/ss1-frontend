import { api } from "./api.service";

export const getHistoriales = (params: any) => {
  return api.get("historial", params);
};

export const getHistorialById = (id: number) => {
  return api.get(`historial/${id}`);
};

export const createHistorial = (data: any) => {
  return api.post("historial", data);
};

export const updateHistorial = (id: number, data: any) => {
  return api.patch(`historial/${id}`, data);
};

export const agregarSesion = (historialId: number, data: any) => {
  return api.post(`historial/${historialId}/sesion`, data);
};

export const agregarDiagnostico = (historialId: number, data: any) => {
  return api.post(`historial/${historialId}/diagnostico`, data);
};

export const agregarNota = (historialId: number, data: any) => {
  return api.post(`historial/${historialId}/nota`, data);
};

export const getPlanTerapeutico = (historialId: number) => {
  return api.get(`historial/${historialId}/plan-terapeutico`);
};

export const updatePlanTerapeutico = (historialId: number, data: any) => {
  return api.patch(`historial/${historialId}/plan-terapeutico`, data);
};

export const getMiHistorial = () => {
  return api.get("historial/mi-historial");
};

