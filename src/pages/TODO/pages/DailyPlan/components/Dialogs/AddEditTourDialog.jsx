// src/components/DailyPlan/components/Dialogs/AddEditTourDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const AddEditTourDialog = ({
  open,
  onClose,
  tourData,
  drivers,
  onChange,
  onSubmit,
  mode = "add",
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {mode === "add" ? "Add New Tour" : "Edit Daily Tour"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tour Name"
          fullWidth
          value={tourData?.name || ""}
          onChange={(e) => onChange("name", e.target.value)}
        />
        <TextField
          margin="dense"
          label="Driver"
          select
          fullWidth
          value={tourData?.driver_id || ""}
          onChange={(e) => {
            const value = e.target.value;
            const driverId = value ? parseInt(value) : null;
            const selectedDriver = drivers.find((d) => d.id === driverId);

            onChange("driver_id", driverId);
            onChange("truck", selectedDriver?.truck || "");
            onChange("trailer", selectedDriver?.trailer || "");
          }}
        >
          <MenuItem value="">No driver</MenuItem>
          {drivers.map((driver) => (
            <MenuItem key={driver.id} value={driver.id}>
              {driver.first_name} {driver.last_name}
            </MenuItem>
          ))}
        </TextField>
        {tourData?.driver_id && (
          <>
            <TextField
              margin="dense"
              label="Truck Plate"
              fullWidth
              value={tourData?.truck || ""}
              onChange={(e) => onChange("truck", e.target.value)}
            />
            <TextField
              margin="dense"
              label="Trailer Plate"
              fullWidth
              value={tourData?.trailer || ""}
              onChange={(e) => onChange("trailer", e.target.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onSubmit}
          sx={{
            background: "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)",
            color: "white",
            "&:hover": { boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)" },
          }}
        >
          {mode === "add" ? "Add" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditTourDialog;
