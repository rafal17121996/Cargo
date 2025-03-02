import {
    Box,
    Typography,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
  } from "@mui/material";
  
  import PropTypes from "prop-types";
  import capitalizeFirstLetter from "../../hooks/helpers";
  
  function TemplateTourModal({
    onClose,
    onSubmit,
    editingTemplateTour,
    templateTourName,
    setTemplateTourName,
  }) {
    return (
      <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
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
            {editingTemplateTour ? "Edit Tour" : "Add New Tour"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Tour Name"
              value={capitalizeFirstLetter(templateTourName)}
              onChange={(e) => setTemplateTourName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />  
          </Box>
        </DialogContent>
        <DialogActions>
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
            type="submit"
            onClick={onSubmit}
            sx={{
              background: "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)",
              color: "white",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)",
              },
            }}
          >
            {editingTemplateTour ? "Save Changes" : "Create Tour"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  TemplateTourModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    editingTemplateTour: PropTypes.bool,
    templateTourName: PropTypes.string,
    setTemplateTourName: PropTypes.func,
  };
  
  export default TemplateTourModal;