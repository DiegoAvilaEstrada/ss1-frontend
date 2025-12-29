import { api } from "./api.service";

export const getAllUsers = (params: any) => {
  return api.get("user", params);
};

export const activateUser = (id: number) => {
  return api.patch(`user/activate/${id}`, {});
};

export const desactivateUser = (id: number) => {
  return api.patch(`user/desactivate/${id}`, {});
};

export const createUser = (data: any) => {
  return api.post("user", data);
};

export const updateUser = (data: any, id: number) => {
  return api.patch(`user/${id}`, data);
};

export const getMyInfo = () => {
  return api.get("user/my-info");
};

export const updateMyInfo = async (data: any) => {
  return api.patchFile("user/update-profile", data);
};
