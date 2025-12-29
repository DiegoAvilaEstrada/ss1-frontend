import { useAlert } from "@components/Alerts";
import { SelectSimplyInput } from "@components/inputs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import { createItem } from "@services/inventario.service";
import { getAllProductos } from "@services/producto.service";
import { validateForm } from "@utilities/Functions";
import { useEffect, useState } from "react";
import * as yup from "yup";

export default function ModalCreateUpdateItem({
  open,
  onClose,
  refresh,
  setRefresh,
  itemData,
}: {
  open: boolean;
  onClose: () => void;
  setRefresh: (number: number) => void;
  refresh: number;
  itemData: any;
}) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{
    idProducto: { id: number; nombreProducto: string } | null;
    stock: number | "";
    minimoStock: number | "";
  }>({
    idProducto: null,
    stock: "",
    minimoStock: "",
  });

  const [errors, setErrors] = useState({
    idProducto: "",
    stock: "",
    minimoStock: "",
  });

  const [productos, setProductos] = useState<any[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(false);

  const validationSchema = yup.object({
    idProducto: yup
      .object()
      .shape({
        id: yup.number().required("Seleccione un producto válido"),
        nombreProducto: yup.string().required(),
      })
      .required("*El producto es requerido"),
    stock: yup
      .number()
      .min(0, "El stock debe ser mayor o igual a 0")
      .required("*El stock es requerido"),
    minimoStock: yup
      .number()
      .min(0, "El stock mínimo debe ser mayor o igual a 0")
      .required("*El stock mínimo es requerido"),
  });

  // Cargar productos disponibles
  useEffect(() => {
    if (open) {
      setLoadingProductos(true);
      getAllProductos()
        .then((res: any) => {
          console.log("Productos recibidos:", res);
          if (res?.responseObject && Array.isArray(res.responseObject)) {
            setProductos(
              res.responseObject.map((p: any) => ({
                id: p.id,
                nombreProducto: p.nombreProducto || p.nombre || "",
              }))
            );
          } else if (Array.isArray(res)) {
            setProductos(
              res.map((p: any) => ({
                id: p.id,
                nombreProducto: p.nombreProducto || p.nombre || "",
              }))
            );
          }
        })
        .catch((error) => {
          console.error("Error cargando productos:", error);
          AlertError("Error al cargar los productos disponibles");
        })
        .finally(() => {
          setLoadingProductos(false);
        });
    }
  }, [open, AlertError]);

  useEffect(() => {
    if (itemData) {
      // Si estamos editando, cargar los datos del item
      setForm({
        idProducto: itemData.producto
          ? {
              id: itemData.producto.id,
              nombreProducto: itemData.producto.nombreProducto || "",
            }
          : null,
        stock: itemData.stock || "",
        minimoStock: itemData.minimoStock || "",
      });
    } else {
      // Si estamos creando, resetear el formulario
      resetForm();
    }
  }, [itemData]);

  const handleChange = (e: any) => {
    const { name, value } = e;
    if (
      name === "stock" ||
      name === "minimoStock"
    ) {
      // Para campos numéricos, convertir el string a número o mantener "" si está vacío
      setForm({
        ...form,
        [name]: value === "" ? "" : parseFloat(value) || 0,
      });
    } else {
      // Para otros campos (como idProducto del SelectSimplyInput)
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const resetForm = () => {
    setForm({
      idProducto: null,
      stock: "",
      minimoStock: "",
    });
    setErrors({
      idProducto: "",
      stock: "",
      minimoStock: "",
    });
  };

  const handleSave = () => {
    if (validateForm(validationSchema, form, setErrors)) {
      const { idProducto, ...rest } = form;
      const params = {
        ...rest,
        idProducto: form.idProducto?.id,
        stock: Number(form.stock),
        minimoStock: Number(form.minimoStock),
      };

      if (itemData) {
        // TODO: Implementar actualización cuando el backend lo soporte
        AlertError("La funcionalidad de actualización aún no está disponible");
      } else {
        handleCreate(params);
      }
    }
  };

  const handleCreate = (params: any) => {
    createItem(params)
      .then((res: any) => {
        console.log("Item creado:", res);
        AlertSuccess("Item de inventario creado exitosamente");
        setRefresh(refresh + 1);
        onClose();
        resetForm();
      })
      .catch((error: any) => {
        console.error("Error creando item:", error);
        const errorMsg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Ocurrió un error al crear el item de inventario";
        AlertError(errorMsg);
      });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle bgcolor={"primary.main"} color="white">
        {itemData ? "Editar Producto del Inventario" : "Agregar producto al inventario"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          {loadingProductos ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <SelectSimplyInput
              options={productos}
              label="Producto"
              name="idProducto"
              valueOptions="id"
              labelOptions="nombreProducto"
              onChange={handleChange}
              value={form.idProducto}
              errorForm={!!errors.idProducto}
              helperTextForm={errors.idProducto}
              validations={validationSchema}
              variant="outlined"
            />
          )}

          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={form.stock === "" ? "" : form.stock.toString()}
            onChange={(e) => handleChange({ name: "stock", value: e.target.value })}
            error={!!errors.stock}
            helperText={errors.stock}
            fullWidth
            variant="outlined"
            inputProps={{
              step: "1",
              min: "0",
            }}
          />

          <TextField
            label="Stock Mínimo"
            name="minimoStock"
            type="number"
            value={form.minimoStock === "" ? "" : form.minimoStock.toString()}
            onChange={(e) => handleChange({ name: "minimoStock", value: e.target.value })}
            error={!!errors.minimoStock}
            helperText={errors.minimoStock}
            fullWidth
            variant="outlined"
            inputProps={{
              step: "1",
              min: "0",
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="info"
          disabled={loadingProductos}
        >
          {itemData ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
