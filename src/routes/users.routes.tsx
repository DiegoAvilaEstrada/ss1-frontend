import { getRole } from "@utilities/Functions";
import { lazy } from "react";
import { Route } from "react-router";
const routes = [
  {
    path: "/users",
    element: lazy(() => import("../pages/protected/Users/index")),
  },
];

export const UserRoutesRender = () => {
  return routes.map((val) => {
    const Component = val.element;
    if (getRole() === "ADMIN") {
      return <Route key={val.path} path={val.path} element={<Component />} />;
    }
  });
};
