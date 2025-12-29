import { api } from "./api.service";

export const getAllRoles = async () => {
  // El endpoint /rol/all no tiene prefijo /api/
  return api.getWithoutPrefix("rol/all", undefined, true);
};
