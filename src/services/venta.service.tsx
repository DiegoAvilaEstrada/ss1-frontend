import { api } from "./api.service";

export const getAllVentas = (params: any) => {
  return api.get("venta", params);
};

export const getVentaById = (id: number) => {
  return api.get(`venta/${id}`);
};

export const createVenta = (data: any) => {
  return api.post("venta", data);
};

export const anularVenta = (id: number) => {
  return api.patch(`venta/${id}/anular`, {});
};

export const getHistorialVentas = (params: any) => {
  return api.get("venta/historial", params);
};

export const generarFacturaVenta = (ventaId: number) => {
  return api.post(`venta/${ventaId}/factura`, {});
};

