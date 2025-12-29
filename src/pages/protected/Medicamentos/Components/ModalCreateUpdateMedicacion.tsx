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
import { createMedicacion, updateMedicacion } from "@services/medicacion.service";
import { getAllTratamientos } from "@services/tratamiento.service";
import { getAllInventario } from "@services/inventario.service";
import { validateForm } from "@utilities/Functions";
import { useEffect, useState } from "react";
import * as yup from "yup";

export default function ModalCreateUpdateMedicacion({
  open,
  onClose,
  refresh,
  setRefresh,
  medicacionData,
}: {
  open: boolean;
  onClose: () => void;
  setRefresh: (number: number) => void;
  refresh: number;
  medicacionData: any;
}) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{
    idTratamiento: { id: number; label: string } | null;
    idProducto: { id: number; label: string } | null;
    dosis: string;
    frecuencia: string;
  }>({
    idTratamiento: null,
    idProducto: null,
    dosis: "",
    frecuencia: "",
  });

  const [errors, setErrors] = useState({
    idTratamiento: "",
    idProducto: "",
    dosis: "",
    frecuencia: "",
  });

  const [tratamientos, setTratamientos] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [loadingTratamientos, setLoadingTratamientos] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);

  const validationSchema = yup.object({
    idTratamiento: yup
      .object()
      .shape({
        id: yup.number().required("Seleccione un tratamiento válido"),
      })
      .required("*El tratamiento es requerido"),
    idProducto: yup
      .object()
      .shape({
        id: yup.number().required("Seleccione un producto válido"),
      })
      .required("*El producto es requerido"),
    dosis: yup.string().required("*La dosis es requerida"),
    frecuencia: yup.string().required("*La frecuencia es requerida"),
  });

  useEffect(() => {
    if (open) {
      loadTratamientos();
      loadProductos();
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

  const loadProductos = async () => {
    setLoadingProductos(true);
    try {
      const res = await getAllInventario();
      const inventarioItems = res?.responseObject || res || [];
      
      // Convertir items de inventario a formato para el select
      const productosList = Array.isArray(inventarioItems)
        ? inventarioItems.map((item: any) => ({
            id: item.producto?.id || item.id,
            label: `${item.producto?.nombreProducto || item.nombreProducto || "Producto"} - ${item.producto?.descripcion || item.descripcion || ""}`.trim(),
          }))
        : [];
      
      setProductos(productosList);
    } catch (error: any) {
      console.error("Error cargando productos:", error);
      AlertError("Error al cargar los productos disponibles");
    } finally {
      setLoadingProductos(false);
    }
  };

  useEffect(() => {
    if (medicacionData) {
      setForm({
        idTratamiento: medicacionData.tratamiento?.id
          ? {
              id: medicacionData.tratamiento.id,
              label: `Tratamiento #${medicacionData.tratamiento.id} - ${medicacionData.tratamiento.paciente?.nombre || ""} ${medicacionData.tratamiento.paciente?.apellido || ""} - ${medicacionData.tratamiento.estadoTratamiento || ""}`.trim(),
            }
          : null,
        idProducto: medicacionData.producto?.id
          ? {
              id: medicacionData.producto.id,
              label: `${medicacionData.producto.nombreProducto || "Producto"} - ${medicacionData.producto.descripcion || ""}`.trim(),
            }
          : null,
        dosis: medicacionData.dosis || "",
        frecuencia: medicacionData.frecuencia || "",
      });
    } else {
      setForm({
        idTratamiento: null,
        idProducto: null,
        dosis: "",
        frecuencia: "",
      });
    }
    setErrors({
      idTratamiento: "",
      idProducto: "",
      dosis: "",
      frecuencia: "",
    });
  }, [medicacionData]);

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
      idProducto: null,
      dosis: "",
      frecuencia: "",
    });
    setErrors({
      idTratamiento: "",
      idProducto: "",
      dosis: "",
      frecuencia: "",
    });
  };

  const handleSave = () => {
    if (validateForm(validationSchema, form, setErrors)) {
      if (!form.idTratamiento || !form.idProducto) {
        AlertError("Por favor completa todos los campos requeridos");
        return;
      }

      const params = {
        idTratamiento: form.idTratamiento.id,
        idProducto: form.idProducto.id,
        dosis: form.dosis,
        frecuencia: form.frecuencia,
      };

      if (medicacionData) {
        updateMedicacion(medicacionData.id, params)
          .then((res: any) => {
            console.log("Medicación actualizada:", res);
            AlertSuccess("Medicación actualizada exitosamente");
            setRefresh(refresh + 1);
            onClose();
            resetForm();
          })
          .catch((error: any) => {
            console.error("Error actualizando medicación:", error);
            const errorMsg =
              error?.response?.data?.message ||
              error?.response?.data?.error ||
              error?.message ||
              "Ocurrió un error al actualizar la medicación";
            AlertError(errorMsg);
          });
      } else {
        createMedicacion(params)
          .then((res: any) => {
            console.log("Medicación creada:", res);
            AlertSuccess("Medicación creada exitosamente");
            setRefresh(refresh + 1);
            onClose();
            resetForm();
          })
          .catch((error: any) => {
            console.error("Error creando medicación:", error);
            const errorMsg =
              error?.response?.data?.message ||
              error?.response?.data?.error ||
              error?.message ||
              "Ocurrió un error al crear la medicación";
            AlertError(errorMsg);
          });
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle bgcolor={"primary.main"} color="white">
        {medicacionData ? "Editar Medicación" : "Agregar Medicación"}
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

          {loadingProductos ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <SelectSimplyInput
              options={productos}
              label="Producto/Medicamento"
              name="idProducto"
              valueOptions="id"
              labelOptions="label"
              onChange={handleChange}
              value={form.idProducto}
              errorForm={!!errors.idProducto}
              helperTextForm={errors.idProducto}
              validations={validationSchema}
              variant="outlined"
            />
          )}

          <TextInput
            label="Dosis"
            name="dosis"
            value={form.dosis}
            onChange={handleChange}
            errorForm={!!errors.dosis}
            helperTextForm={errors.dosis}
            validations={validationSchema}
            maxCharacters={100}
          />

          <TextInput
            label="Frecuencia"
            name="frecuencia"
            value={form.frecuencia}
            onChange={handleChange}
            errorForm={!!errors.frecuencia}
            helperTextForm={errors.frecuencia}
            validations={validationSchema}
            maxCharacters={500}
            multiline
            rows={3}
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
          disabled={loadingTratamientos || loadingProductos}
        >
          {medicacionData ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

