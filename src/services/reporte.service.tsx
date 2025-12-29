import { api } from "./api.service";

export const getReporteFinanciero = (params: any) => {
  return api.get("reporte/financiero", params);
};

export const getReporteInventario = (params: any) => {
  return api.get("reporte/inventario", params);
};

export const getReporteClinico = (params: any) => {
  return api.get("reporte/clinico", params);
};

export const getReporteRecursosHumanos = (params: any) => {
  return api.get("reporte/recursos-humanos", params);
};

export const getIngresosPorPeriodo = (fechaInicio: string, fechaFin: string) => {
  return api.get("reporte/ingresos", { fechaInicio, fechaFin });
};

export const getGanancias = (fechaInicio: string, fechaFin: string) => {
  return api.get("reporte/ganancias", { fechaInicio, fechaFin });
};

export const getCostosNomina = (periodo: string) => {
  return api.get("reporte/costos-nomina", { periodo });
};

export const getMedicamentosMinimos = () => {
  return api.get("reporte/inventario/minimos");
};

export const getEstadisticasAtencion = (params: any) => {
  return api.get("reporte/estadisticas-atencion", params);
};

export const getNumeroSesiones = (params: any) => {
  return api.get("reporte/numero-sesiones", params);
};

export const getPagosRealizados = (params: any) => {
  return api.get("reporte/pagos-realizados", params);
};

export const getBonosYRetenciones = (params: any) => {
  return api.get("reporte/bonos-retenciones", params);
};

