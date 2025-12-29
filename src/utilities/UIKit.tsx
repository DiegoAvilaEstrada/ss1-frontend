import {
  Button,
  type ButtonProps,
  Card,
  CardContent,
  Typography,
  TextField,
  type TextFieldProps,
  Chip,
  type ChipProps,
  Modal,
  Box,
  Alert,
  type AlertProps,
  CircularProgress,
  Divider,
  Avatar,
  type AvatarProps,
  Grid,
} from "@mui/material";
import React, { useState } from "react";

export const UIButton = (props: ButtonProps) => {
  return (
    <Button
      {...props}
      sx={{
        borderRadius: "12px",
        textTransform: "none",
        fontWeight: 600,
        px: 3,
        py: 1,
        ...props.sx,
      }}
    >
      {props.children}
    </Button>
  );
};

export const UICard = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        backgroundColor: "background.paper",
      }}
    >
      <CardContent>
        {title && (
          <Typography variant="h6" fontWeight={700} color="primary" mb={1.5}>
            {title}
          </Typography>
        )}

        {children}
      </CardContent>
    </Card>
  );
};

export const UIInput = (props: TextFieldProps) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      {...props}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
        ...props.sx,
      }}
    />
  );
};

export const UIBadge = (props: ChipProps) => {
  return (
    <Chip
      {...props}
      sx={{
        borderRadius: "6px",
        fontWeight: 600,
        px: 1,
        ...props.sx,
      }}
    />
  );
};

export const UIModal = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          backgroundColor: "background.paper",
          p: 4,
          borderRadius: 3,
          width: "90%",
          maxWidth: 500,
          mx: "auto",
          mt: "15vh",
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export const UIAlert = (props: AlertProps) => {
  return (
    <Alert
      {...props}
      sx={{
        borderRadius: 2,
        fontWeight: 600,
        ...props.sx,
      }}
    />
  );
};

export const UILoader = () => {
  return (
    <Box display="flex" justifyContent="center" py={4}>
      <CircularProgress color="primary" />
    </Box>
  );
};

export const UIDivider = () => {
  return <Divider sx={{ my: 3, opacity: 0.3 }} />;
};

export const UIAvatar = (props: AvatarProps) => {
  return (
    <Avatar
      {...props}
      sx={{
        width: 45,
        height: 45,
        bgcolor: "primary.main",
        ...props.sx,
      }}
    />
  );
};

export const UITitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <Typography variant="h4" fontWeight={700} color="primary" mb={3}>
      {children}
    </Typography>
  );
};

export const UISection = ({
  children,
  margin = { xs: 2, sm: 10, md: 15, lg: 30, xl: 45 },
}: {
  children: React.ReactNode;
  margin?: any;
}) => {
  return <Box sx={{ px: margin, py: 6 }}>{children}</Box>;
};

const UIKit = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <UISection>
        <UITitle>UI KIT — Demo Completa</UITitle>

        <UIAlert severity="info" sx={{ mb: 4 }}>
          Este es un ejemplo de todos los componentes del UIKit usando tu
          paleta.
        </UIAlert>

        <UIDivider />

        <UITitle>Botones</UITitle>
        <Grid container spacing={2} mb={6}>
          <Grid>
            <UIButton variant="contained" color="primary">
              Primario
            </UIButton>
          </Grid>
          <Grid>
            <UIButton variant="contained" color="secondary">
              Secundario
            </UIButton>
          </Grid>
          <Grid>
            <UIButton variant="outlined" color="primary">
              Outline
            </UIButton>
          </Grid>
          <Grid>
            <UIButton variant="contained" color="success">
              Éxito
            </UIButton>
          </Grid>
          <Grid>
            <UIButton variant="contained" color="error">
              Error
            </UIButton>
          </Grid>
        </Grid>

        <UIDivider />

        <UITitle>Inputs</UITitle>
        <Grid container spacing={3} mb={6}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <UIInput label="Nombre" />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <UIInput label="Correo electrónico" type="email" />
          </Grid>
        </Grid>

        <UIDivider />

        <UITitle>Etiquetas</UITitle>
        <Grid container spacing={2} mb={6}>
          <Grid>
            <UIBadge label="Activo" color="success" />
          </Grid>
          <Grid>
            <UIBadge label="Pendiente" color="warning" />
          </Grid>
          <Grid>
            <UIBadge label="Error" color="error" />
          </Grid>
          <Grid>
            <UIBadge label="Informativo" color="info" />
          </Grid>
        </Grid>

        <UIDivider />

        <UITitle>Avatar</UITitle>
        <Grid container spacing={2} mb={6}>
          <Grid>
            <UIAvatar>AG</UIAvatar>
          </Grid>
          <Grid>
            <UIAvatar
              src="https://i.pravatar.cc/150?img=32"
              sx={{ width: 60, height: 60 }}
            />
          </Grid>
        </Grid>

        <UIDivider />

        <UITitle>Tarjetas</UITitle>
        <Grid container spacing={4} mb={6}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <UICard title="Ejemplo 1">
              Esto es una tarjeta usando tu UIKit. Puedes poner cualquier
              contenido dentro.
            </UICard>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <UICard title="Ejemplo 2">
              Layout sólido, colores balanceados y diseño limpio.
            </UICard>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <UICard title="Ejemplo 3">
              Totalmente compatible con tu paleta personalizada.
            </UICard>
          </Grid>
        </Grid>

        <UIDivider />

        <UITitle>Modal</UITitle>
        <UIButton
          color="primary"
          variant="contained"
          onClick={() => setOpenModal(true)}
        >
          Abrir Modal
        </UIButton>

        <UIModal open={openModal} onClose={() => setOpenModal(false)}>
          <UITitle>Modal de ejemplo</UITitle>
          <Typography>
            Este modal forma parte del UIKit y sigue tus colores definidos.
          </Typography>

          <Box mt={3}>
            <UIButton
              color="primary"
              variant="contained"
              onClick={() => setOpenModal(false)}
            >
              Cerrar
            </UIButton>
          </Box>
        </UIModal>

        <UIDivider />

        <UITitle>Cargando…</UITitle>
        <UILoader />

        <Box height={50} />
      </UISection>
    </Box>
  );
};

export default UIKit;
