import { createSlice } from "@reduxjs/toolkit";
import { setCurrentUser, setRole, setPacienteDpi } from "@utilities/Functions";
import Cookies from "js-cookie";

const userDetail = Cookies.get("user");
const token = userDetail ? JSON.parse(userDetail) : null;

const initialState = {
  loading: false,
  userInfo: token,
  userToken: token ? token?.uid : null,
  error: null as string | null,
  success: false,
  role: "",
};

const removeStorage = () => {
  setCurrentUser();
  setRole("");
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    startLogin: (state) => {
      state.loading = true;
      state.error = null;
    },

    completeLogin: (state, action) => {
      const item = {
        uid: action.payload.token,
        name: `${action.payload.user.name} ${action.payload.user.lastName}`,
        id: action.payload.user.id,
        email: action.payload.user.email,
        username: action.payload.user.username || action.payload.user.email?.split("@")[0] || "", // Guardar username
        role: action.payload.user.role,
        profile: action.payload.user.profile,
        dpi: action.payload.user.dpi || action.payload.user.id, // Agregar DPI si está disponible
      };

      setCurrentUser(item);
      setRole(item.role);

      // Si es paciente, guardar el DPI
      if (item.role === "CLIENTE" && item.dpi) {
        setPacienteDpi(String(item.dpi));
      }

      state.loading = false;
      state.success = true;
      state.userInfo = item;
      state.userToken = item.uid;
      state.role = item.role;
    },
    updateUserFields: (state, action) => {
      const updates = action.payload;

      if (state.userInfo) {
        const updatedUser = { ...state.userInfo, ...updates };
        Object.assign(state.userInfo, updates);
        
        // Si se actualiza el rol, actualizar también en cookies
        if (updates.role) {
          setRole(updates.role);
          setCurrentUser(updatedUser);
          state.role = updates.role;
        }
      }
    },

    loginError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    logout: (state) => {
      removeStorage();
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  startLogin,
  completeLogin,
  loginError,
  logout,
  updateUserFields,
} = UserSlice.actions;

export default UserSlice.reducer;
