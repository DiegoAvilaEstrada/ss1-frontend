import { getRole } from "@utilities/Functions";
import { lazy } from "react";
import { Route } from "react-router";

// Rutas para módulos de PsiFirm
const routes = [
  // Módulos de Administración
  {
    path: "/pacientes",
    element: lazy(() => import("../pages/protected/Pacientes/index")),
    roles: ["ADMIN", "PSICOLOGO", "PSIQUIATRA"],
  },
  {
    path: "/empleados",
    element: lazy(() => import("../pages/protected/Empleados/index")),
    roles: ["ADMIN"],
  },
  {
    path: "/nomina",
    element: lazy(() => import("../pages/protected/Nomina/index")),
    roles: ["ADMIN", "FINANZAS"],
  },
  {
    path: "/inventario",
    element: lazy(() => import("../pages/protected/Inventario/index")),
    roles: ["ADMIN", "FARMACIA"],
  },
  {
    path: "/facturacion",
    element: lazy(() => import("../pages/protected/Facturacion/index")),
    roles: ["ADMIN", "FINANZAS"],
  },
  {
    path: "/reportes",
    element: lazy(() => import("../pages/protected/Reportes/index")),
    roles: ["ADMIN"],
  },
  // Módulos Clínicos
  {
    path: "/historiales",
    element: lazy(() => import("../pages/protected/Historiales/index")),
    roles: ["PSICOLOGO", "PSIQUIATRA"],
  },
  {
    path: "/citas",
    element: lazy(() => import("../pages/protected/Citas/index")),
    roles: ["PSICOLOGO", "PSIQUIATRA"],
  },
  {
    path: "/medicamentos",
    element: lazy(() => import("../pages/protected/Medicamentos/index")),
    roles: ["PSIQUIATRA", "FARMACIA"],
  },
  // Módulos de Farmacia
  {
    path: "/ventas",
    element: lazy(() => import("../pages/protected/Ventas/index")),
    roles: ["FARMACIA"],
  },
  // Módulos Financieros
  {
    path: "/reportes-financieros",
    element: lazy(() => import("../pages/protected/ReportesFinancieros/index")),
    roles: ["FINANZAS"],
  },
  // Módulos para Pacientes/Clientes
  {
    path: "/mi-historial",
    element: lazy(() => import("../pages/protected/MiHistorial/index")),
    roles: ["CLIENTE"],
  },
  {
    path: "/mis-citas",
    element: lazy(() => import("../pages/protected/MisCitas/index")),
    roles: ["CLIENTE"],
  },
  {
    path: "/mis-facturas",
    element: lazy(() => import("../pages/protected/MisFacturas/index")),
    roles: ["CLIENTE"],
  },
];

export const PsiFirmRoutesRender = () => {
  const currentRole = getRole();
  
  return routes
    .filter((route) => !route.roles || route.roles.includes(currentRole || ""))
    .map((val) => {
      const Component = val.element;
      return <Route key={val.path} path={val.path} element={<Component />} />;
    });
};

