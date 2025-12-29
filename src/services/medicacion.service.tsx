import { api } from "./api.service";

export const getAllMedicaciones = (params?: any) => {
  // El endpoint /medicacion/all no tiene prefijo /api/
  return api.getWithoutPrefix("medicacion/all", params, true);
};

export const getMedicacionById = (id: number) => {
  // El endpoint /medicacion/{id} no tiene prefijo /api/
  return api.getWithoutPrefix(`medicacion/${id}`, undefined, true);
};

export const createMedicacion = (data: any) => {
  // El endpoint /medicacion/create no tiene prefijo /api/
  return api.postWithoutPrefix("medicacion/create", data, true);
};

export const updateMedicacion = (id: number, data: any) => {
  // El endpoint /medicacion/update no tiene prefijo /api/ y es POST
  return api.postWithoutPrefix("medicacion/update", { ...data, id }, true);
};

export const deleteMedicacion = (id: number) => {
  return api.delete(`medicacion/${id}`);
};
