import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import PropTypes from "prop-types";

function TemplateTourStopModal({
  onClose,
  onSubmit,
  editingTemplateTourStop,
  stopClient,
  setStopClient,
  stopPlannedArrival,
  setStopPlannedArrival,
  stopPlannedDeparture,
  setStopPlannedDeparture,
  stopWb1,
  setStopWb1,
  stopWb2,
  setStopWb2,
  clients,
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
          {editingTemplateTourStop ? "Edit Stop" : "Add New Stop"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
          <FormControl required fullWidth sx={{ mb: 2 }}>
            <InputLabel id="client-select-label">Client</InputLabel>
            <Select
              labelId="client-select-label"
              label="Client"
              value={stopClient ? stopClient.id : ""}
              onChange={(e) => {
                const selectedClient = clients.find(
                  (c) => c.id === e.target.value
                );
                setStopClient(selectedClient);
              }}
            >
              {clients.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Planned Arrival"
            type="time"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true, // Forces the label to always be above the input
            }}
            value={stopPlannedArrival}
            onChange={(e) => setStopPlannedArrival(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Planned Departure"
            type="time"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true, // Forces the label to always be above the input
            }}
            value={stopPlannedDeparture}
            onChange={(e) => setStopPlannedDeparture(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="WB 1"
            value={stopWb1}
            onChange={(e) => setStopWb1(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="WB 2"
            value={stopWb2}
            onChange={(e) => setStopWb2(e.target.value)}
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
          {editingTemplateTourStop ? "Save Changes" : "Create Stop"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

TemplateTourStopModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editingTemplateTourStop: PropTypes.bool,
  stopClient: PropTypes.object,
  setStopClient: PropTypes.func,
  stopPlannedArrival: PropTypes.string,
  setStopPlannedArrival: PropTypes.func,
  stopPlannedDeparture: PropTypes.string,
  setStopPlannedDeparture: PropTypes.func,
  stopWb1: PropTypes.string,
  setStopWb1: PropTypes.func,
  stopWb2: PropTypes.string,
  setStopWb2: PropTypes.func,
  clients: PropTypes.array,
};

export default TemplateTourStopModal;
