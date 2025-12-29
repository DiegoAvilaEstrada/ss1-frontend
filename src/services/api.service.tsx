import axios from "axios";
import { getToken } from "@utilities/Functions";

export const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  // Solo agregar el token si no se especifica explícitamente que no se debe incluir
  if (!config.headers["X-Skip-Auth"]) {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  // Remover el header de control si existe
  delete config.headers["X-Skip-Auth"];
  return config;
});

export const api = {
  get: async (
    endpoint: string,
    params?: Record<string, string>,
    auth: boolean = true
  ) => {
    const response = await apiClient.get(`/api/${endpoint}`, {
      params,
      headers: auth ? {} : { Authorization: "" },
    });
    return response.data;
  },

  post: async (
    endpoint: string,
    body: Record<string, any>,
    auth: boolean = true
  ) => {
    const response = await apiClient.post(`/api/${endpoint}`, body, {
      headers: auth ? {} : { Authorization: "" },
    });
    return response.data;
  },

  put: async (
    endpoint: string,
    body: Record<string, any>,
    auth: boolean = true
  ) => {
    const response = await apiClient.put(`/api/${endpoint}`, body, {
      headers: auth ? {} : { Authorization: "" },
    });
    return response.data;
  },

  patch: async (
    endpoint: string,
    body: Record<string, any>,
    auth: boolean = true
  ) => {
    const response = await apiClient.patch(`/api/${endpoint}`, body, {
      headers: auth ? {} : { Authorization: "" },
    });
    return response.data;
  },
  patchFile: async (
    endpoint: string,
    body: Record<string, any>,
    auth: boolean = true
  ) => {
    const headers: Record<string, string> = {};

    if (auth) {
      headers["Authorization"] = `Bearer ${getToken()}`;
    }

    headers["Content-Type"] = "multipart/form-data";
    const response = await apiClient.patch(`/api/${endpoint}`, body, {
      headers,
    });
    return response.data;
  },
  delete: async (
    endpoint: string,
    params?: Record<string, string>,
    auth: boolean = true
  ) => {
    const response = await apiClient.delete(`/api/${endpoint}`, {
      headers: auth ? {} : { Authorization: "" },
      data: params,
    });
    return response.data;
  },
  postFile: async (endpoint: string, body: FormData, auth: boolean = true) => {
    const headers: Record<string, string> = {};

    if (auth) {
      headers["Authorization"] = `Bearer ${getToken()}`;
    }
    headers["Content-Type"] = "multipart/form-data";
    const response = await apiClient.post(`/api/${endpoint}`, body, {
      headers,
    });
    return response.data;
  },
  // Métodos para endpoints sin prefijo /api/
  postWithoutPrefix: async (
    endpoint: string,
    body: Record<string, any>,
    auth: boolean = true
  ) => {
    // Si auth es false, indicar al interceptor que no agregue el token
    const headers: any = auth ? {} : { "X-Skip-Auth": "true" };
    const response = await apiClient.post(endpoint, body, {
      headers,
    });
    return response.data;
  },
  getWithoutPrefix: async (
    endpoint: string,
    params?: Record<string, string>,
    auth: boolean = true
  ) => {
    // Si auth es false, indicar al interceptor que no agregue el token
    const headers: any = auth ? {} : { "X-Skip-Auth": "true" };
    const response = await apiClient.get(endpoint, {
      params,
      headers,
    });
    return response.data;
  },
  patchWithoutPrefix: async (
    endpoint: string,
    body: Record<string, any>,
    auth: boolean = true
  ) => {
    // Si auth es false, indicar al interceptor que no agregue el token
    const headers: any = auth ? {} : { "X-Skip-Auth": "true" };
    const response = await apiClient.patch(endpoint, body, {
      headers,
    });
    return response.data;
  },
  putWithoutPrefix: async (
    endpoint: string,
    body: Record<string, any>,
    auth: boolean = true
  ) => {
    // Si auth es false, indicar al interceptor que no agregue el token
    const headers: any = auth ? {} : { "X-Skip-Auth": "true" };
    const response = await apiClient.put(endpoint, body, {
      headers,
    });
    return response.data;
  },
  // Método para descargar archivos (PDF, etc.)
  downloadFile: async (
    endpoint: string,
    filename: string,
    usePrefix: boolean = false,
    auth: boolean = true
  ) => {
    const url = usePrefix ? `/api/${endpoint}` : endpoint;
    
    try {
      // El interceptor de axios maneja automáticamente la autenticación
      // Solo necesitamos deshabilitarla si auth es false
      const headers: any = {};
      if (!auth) {
        headers.Authorization = "";
        headers["X-Skip-Auth"] = "true";
      }
      
      const response = await apiClient.get(url, {
        responseType: "blob",
        headers,
      });

      // Verificar si la respuesta es un error (JSON en lugar de blob)
      if (response.data.type && response.data.type.includes("application/json")) {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || errorData.error || "Error al descargar el archivo");
      }

      // Determinar el tipo MIME basado en la extensión del archivo
      let mimeType = "application/pdf";
      if (filename.endsWith(".pdf")) {
        mimeType = "application/pdf";
      } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
        mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      } else if (filename.endsWith(".docx") || filename.endsWith(".doc")) {
        mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      }

      // Crear un blob desde la respuesta
      const blob = new Blob([response.data], {
        type: response.data.type || mimeType,
      });

      // Crear un URL temporal
      const urlBlob = window.URL.createObjectURL(blob);

      // Crear un elemento <a> temporal para descargar
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = filename;
      link.style.display = "none";

      // Agregar al DOM, hacer clic y remover
      document.body.appendChild(link);
      link.click();

      // Limpiar después de un pequeño delay
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(urlBlob);
      }, 100);

      return response;
    } catch (error: any) {
      // Si es un error de axios, intentar parsear el blob de error
      if (error.response && error.response.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || errorData.error || "Error al descargar el archivo");
        } catch (parseError) {
          throw new Error("Error al descargar el archivo");
        }
      }
      throw error;
    }
  },
};
