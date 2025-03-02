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
  
  function ClientModal({
    onClose,
    onSubmit,
    editingClient,
    clientName,
    setClientName,
    clientStreet,
    setClientStreet,
    clientHouseNumber,
    setClientHouseNumber,
    clientPostalCode,
    setClientPostalCode,
    clientCity,
    setClientCity,
    clientCountry,
    setClientCountry
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
            {editingClient ? "Edit Client" : "Add New Client"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Client Name"
              value={capitalizeFirstLetter(clientName)}
              onChange={(e) => setClientName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />  
            <TextField
              fullWidth
              label="Street"
              value={capitalizeFirstLetter(clientStreet)}
              onChange={(e) => setClientStreet(e.target.value)}
              sx={{ mb: 2 }}
            />  
          </Box>
          <TextField
              fullWidth
              label="House Number"
              value={clientHouseNumber}
              onChange={(e) => setClientHouseNumber(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Postal Code"
                value={clientPostalCode}
                onChange={(e) => setClientPostalCode(e.target.value)}
                sx={{ mb: 2 }}  
            />
            <TextField
                fullWidth
                label="City"
                value={capitalizeFirstLetter(clientCity)}
                onChange={(e) => setClientCity(e.target.value)}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth   
                label="Country"
                value={capitalizeFirstLetter(clientCountry)}
                onChange={(e) => setClientCountry(e.target.value)}
                sx={{ mb: 2 }}
            />
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
            {editingClient ? "Save Changes" : "Create Client"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  ClientModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    editingClient: PropTypes.bool,
    clientName: PropTypes.string,
    setClientName: PropTypes.func,
    clientStreet: PropTypes.string,
    setClientStreet: PropTypes.func,
    clientHouseNumber: PropTypes.string,
    setClientHouseNumber: PropTypes.func,
    clientPostalCode: PropTypes.string,
    setClientPostalCode: PropTypes.func,
    clientCity: PropTypes.string,
    setClientCity: PropTypes.func,
    clientCountry: PropTypes.string,
    setClientCountry: PropTypes.func
  };
  
  export default ClientModal;