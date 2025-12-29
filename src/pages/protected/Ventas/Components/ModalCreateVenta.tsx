import { useAlert } from "@components/Alerts";
import { SelectSimplyInput } from "@components/inputs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { createDetalleFactura } from "@services/detalleFactura.service";
import { getAllInventario } from "@services/inventario.service";
import { getAllFacturas } from "@services/facturacion.service";
import { validateForm } from "@utilities/Functions";
import { useEffect, useState } from "react";
import * as yup from "yup";

export default function ModalCreateVenta({
  open,
  onClose,
  refresh,
  setRefresh,
}: {
  open: boolean;
  onClose: () => void;
  setRefresh: (number: number) => void;
  refresh: number;
}) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{
    idFactura: { id: number; label: string } | null;
    idProducto: { id: number; label: string } | null;
    cantidad: number | "";
    costoTotal: number | "";
  }>({
    idFactura: null,
    idProducto: null,
    cantidad: "",
    costoTotal: "",
  });

  const [errors, setErrors] = useState({
    idFactura: "",
    idProducto: "",
    cantidad: "",
    costoTotal: "",
  });

  const [productos, setProductos] = useState<any[]>([]);
  const [productosCompletos, setProductosCompletos] = useState<any[]>([]);
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [loadingFacturas, setLoadingFacturas] = useState(false);

  const validationSchema = yup.object({
    idFactura: yup
      .object()
      .shape({
        id: yup.number().required("Seleccione una factura válida"),
      })
      .required("*La factura es requerida"),
    idProducto: yup
      .object()
      .shape({
        id: yup.number().required("Seleccione un producto válido"),
      })
      .required("*El producto es requerido"),
    cantidad: yup
      .number()
      .min(1, "La cantidad debe ser mayor a 0")
      .required("*La cantidad es requerida"),
    costoTotal: yup
      .number()
      .min(0.01, "El costo total debe ser mayor a 0")
      .required("*El costo total es requerido"),
  });

  useEffect(() => {
    if (open) {
      loadProductos();
      loadFacturas();
    }
  }, [open]);

  const loadProductos = async () => {
    setLoadingProductos(true);
    try {
      const res = await getAllInventario();
      const inventarioList = res?.responseObject || res || [];
      if (Array.isArray(inventarioList)) {
        // Guardar productos completos para obtener precio
        setProductosCompletos(inventarioList);
        // Para el selector
        setProductos(
          inventarioList.map((item: any) => ({
            id: item.producto?.id || item.id,
            label: `${item.producto?.nombreProducto || item.nombreProducto || "Producto"} - Q ${(item.producto?.precioVenta || item.precioVenta || 0).toFixed(2)}`.trim(),
          }))
        );
      }
    } catch (error: any) {
      console.error("Error cargando productos:", error);
      AlertError("Error al cargar los productos disponibles");
    } finally {
      setLoadingProductos(false);
    }
  };

  const loadFacturas = async () => {
    setLoadingFacturas(true);
    try {
      const res = await getAllFacturas();
      const facturasList = res?.responseObject || res || [];
      if (Array.isArray(facturasList)) {
        setFacturas(
          facturasList.map((fact: any) => ({
            id: fact.id,
            label: `Factura #${fact.id} - ${fact.paciente?.nombre || ""} ${fact.paciente?.apellido || ""} - Q ${fact.montoTotal?.toFixed(2) || fact.total?.toFixed(2) || "0.00"}`.trim(),
          }))
        );
      }
    } catch (error: any) {
      console.error("Error cargando facturas:", error);
      AlertError("Error al cargar las facturas disponibles");
    } finally {
      setLoadingFacturas(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e;
    let newForm = { ...form, [name]: value };

    if (name === "idProducto") {
      // Al seleccionar un producto, cargar su precio automáticamente
      const selectedItem = productosCompletos.find(item => {
        const productoId = item.producto?.id || item.id;
        return productoId === value.id;
      });
      const precioVenta = selectedItem?.producto?.precioVenta || selectedItem?.precioVenta || 0;
      
      // Si hay cantidad, calcular el costo total automáticamente
      if (form.cantidad && typeof form.cantidad === "number") {
        newForm.costoTotal = precioVenta * form.cantidad;
      }
    } else if (name === "cantidad") {
      // Al cambiar la cantidad, recalcular el costo total si hay producto seleccionado
      if (form.idProducto) {
        const selectedItem = productosCompletos.find(item => {
          const productoId = item.producto?.id || item.id;
          return productoId === form.idProducto?.id;
        });
        const precioVenta = selectedItem?.producto?.precioVenta || selectedItem?.precioVenta || 0;
        const cantidad = typeof value === "number" ? value : parseFloat(value) || 0;
        newForm.costoTotal = precioVenta * cantidad;
      }
    }

    setForm(newForm);
  };

  const resetForm = () => {
    setForm({
      idFactura: null,
      idProducto: null,
      cantidad: "",
      costoTotal: "",
    });
    setErrors({
      idFactura: "",
      idProducto: "",
      cantidad: "",
      costoTotal: "",
    });
  };

  const handleSave = () => {
    if (validateForm(validationSchema, form, setErrors)) {
      if (!form.idFactura || !form.idProducto || !form.cantidad || !form.costoTotal) {
        AlertError("Por favor completa todos los campos requeridos");
        return;
      }

      const params = {
        idFactura: form.idFactura.id,
        idProducto: form.idProducto.id,
        cantidad: Number(form.cantidad),
        costoTotal: Number(form.costoTotal),
      };

      createDetalleFactura(params)
        .then((res: any) => {
          console.log("Venta creada:", res);
          AlertSuccess("Venta creada exitosamente");
          setRefresh(refresh + 1);
          onClose();
          resetForm();
        })
        .catch((error: any) => {
          console.error("Error creando venta:", error);
          const errorMsg =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Ocurrió un error al crear la venta";
          AlertError(errorMsg);
        });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle bgcolor={"success.main"} color="white">
        Nueva Venta
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          {loadingFacturas ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <SelectSimplyInput
              options={facturas}
              label="Factura"
              name="idFactura"
              valueOptions="id"
              labelOptions="label"
              onChange={handleChange}
              value={form.idFactura}
              errorForm={!!errors.idFactura}
              helperTextForm={errors.idFactura}
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
              label="Producto"
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

          <TextField
            label="Cantidad"
            name="cantidad"
            type="number"
            value={form.cantidad === "" ? "" : form.cantidad.toString()}
            onChange={(e) => handleChange({ name: "cantidad", value: e.target.value === "" ? "" : parseFloat(e.target.value) || 0 })}
            error={!!errors.cantidad}
            helperText={errors.cantidad}
            fullWidth
            variant="outlined"
            inputProps={{ min: 1, step: 1 }}
          />

          <TextField
            label="Costo Total"
            name="costoTotal"
            type="number"
            value={form.costoTotal === "" ? "" : form.costoTotal.toString()}
            onChange={(e) => handleChange({ name: "costoTotal", value: e.target.value === "" ? "" : parseFloat(e.target.value) || 0 })}
            error={!!errors.costoTotal}
            helperText={errors.costoTotal || "Se calcula automáticamente al seleccionar producto y cantidad"}
            fullWidth
            variant="outlined"
            inputProps={{ min: 0.01, step: 0.01 }}
            InputProps={{
              startAdornment: <Box sx={{ mr: 1 }}>Q</Box>,
            }}
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
          color="success"
          disabled={loadingProductos || loadingFacturas}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
