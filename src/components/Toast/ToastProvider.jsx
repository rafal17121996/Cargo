import { useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";
import { ToastContext } from "../../contexts/ToastContext";
import PropTypes from "prop-types";

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = useCallback((message, severity = "success") => {
    setToast({ open: true, message, severity });
  }, []);

  const handleClose = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} 
        sx={{
          mt: 0, 
          "& .MuiAlert-root": {
            width: "100%",
            maxWidth: "400px", 
            mx: "auto", 
            boxShadow: 3,
            alignItems: "center",
          },
        }}
      >
        <Alert
          onClose={handleClose}
          severity={toast.severity}
          variant="filled"
          sx={{
            ".MuiAlert-message": {
              fontWeight: 500,
              textAlign: "center",
            },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
