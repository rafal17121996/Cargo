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
  
  function TruckModal({
    onClose,
    onSubmit,
    editingTruck,
    truckPlate,
    setTruckPlate
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
            {editingTruck ? "Edit Truck" : "Add New Truck"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Truck Name"
              value={capitalizeFirstLetter(truckPlate)}
              onChange={(e) => setTruckPlate(e.target.value)}
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
            {editingTruck ? "Save Changes" : "Create Truck"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  TruckModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    editingTruck: PropTypes.bool,
    truckPlate: PropTypes.string,
    setTruckPlate: PropTypes.func,
  };
  
  export default TruckModal;