import Cookies from "js-cookie";

export const validateForm = (
  validationSchema: any,
  fields: any,
  setErrors: any
) => {
  try {
    validationSchema.validateSync(fields, { abortEarly: false });
    setErrors({});
    return true;
  } catch (errosValidation: any) {
    const nErrors: Record<string, string> = {};
    errosValidation.inner?.forEach((error: any) => {
      nErrors[error.path] = error.message;
    });
    setErrors(nErrors);
    return false;
  }
};

export const getToken = () => {
  const data = Cookies.get("user") || null;
  if (data) {
    const userCookie = Cookies.get("user");
    const tokens = userCookie ? JSON.parse(userCookie) : null;
    const token = tokens?.uid;
    return token;
  }
  return null;
};

export const removeToken = () => {
  try {
    Cookies.remove("user");
  } catch (error) {
    console.log("~ setPermission ~ error:", error);
  }
};

export const setRole = (data: string) => {
  try {
    if (data) {
      Cookies.set("role", String(data), { expires: 1 });
    } else {
      Cookies.remove("role");
    }
  } catch (error) {
    console.log("~ setPermission ~ error:", error);
  }
};

export const setCurrentUser = (data: { name: string } = { name: "" }) => {
  try {
    if (data) {
      const eightHoursFromNow = new Date(
        new Date().getTime() + 8 * 60 * 60 * 1000
      );
      Cookies.set("name", JSON.stringify(data.name), {
        expires: eightHoursFromNow,
      });
      Cookies.set("user", JSON.stringify(data), {
        expires: eightHoursFromNow,
      });
    } else {
      Cookies.remove("name");
      Cookies.remove("user");
    }
  } catch (error) {
    console.log("setCurrentUser ~ error:", error);
  }
};

export const getCurrentName = () => {
  try {
    const name = Cookies.get("name");
    return name ? name.toString().replace(/"/g, "") : "";
  } catch (error) {
    console.log(" ~ getCurrentName ~ error:", error);
  }
};

export const getRole = () => {
  let role = null;
  try {
    const roleCookie = Cookies.get("role");
    role = roleCookie ? roleCookie : null;
  } catch (error) {
    console.log("~ getRole ~ error:", error);
    role = null;
  }
  return role;
};

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-GT", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
export const margin = { xs: 2, sm: 10, md: 15, lg: 30, xl: 45 };

// Funciones para manejar el DPI del paciente
export const setPacienteDpi = (dpi: string) => {
  try {
    if (dpi) {
      Cookies.set("pacienteDpi", dpi, { expires: 1 });
    } else {
      Cookies.remove("pacienteDpi");
    }
  } catch (error) {
    console.log("setPacienteDpi ~ error:", error);
  }
};

export const getPacienteDpi = () => {
  try {
    return Cookies.get("pacienteDpi") || null;
  } catch (error) {
    console.log("getPacienteDpi ~ error:", error);
    return null;
  }
};

// Obtener información completa del usuario
export const getUserInfo = () => {
  try {
    const userCookie = Cookies.get("user");
    return userCookie ? JSON.parse(userCookie) : null;
  } catch (error) {
    console.log("getUserInfo ~ error:", error);
    return null;
  }
};
