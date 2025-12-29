import { Navigate, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getToken } from "./Functions";

import React from "react";
import { logout } from "@redux/UserSlice";

export const ProtectedRoute: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const dispatch = useDispatch();
  try {
    if (!getToken()) {
      dispatch(logout());
      return <Navigate to="/" />;
    }
  } catch (error) {
    dispatch(logout());
    return <Navigate to="/" />;
  }
  return children ? children : <Outlet />;
};
