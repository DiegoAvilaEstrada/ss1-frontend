import { api } from "./api.service";

export const getAllDetalleFactura = (params?: any) => {
  // El endpoint /detalle_factura/all no tiene prefijo /api/
  return api.getWithoutPrefix("detalle_factura/all", params, true);
};

export const getDetalleFacturaById = (id: number) => {
  // El endpoint /detalle_factura/{id} no tiene prefijo /api/
  return api.getWithoutPrefix(`detalle_factura/${id}`, undefined, true);
};

export const getDetalleFacturaByFacturaId = (facturaId: number) => {
  // Obtener todos los detalles de una factura específica
  // Filtrar desde /all ya que no hay endpoint específico para factura
  return getAllDetalleFactura().then((res: any) => {
    const detalles = res?.responseObject || res || [];
    return detalles.filter((d: any) => d.idFactura === facturaId || d.factura?.id === facturaId);
  });
};

export const createDetalleFactura = (data: any) => {
  // El endpoint /detalle_factura/create no tiene prefijo /api/
  return api.postWithoutPrefix("detalle_factura/create", data, true);
};

export const updateDetalleFactura = (id: number, data: any) => {
  return api.patch(`detalle_factura/${id}`, data);
};

export const deleteDetalleFactura = (id: number) => {
  return api.delete(`detalle_factura/${id}`);
};

