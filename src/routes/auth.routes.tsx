import { lazy } from "react";
import { Route } from "react-router";
const routes = [
  {
    path: "/login",
    element: lazy(() => import("../pages/notProtected/auth/Login")),
  },
  {
    path: "/reset-password",
    element: lazy(() => import("../pages/notProtected/auth/ResetPassword")),
  },
];

export const AuthRoutesRender = () => {
  return routes.map((val) => {
    const Component = val.element;
    return <Route key={val.path} path={val.path} element={<Component />} />;
  });
};
