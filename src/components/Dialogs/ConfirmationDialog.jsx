import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

function ConfirmationDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #4f46e5 30%, #ec4899 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "text.primary",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            background: "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)",
            color: "white",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)",
            },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default ConfirmationDialog;
