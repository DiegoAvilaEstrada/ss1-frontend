import { api } from "./api.service";

export const getAllEmpleados = (params?: any) => {
  // El endpoint /empleado/all no tiene prefijo /api/
  return api.getWithoutPrefix("empleado/all", params, true);
};

export const getEmpleadoById = (id: number) => {
  return api.get(`empleado/${id}`);
};

export const getEmpleadoByDpi = (dpi: string) => {
  // El endpoint /empleado/{dpi} no tiene prefijo /api/
  return api.getWithoutPrefix(`empleado/${dpi}`, undefined, true);
};

export const createEmpleado = (data: any) => {
  // El endpoint /empleado/create no tiene prefijo /api/
  return api.postWithoutPrefix("empleado/create", data, true);
};

export const updateEmpleado = (data: any) => {
  // El endpoint /empleado/update no tiene prefijo /api/ y es POST
  return api.postWithoutPrefix("empleado/update", data, true);
};

export const deleteEmpleado = (dpi: string) => {
  // El endpoint /empleado/delete/{dpi} no tiene prefijo /api/ y es POST
  return api.postWithoutPrefix(`empleado/delete/${dpi}`, {}, true);
};

export const getEspecialidadesEmpleado = (id: number) => {
  return api.get(`empleado/${id}/especialidades`);
};

export const asignarEspecialidad = (empleadoId: number, especialidadId: number) => {
  return api.post(`empleado/${empleadoId}/especialidad/${especialidadId}`, {});
};

export const getAreaEmpleadoById = (id: number) => {
  // El endpoint /area-empleado/{id} no tiene prefijo /api/
  return api.getWithoutPrefix(`area-empleado/${id}`, undefined, true);
};

