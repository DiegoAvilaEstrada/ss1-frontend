import { api } from "./api.service";

export const getAllPagosSesion = (params?: any) => {
  // El endpoint /pago_sesion/all no tiene prefijo /api/
  return api.getWithoutPrefix("pago_sesion/all", params, true);
};

export const getPagoSesionById = (id: number) => {
  // El endpoint /pago_sesion/{id} no tiene prefijo /api/
  return api.getWithoutPrefix(`pago_sesion/${id}`, undefined, true);
};

export const getPagosSesionByFacturaId = (facturaId: number) => {
  // Obtener todos los pagos de una factura específica
  // Filtrar desde /all ya que no hay endpoint específico para factura
  return getAllPagosSesion().then((res: any) => {
    const pagos = res?.responseObject || res || [];
    return pagos.filter((p: any) => p.idFactura === facturaId || p.factura?.id === facturaId);
  });
};

export const createPagoSesion = (data: any) => {
  // El endpoint /pago_sesion/create no tiene prefijo /api/
  return api.postWithoutPrefix("pago_sesion/create", data, true);
};

export const updatePagoSesion = (id: number, data: any) => {
  return api.patch(`pago_sesion/${id}`, data);
};

export const deletePagoSesion = (id: number) => {
  return api.delete(`pago_sesion/${id}`);
};

