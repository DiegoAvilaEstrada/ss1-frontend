# Endpoints Confirmados del Backend

## 1. Creación de Tratamiento

**Endpoint:** `POST /tratamiento/create`

**Body:**
```json
{
  "dpiPaciente": "string",           // DPI del paciente existente
  "dpiEmpleado": "string",           // DPI del empleado (psicólogo)
  "medicado": boolean,               // true/false - si necesitará medicamentos
  "fechaInicio": "YYYY-MM-DD",       // Fecha de inicio (puede ser fecha actual)
  "estadoTratamiento": "string"      // Descripción del estado del tratamiento
}
```

---

## 2. Creación de Sesión Psicológica

**Endpoint:** `POST /sesion_psicologica/create`

**Body:**
```json
{
  "idTratamiento": number,           // ID de un tratamiento existente
  "fechaSesion": "YYYY-MM-DD",       // Fecha en que se dará la sesión
  "observaciones": "string"          // Descripciones/notas de la sesión
}
```

---

## 3. Facturación - Creación de Factura

**Endpoint:** `POST /factura/create`

**Body:**
```json
{
  "dpiPaciente": "string",           // DPI del paciente
  "idTratamiento": number,           // ID del tratamiento relacionado
  "fechaEmision": "YYYY-MM-DD",      // Fecha de emisión
  "montoTotal": number               // Monto total
}
```

---

## 4. Detalle de Factura (Medicamentos)

**Endpoint:** `POST /detalle_factura/create` ✅ CONFIRMADO

**Body:**
```json
{
  "idFactura": number,               // ID de la factura creada anteriormente
  "idProducto": number,              // ID del producto del inventario
  "cantidad": number,                // Cantidad de productos
  "costoTotal": number               // Costo total (cantidad * precio unitario)
}
```

**Nota:** El backend usa `costoTotal` (no `precioUnitario` y `subtotal` por separado).

**Otros endpoints:**
- `GET /detalle_factura/all` - Listar todos los detalles
- `GET /detalle_factura/{id}` - Obtener un detalle específico

---

## 5. Pago de Sesión

**Endpoint:** `POST /pago_sesion/create` ✅ CONFIRMADO

**Body:**
```json
{
  "idSesion": number,                // ID de la sesión psicológica
  "idFactura": number,               // ID de la factura creada anteriormente
  "fechaPago": "YYYY-MM-DD",         // Fecha del pago
  "descuento": number,               // Descuento aplicado (opcional, puede ser 0)
  "montoPagado": number              // Monto del pago
}
```

**Nota:** El backend usa `montoPagado` (no solo `monto`).

**Otros endpoints:**
- `GET /pago_sesion/all` - Listar todos los pagos
- `GET /pago_sesion/{id}` - Obtener un pago específico

---

## Flujos de Implementación

### Flujo 1: Factura para Medicamentos
1. ✅ Crear Tratamiento (POST /tratamiento/create)
2. ✅ Crear Factura (POST /factura/create)
3. ✅ Crear Detalle Factura (POST /detalle_factura/create) - para cada medicamento
   - Campos: `idFactura`, `idProducto`, `cantidad`, `costoTotal`
4. ✅ Finalizar (la factura queda completa)

### Flujo 2: Factura para Sesión Psicológica
1. ✅ Crear Tratamiento (POST /tratamiento/create)
2. ✅ Crear Sesión Psicológica (POST /sesion_psicologica/create)
3. ✅ Crear Factura (POST /factura/create)
4. ✅ Crear Pago Sesión (POST /pago_sesion/create)
   - Campos: `idSesion`, `idFactura`, `fechaPago`, `descuento`, `montoPagado`
5. ✅ Finalizar (la factura queda completa)

