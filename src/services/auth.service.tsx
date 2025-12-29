import { api } from "./api.service";
import axios from "axios";

const localHost = import.meta.env.LOCAL_HOST || "http://localhost:8080";

interface LoginRequest {
  username: string;
  password: string;
}

interface VerifyCodeRequest {
  code: string;
}

// Login para paciente
export const loginPaciente = (data: LoginRequest) => {
  return axios
    .post(`${localHost}/login/paciente`, data, {
      headers: { "Content-Type": "application/json", "X-Skip-Auth": "true" },
    })
    .then((res) => res.data);
};

// Login para empleado
export const loginEmpleado = (data: LoginRequest) => {
  return axios
    .post(`${localHost}/login/empleado`, data, {
      headers: { "Content-Type": "application/json", "X-Skip-Auth": "true" },
    })
    .then((res) => res.data);
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
  // Por defecto usa login de empleado, ahora usando LOCAL_HOST
  return axios
    .post(`${localHost}/login/empleado`, data, {
      headers: { "Content-Type": "application/json", "X-Skip-Auth": "true" },
    })
    .then((res) => res.data);
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
