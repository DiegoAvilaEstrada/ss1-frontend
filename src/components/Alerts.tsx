import { createContext, useContext, useState, type ReactNode } from "react";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  type AlertColor,
} from "@mui/material";

interface AlertContextProps {
  AlertSuccess: (msg: string) => void;
  AlertError: (msg: string) => void;
  AlertApproveDelete: (
    title: string,
    description: string,
    icon: AlertColor,
    textApprove: string,
    textCancel: string
  ) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextProps | null>(null);

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within AlertProvider");
  return ctx;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<AlertColor>("success");

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState<{
    title: string;
    description: string;
    icon: AlertColor;
    approve: string;
    cancel: string;
    resolve?: (value: boolean) => void;
  } | null>(null);

  const AlertSuccess = (msg: string) => {
    setSnackbarType("success");
    setSnackbarMessage(msg);
    setOpenSnackbar(true);
  };

  const AlertError = (msg: string) => {
    setSnackbarType("error");
    setSnackbarMessage(msg);
    setOpenSnackbar(true);
  };

  const AlertApproveDelete = (
    title: string,
    description: string,
    icon: AlertColor,
    textApprove: string,
    textCancel: string
  ) => {
    return new Promise<boolean>((resolve) => {
      setDialogData({
        title,
        description,
        icon,
        approve: textApprove,
        cancel: textCancel,
        resolve,
      });
      setOpenDialog(true);
    });
  };

  return (
    <AlertContext.Provider
      value={{
        AlertSuccess,
        AlertError,
        AlertApproveDelete,
      }}
    >
      {children}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          variant="filled"
          severity={snackbarType}
          onClose={() => setOpenSnackbar(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{dialogData?.title}</DialogTitle>

        <DialogContent>
          <Alert severity={dialogData?.icon}>{dialogData?.description}</Alert>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              dialogData?.resolve?.(false);
              setOpenDialog(false);
            }}
            sx={{
              textTransform: "none",
            }}
          >
            {dialogData?.cancel}
          </Button>

          <Button
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
            }}
            onClick={() => {
              dialogData?.resolve?.(true);
              setOpenDialog(false);
            }}
          >
            {dialogData?.approve}
          </Button>
        </DialogActions>
      </Dialog>
    </AlertContext.Provider>
  );
};
