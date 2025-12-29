import { api } from "./api.service";

export const getAllCuentasPacientes = () => {
  // El endpoint /cuenta-paciente/all no tiene prefijo /api/
  return api.getWithoutPrefix("cuenta-paciente/all", undefined, true);
};

export const getCuentaPacienteByUsername = async (username: string) => {
  try {
    const res = await getAllCuentasPacientes();
    const cuentas = res?.responseObject || res || [];
    const cuenta = Array.isArray(cuentas) 
      ? cuentas.find((c: any) => c.username === username)
      : null;
    return cuenta || null;
  } catch (error) {
    console.error("Error obteniendo cuenta de paciente:", error);
    throw error;
  }
};

export const recoveryPassword = (data: { username: string; newPassword: string; confirmNewPassword: string }) => {
  // El endpoint /cuenta-paciente/recovery/password no tiene prefijo /api/
  return api.postWithoutPrefix("cuenta-paciente/recovery/password", data, false);
};

