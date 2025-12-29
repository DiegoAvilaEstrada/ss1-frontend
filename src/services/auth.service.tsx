import { api } from "./api.service";

interface LoginRequest {
  username: string;
  password: string;
}

interface VerifyCodeRequest {
  code: string;
}

// Login para paciente
export const loginPaciente = (data: LoginRequest) => {
  return api.postWithoutPrefix("/login/paciente", data, false);
};

// Login para empleado
export const loginEmpleado = (data: LoginRequest) => {
  return api.postWithoutPrefix("/login/empleado", data, false);
};

// Verificar código para paciente
export const verifyCodePaciente = (data: VerifyCodeRequest) => {
  return api.postWithoutPrefix("/login/code/paciente", data, false);
};

// Verificar código para empleado
export const verifyCodeEmpleado = (data: VerifyCodeRequest) => {
  return api.postWithoutPrefix("/login/code/empleado", data, false);
};

// Función de compatibilidad (por si se usa en otros lugares)
export const loginUser = (data: LoginRequest) => {
  // Por defecto usa login de empleado
  return api.postWithoutPrefix("/login/empleado", data, false);
};

export const resetPasswordInit = (data: any) => {
  return api.patch("auth/reset-password-init", data, false);
};

export const verifyCodeTfa = (data: any) => {
  return api.post("auth/verify-tfa", data, false);
};

export const requestResetPassword = (data: any) => {
  return api.post("auth/request-reset-password", data);
};

export const validateCodeReset = (data: any) => {
  return api.post("auth/validate-code-reset", data);
};

export const resetPassword = (data: any) => {
  return api.patch("auth/reset-password", data);
};
