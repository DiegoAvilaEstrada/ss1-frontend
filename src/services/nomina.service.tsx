import { api } from "./api.service";

export const getAllNominas = (params: any) => {
  return api.get("nomina", params);
};

export const getNominaById = (id: number) => {
  return api.get(`nomina/${id}`);
};

export const createNomina = (data: any) => {
  return api.post("nomina", data);
};

export const calcularNomina = (periodo: string) => {
  return api.post("nomina/calcular", { periodo });
};

export const procesarPago = (nominaId: number, data: any) => {
  return api.post(`nomina/${nominaId}/pago`, data);
};

export const getHistorialPagos = (empleadoId: number) => {
  return api.get(`nomina/empleado/${empleadoId}/pagos`);
};

export const generarComprobante = (nominaId: number) => {
  return api.get(`nomina/${nominaId}/comprobante`);
};

