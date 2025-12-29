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
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { createDetalleFactura } from "@services/detalleFactura.service";
import { getAllInventario } from "@services/inventario.service";
import { getAllFacturas } from "@services/facturacion.service";
import { validateForm } from "@utilities/Functions";
import { useEffect, useState } from "react";
import * as yup from "yup";

export default function ModalPagoProductos({
  open,
  onClose,
  refresh,
  setRefresh,
  facturaData,
}: {
  open: boolean;
  onClose: () => void;
  setRefresh: (number: number) => void;
  refresh: number;
  facturaData?: any;
}) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{
    idFactura: { id: number; label: string } | null;
    idProducto: { id: number; nombre: string } | null;
    cantidad: number;
    precio: number;
  }>({
    idFactura: facturaData ? {
      id: facturaData.id,
      label: `Factura #${facturaData.id} - ${facturaData.paciente?.nombre || ""} ${facturaData.paciente?.apellido || ""}`.trim(),
    } : null,
    idProducto: null,
    cantidad: 1,
    precio: 0,
  });

  const [errors, setErrors] = useState({
    idFactura: "",
    idProducto: "",
    cantidad: "",
    precio: "",
  });

  const [productos, setProductos] = useState<any[]>([]);
  const [productosCompletos, setProductosCompletos] = useState<any[]>([]);
  const [facturas, setFacturas] = useState<any[]>([]);
  const [productosAgregados, setProductosAgregados] = useState<Array<{
    idProducto: number;
    nombreProducto: string;
    cantidad: number;
    precio: number;
    costoTotal: number;
  }>>([]);

  const validationSchema = yup.object({
    idFactura: yup.object().required("*La factura es requerida"),
    idProducto: yup.object().required("*El producto es requerido"),
    cantidad: yup.number().min(1, "La cantidad debe ser mayor a 0").required("*La cantidad es requerida"),
    precio: yup.number().min(0.01, "El precio debe ser mayor a 0").required("*El precio es requerido"),
  });

  useEffect(() => {
    if (open) {
      loadProductos();
      loadFacturas();
      // Si se pasa facturaData, prellenar el formulario
      if (facturaData) {
        setForm({
          ...form,
          idFactura: {
            id: facturaData.id,
            label: `Factura #${facturaData.id} - ${facturaData.paciente?.nombre || ""} ${facturaData.paciente?.apellido || ""}`.trim(),
          },
        });
      }
    }
  }, [open, facturaData]);

  const loadProductos = async () => {
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
            nombre: item.producto?.nombreProducto || item.nombreProducto || `Producto #${item.id}`,
          }))
        );
      }
    } catch (error: any) {
      console.error("Error cargando productos:", error);
    }
  };

  const loadFacturas = async () => {
    try {
      const res = await getAllFacturas();
      const facturasList = res?.responseObject || res || [];
      if (Array.isArray(facturasList)) {
        setFacturas(
          facturasList.map((fact: any) => ({
            id: fact.id,
            label: `Factura #${fact.id} - ${fact.paciente?.nombre || ""} ${fact.paciente?.apellido || ""} - Q ${fact.total?.toFixed(2) || fact.montoTotal?.toFixed(2) || "0.00"}`.trim(),
          }))
        );
      }
    } catch (error: any) {
      console.error("Error cargando facturas:", error);
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
      newForm = {
        ...newForm,
        idProducto: value,
        precio: precioVenta,
      };
    } else if (name === "cantidad") {
      const cantidad = parseFloat(value) || 0;
      newForm = {
        ...newForm,
        cantidad: cantidad,
      };
    } else if (name === "precio") {
      const precio = parseFloat(value) || 0;
      newForm = {
        ...newForm,
        precio: precio,
      };
    } else if (name === "idFactura") {
      newForm = { ...newForm, idFactura: value };
    }

    setForm(newForm);
  };

  const handleAgregarProducto = () => {
    if (!form.idFactura || !form.idProducto || !form.cantidad || form.cantidad <= 0 || !form.precio || form.precio <= 0) {
      AlertError("Por favor completa todos los campos requeridos y asegúrate de que la cantidad y el precio sean mayores a 0");
      return;
    }

    // Calcular el costo total: cantidad × precio
    const costoTotal = form.cantidad * form.precio;

    // Verificar si el producto ya está en la lista
    const productoExistente = productosAgregados.find(
      (p) => p.idProducto === form.idProducto!.id
    );

    if (productoExistente) {
      // Si ya existe, sumar la cantidad y el costo
      setProductosAgregados(
        productosAgregados.map((p) =>
          p.idProducto === form.idProducto!.id
            ? {
                ...p,
                cantidad: p.cantidad + form.cantidad,
                costoTotal: p.costoTotal + costoTotal,
              }
            : p
        )
      );
    } else {
      // Agregar nuevo producto
      setProductosAgregados([
        ...productosAgregados,
        {
          idProducto: form.idProducto.id,
          nombreProducto: form.idProducto.nombre,
          cantidad: form.cantidad,
          precio: form.precio,
          costoTotal: costoTotal,
        },
      ]);
    }

    // Limpiar campos del formulario (excepto factura)
    setForm({
      ...form,
      idProducto: null,
      cantidad: 1,
      precio: 0,
    });
  };

  const handleEliminarProducto = (idProducto: number) => {
    setProductosAgregados(
      productosAgregados.filter((p) => p.idProducto !== idProducto)
    );
  };

  const calcularTotal = () => {
    return productosAgregados.reduce((sum, p) => sum + p.costoTotal, 0);
  };

  const handleGuardarTodos = async () => {
    if (!form.idFactura) {
      AlertError("Por favor selecciona una factura");
      return;
    }

    if (productosAgregados.length === 0) {
      AlertError("Por favor agrega al menos un producto");
      return;
    }

    try {
      // Crear todos los detalles de factura
      const promesas = productosAgregados.map((prod) => {
        const params = {
          idFactura: Number(form.idFactura!.id),
          idProducto: Number(prod.idProducto),
          cantidad: Number(prod.cantidad),
          costoTotal: Number(prod.costoTotal),
        };
        console.log("Creando detalle_factura con parámetros:", params);
        return createDetalleFactura(params);
      });

      await Promise.all(promesas);

      AlertSuccess(`${productosAgregados.length} producto(s) agregado(s) y pago registrado exitosamente`);

      setRefresh(refresh + 1);
      onClose();
      resetForm();
    } catch (error: any) {
      console.error("Error procesando productos:", error);
      console.error("Response status:", error?.response?.status);
      console.error("Response data:", error?.response?.data);
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Ocurrió un error al procesar los productos";
      AlertError(errorMsg);
    }
  };

  const resetForm = () => {
    setForm({
      idFactura: facturaData ? {
        id: facturaData.id,
        label: `Factura #${facturaData.id} - ${facturaData.paciente?.nombre || ""} ${facturaData.paciente?.apellido || ""}`.trim(),
      } : null,
      idProducto: null,
      cantidad: 1,
      precio: 0,
    });
    setErrors({
      idFactura: "",
      idProducto: "",
      cantidad: "",
      precio: "",
    });
    setProductosAgregados([]);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle bgcolor={"info.main"} color="white">
        Pago de Productos
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} mt={1}>
          <Box>
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
            {facturaData && (
              <Box sx={{ mt: 0.5, fontSize: "0.75rem", color: "text.secondary" }}>
                Factura pre-seleccionada desde la tabla
              </Box>
            )}
            {productosAgregados.length > 0 && (
              <Box sx={{ mt: 0.5, fontSize: "0.75rem", color: "text.secondary" }}>
                No se puede cambiar la factura después de agregar productos
              </Box>
            )}
          </Box>

          <Divider />

          <Typography variant="h6">Agregar Producto</Typography>
          
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <SelectSimplyInput
                options={productos}
                label="Producto"
                name="idProducto"
                valueOptions="id"
                labelOptions="nombre"
                onChange={handleChange}
                value={form.idProducto}
                errorForm={!!errors.idProducto}
                helperTextForm={errors.idProducto}
                validations={validationSchema}
                variant="outlined"
              />
            </Box>
            <Box sx={{ width: 120 }}>
              <TextField
                label="Cantidad"
                name="cantidad"
                type="number"
                value={form.cantidad.toString()}
                onChange={(e) => handleChange({ name: "cantidad", value: e.target.value })}
                error={!!errors.cantidad}
                helperText={errors.cantidad}
                fullWidth
                variant="outlined"
              />
            </Box>
            <Box sx={{ width: 120 }}>
              <TextField
                label="Precio"
                name="precio"
                type="number"
                value={form.precio.toString()}
                onChange={(e) => handleChange({ name: "precio", value: e.target.value })}
                error={!!errors.precio}
                helperText={errors.precio}
                fullWidth
                variant="outlined"
              />
            </Box>
            <Box sx={{ width: 120 }}>
              <TextField
                label="Costo Total"
                name="costoTotal"
                type="number"
                value={(form.cantidad * form.precio).toFixed(2)}
                fullWidth
                variant="outlined"
                disabled
                sx={{ backgroundColor: "action.disabledBackground" }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAgregarProducto}
                disabled={!form.idFactura || !form.idProducto || form.cantidad <= 0 || form.precio <= 0}
              >
                Agregar
              </Button>
            </Box>
          </Stack>

          {productosAgregados.length > 0 && (
            <>
              <Divider />
              <Typography variant="h6">Productos Agregados</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Producto</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>Cantidad</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>Precio</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>Costo Total</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productosAgregados.map((prod, index) => (
                      <TableRow key={`${prod.idProducto}-${index}`}>
                        <TableCell>{prod.nombreProducto}</TableCell>
                        <TableCell align="right">{prod.cantidad}</TableCell>
                        <TableCell align="right">Q {prod.precio?.toFixed(2) || "0.00"}</TableCell>
                        <TableCell align="right">Q {prod.costoTotal.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Eliminar">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleEliminarProducto(prod.idProducto)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {productosAgregados.reduce((sum, p) => sum + p.cantidad, 0)}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Q {calcularTotal().toFixed(2)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
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
          onClick={handleGuardarTodos}
          variant="contained"
          color="info"
          disabled={productosAgregados.length === 0}
        >
          Pagar Productos ({productosAgregados.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
}
