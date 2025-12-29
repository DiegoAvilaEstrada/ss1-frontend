import { 
  GroupsOutlined, 
  LocalPharmacy,
  Psychology,
  MedicalServices,
  AccountBalance,
  People,
  Inventory,
  Receipt,
  Assessment
} from "@mui/icons-material";

export const getMenu = (role: string) => {
  // Normalizar el rol a mayúsculas para la búsqueda
  const normalizedRole = role ? role.toUpperCase().trim() : "";
  
  const quickAccess: any = {
    ADMIN: [
      {
        title: "Pacientes",
        path: "/pacientes",
        icon: <People />,
      },
      {
        title: "Empleados",
        path: "/empleados",
        icon: <GroupsOutlined />,
      },
      {
        title: "Nómina",
        path: "/nomina",
        icon: <AccountBalance />,
      },
      {
        title: "Inventario",
        path: "/inventario",
        icon: <Inventory />,
      },
      {
        title: "Facturación",
        path: "/facturacion",
        icon: <Receipt />,
      },
      {
        title: "Reportes",
        path: "/reportes",
        icon: <Assessment />,
      },
    ],
    PSICOLOGO: [
      {
        title: "Pacientes",
        path: "/pacientes",
        icon: <People />,
      },
      {
        title: "Historiales Clínicos",
        path: "/historiales",
        icon: <Psychology />,
      },
      {
        title: "Citas",
        path: "/citas",
        icon: <MedicalServices />,
      },
    ],
    PSIQUIATRA: [
      {
        title: "Pacientes",
        path: "/pacientes",
        icon: <People />,
      },
      {
        title: "Historiales Clínicos",
        path: "/historiales",
        icon: <MedicalServices />,
      },
      {
        title: "Medicamentos",
        path: "/medicamentos",
        icon: <LocalPharmacy />,
      },
      {
        title: "Citas",
        path: "/citas",
        icon: <MedicalServices />,
      },
    ],
    FARMACIA: [
      {
        title: "Inventario",
        path: "/inventario",
        icon: <Inventory />,
      },
      {
        title: "Medicamentos",
        path: "/medicamentos",
        icon: <LocalPharmacy />,
      },
      {
        title: "Ventas",
        path: "/ventas",
        icon: <Receipt />,
      },
    ],
    FINANZAS: [
      {
        title: "Facturación",
        path: "/facturacion",
        icon: <Receipt />,
      },
      {
        title: "Nómina",
        path: "/nomina",
        icon: <AccountBalance />,
      },
      {
        title: "Reportes Financieros",
        path: "/reportes-financieros",
        icon: <Assessment />,
      },
    ],
    CLIENTE: [
      {
        title: "Mi Historial",
        path: "/mi-historial",
        icon: <Psychology />,
      },
      {
        title: "Mis Citas",
        path: "/mis-citas",
        icon: <MedicalServices />,
      },
      {
        title: "Mis Facturas",
        path: "/mis-facturas",
        icon: <Receipt />,
      },
    ],
  };
  
  // Buscar el menú usando el rol normalizado
  const items = quickAccess[normalizedRole] || [];
  
  // Si no se encuentra el menú, log para debugging
  if (!items.length && normalizedRole) {
    console.warn(`No se encontró menú para el rol: "${normalizedRole}". Roles disponibles:`, Object.keys(quickAccess));
  }
  
  return items;
};
