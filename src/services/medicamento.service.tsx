import { api } from "./api.service";

export const getAllMedicamentos = (params: any) => {
  return api.get("medicamento", params);
};

export const getMedicamentoById = (id: number) => {
  return api.get(`medicamento/${id}`);
};

export const prescribirMedicamento = (data: any) => {
  return api.post("medicamento/prescribir", data);
};

export const getMedicamentosPaciente = (pacienteId: number) => {
  return api.get(`medicamento/paciente/${pacienteId}`);
};

export const registrarEntrega = (prescripcionId: number, data: any) => {
  return api.post(`medicamento/prescripcion/${prescripcionId}/entrega`, data);
};

export const getHistorialEntregas = (prescripcionId: number) => {
  return api.get(`medicamento/prescripcion/${prescripcionId}/entregas`);
};

export const verificarInteracciones = (medicamentos: number[]) => {
  return api.post("medicamento/verificar-interacciones", { medicamentos });
};

