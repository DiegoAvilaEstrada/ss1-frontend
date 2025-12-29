import { useAlert } from "@components/Alerts";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { getAllRoles } from "@services/role.service";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserFields } from "@redux/UserSlice";
import { setRole } from "@utilities/Functions";

interface SelectRoleModalProps {
  open: boolean;
  onClose: () => void;
  currentRole: string;
}

export default function SelectRoleModal({
  open,
  onClose,
  currentRole,
}: SelectRoleModalProps) {
  const { AlertError, AlertSuccess } = useAlert();
  const dispatch = useDispatch();
  const [roles, setRoles] = useState<{ id: number; rol: string }[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(currentRole);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadRoles();
      setSelectedRole(currentRole);
    }
  }, [open, currentRole]);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const response = await getAllRoles();
      console.log("Roles recibidos:", response);
      if (response?.responseObject && Array.isArray(response.responseObject)) {
        setRoles(response.responseObject);
      } else if (Array.isArray(response)) {
        setRoles(response);
      }
    } catch (error: any) {
      console.error("Error cargando roles:", error);
      AlertError("Error al cargar los roles disponibles");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!selectedRole) {
      AlertError("Por favor selecciona un rol");
      return;
    }

    // Actualizar el rol en Redux y cookies
    dispatch(
      updateUserFields({
        role: selectedRole.toUpperCase(),
      })
    );
    setRole(selectedRole.toUpperCase());

    AlertSuccess("Rol actualizado exitosamente");
    onClose();
    
    // Recargar la página para aplicar los cambios del menú
    window.location.reload();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle bgcolor={"primary.main"} color="white">
        Seleccionar Rol
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
          Selecciona el rol con el que deseas trabajar. Esto cambiará los módulos disponibles en el menú.
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <FormControl fullWidth>
            <InputLabel id="role-select-label">Rol</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={selectedRole}
              label="Rol"
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.rol.toUpperCase()}>
                  {role.rol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={loading || !selectedRole}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}

