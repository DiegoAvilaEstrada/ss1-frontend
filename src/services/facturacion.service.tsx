import { api } from "./api.service";

export const getAllFacturas = (params?: any) => {
  // El endpoint /factura/all no tiene prefijo /api/
  return api.getWithoutPrefix("factura/all", params, true);
};

export const getFacturasByDpi = (dpi: string) => {
  // El endpoint /factura/{dpi} no tiene prefijo /api/
  return api.getWithoutPrefix(`factura/${dpi}`, undefined, true);
};

export const getFacturaById = (id: number) => {
  // El endpoint /factura/{id} no tiene prefijo /api/
  return api.getWithoutPrefix(`factura/${id}`, undefined, true);
};

export const createFactura = (data: any) => {
  // El endpoint /factura/create no tiene prefijo /api/
  return api.postWithoutPrefix("factura/create", data, true);
};

export const updateFactura = (id: number, data: any) => {
  return api.patch(`factura/${id}`, data);
};

export const anularFactura = (id: number) => {
  return api.patch(`factura/${id}/anular`, {});
};

export const registrarPago = (data: any) => {
  
  return api.postWithoutPrefix("detalle_factura/create", data, true);
};

export const getCuentasPorCobrar = (params: any) => {
  return api.get("factura/cuentas-por-cobrar", params);
};

export const getHistorialCliente = (clienteId: number) => {
  return api.get(`factura/cliente/${clienteId}/historial`);
};

export const generarPDF = async (facturaId: number) => {
  // El endpoint /factura/{id}/pdf no tiene prefijo /api/
  const filename = `factura_${facturaId}.pdf`;
  return api.downloadFile(`factura/${facturaId}/pdf`, filename, false, true);
};

export const conciliarPagos = (data: any) => {
  return api.post("factura/conciliar", data);
};

