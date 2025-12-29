import { useAlert } from "@components/Alerts";
import { TextInput, SelectSimplyInput } from "@components/inputs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  CircularProgress,
} from "@mui/material";
import { createSesion, updateSesion } from "@services/sesion.service";
import { getAllTratamientos } from "@services/tratamiento.service";
import { validateForm } from "@utilities/Functions";
import { useEffect, useState } from "react";
import * as yup from "yup";

export default function ModalCreateUpdateCita({
  open,
  onClose,
  refresh,
  setRefresh,
  sesionData,
}: {
  open: boolean;
  onClose: () => void;
  setRefresh: (number: number) => void;
  refresh: number;
  sesionData: any;
}) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{
    idTratamiento: { id: number; label: string } | null;
    fechaSesion: string;
    observaciones: string;
  }>({
    idTratamiento: null,
    fechaSesion: new Date().toISOString().split("T")[0],
    observaciones: "",
  });

  const [errors, setErrors] = useState({
    idTratamiento: "",
    fechaSesion: "",
    observaciones: "",
  });

  const [tratamientos, setTratamientos] = useState<any[]>([]);
  const [loadingTratamientos, setLoadingTratamientos] = useState(false);

  const validationSchema = yup.object({
    idTratamiento: yup
      .object()
      .shape({
        id: yup.number().required("Seleccione un tratamiento válido"),
      })
      .required("*El tratamiento es requerido"),
    fechaSesion: yup
      .string()
      .required("*La fecha de sesión es requerida")
      .matches(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe estar en formato YYYY-MM-DD"),
    observaciones: yup.string().required("*Las observaciones son requeridas"),
  });

  useEffect(() => {
    if (open) {
      loadTratamientos();
    }
  }, [open]);

  const loadTratamientos = async () => {
    setLoadingTratamientos(true);
    try {
      const res = await getAllTratamientos();
      if (res?.responseObject && Array.isArray(res.responseObject)) {
        setTratamientos(
          res.responseObject.map((t: any) => ({
            id: t.id,
            label: `Tratamiento #${t.id} - ${t.paciente?.nombre || ""} ${t.paciente?.apellido || ""} - ${t.estadoTratamiento || ""}`.trim(),
          }))
        );
      } else if (Array.isArray(res)) {
        setTratamientos(
          res.map((t: any) => ({
            id: t.id,
            label: `Tratamiento #${t.id} - ${t.paciente?.nombre || ""} ${t.paciente?.apellido || ""} - ${t.estadoTratamiento || ""}`.trim(),
          }))
        );
      }
    } catch (error: any) {
      console.error("Error cargando tratamientos:", error);
      AlertError("Error al cargar los tratamientos disponibles");
    } finally {
      setLoadingTratamientos(false);
    }
  };

  useEffect(() => {
    if (sesionData) {
      setForm({
        idTratamiento: sesionData.tratamiento?.id
          ? {
              id: sesionData.tratamiento.id,
              label: `Tratamiento #${sesionData.tratamiento.id} - ${sesionData.tratamiento.paciente?.nombre || ""} ${sesionData.tratamiento.paciente?.apellido || ""} - ${sesionData.tratamiento.estadoTratamiento || ""}`.trim(),
            }
          : null,
        fechaSesion: sesionData.fechaSesion
          ? new Date(sesionData.fechaSesion).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        observaciones: sesionData.observaciones || "",
      });
    } else {
      setForm({
        idTratamiento: null,
        fechaSesion: new Date().toISOString().split("T")[0],
        observaciones: "",
      });
    }
    setErrors({
      idTratamiento: "",
      fechaSesion: "",
      observaciones: "",
    });
  }, [sesionData]);

  const handleChange = (e: any) => {
    const { name, value } = e;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const resetForm = () => {
    setForm({
      idTratamiento: null,
      fechaSesion: new Date().toISOString().split("T")[0],
      observaciones: "",
    });
    setErrors({
      idTratamiento: "",
      fechaSesion: "",
      observaciones: "",
    });
  };

  const handleSave = () => {
    if (validateForm(validationSchema, form, setErrors)) {
      if (!form.idTratamiento) {
        AlertError("Por favor selecciona un tratamiento");
        return;
      }

      const params = {
        idTratamiento: form.idTratamiento.id,
        fechaSesion: form.fechaSesion,
        observaciones: form.observaciones,
      };

      if (sesionData) {
        updateSesion(sesionData.id, params)
          .then((res: any) => {
            console.log("Sesión actualizada:", res);
            AlertSuccess("Sesión psicológica actualizada exitosamente");
            setRefresh(refresh + 1);
            onClose();
            resetForm();
          })
          .catch((error: any) => {
            console.error("Error actualizando sesión:", error);
            const errorMsg =
              error?.response?.data?.message ||
              error?.response?.data?.error ||
              error?.message ||
              "Ocurrió un error al actualizar la sesión";
            AlertError(errorMsg);
          });
      } else {
        createSesion(params)
          .then((res: any) => {
            console.log("Sesión creada:", res);
            AlertSuccess("Sesión psicológica creada exitosamente");
            setRefresh(refresh + 1);
            onClose();
            resetForm();
          })
          .catch((error: any) => {
            console.error("Error creando sesión:", error);
            const errorMsg =
              error?.response?.data?.message ||
              error?.response?.data?.error ||
              error?.message ||
              "Ocurrió un error al crear la sesión";
            AlertError(errorMsg);
          });
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle bgcolor={"primary.main"} color="white">
        {sesionData ? "Editar Sesión Psicológica" : "Agendar Sesión Psicológica"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          {loadingTratamientos ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <SelectSimplyInput
              options={tratamientos}
              label="Tratamiento"
              name="idTratamiento"
              valueOptions="id"
              labelOptions="label"
              onChange={handleChange}
              value={form.idTratamiento}
              errorForm={!!errors.idTratamiento}
              helperTextForm={errors.idTratamiento}
              validations={validationSchema}
              variant="outlined"
            />
          )}

          <TextInput
            label="Fecha de Sesión"
            name="fechaSesion"
            type="date"
            value={form.fechaSesion}
            onChange={handleChange}
            errorForm={!!errors.fechaSesion}
            helperTextForm={errors.fechaSesion}
            validations={validationSchema}
          />

          <TextInput
            label="Observaciones"
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            errorForm={!!errors.observaciones}
            helperTextForm={errors.observaciones}
            validations={validationSchema}
            maxCharacters={2000}
            multiline
            rows={6}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            resetForm();
          }}
          color="error"
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="info"
          disabled={loadingTratamientos}
        >
          {sesionData ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
