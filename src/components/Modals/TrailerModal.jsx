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
  
  function TrailerModal({
    onClose,
    onSubmit,
    editingTrailer,
    trailerPlate,
    setTrailerPlate
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
            {editingTrailer ? "Edit Trailer" : "Add New Trailer"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Trailer Name"
              value={capitalizeFirstLetter(trailerPlate)}
              onChange={(e) => setTrailerPlate(e.target.value)}
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
            {editingTrailer ? "Save Changes" : "Create Trailer"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  TrailerModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    editingTrailer: PropTypes.bool,
    trailerPlate: PropTypes.string,
    setTrailerPlate: PropTypes.func,
  };
  
  export default TrailerModal;