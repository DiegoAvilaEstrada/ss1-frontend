import { lazy } from "react";
import { Route } from "react-router";
const routes = [
  {
    path: "/home",
    element: lazy(() => import("../pages/protected/Home/index")),
  },
  {
    path: "/profile",
    element: lazy(() => import("../pages/protected/Profile/index")),
  },
];

export const DashboardRenderRoutes = () => {
  return routes.map((val) => {
    const Component = val.element;
    return <Route key={val.path} path={val.path} element={<Component />} />;
  });
};
