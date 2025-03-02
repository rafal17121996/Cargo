// src/components/DailyPlan/components/Dialogs/AddEditStopDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Grid
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const AddEditStopDialog = ({
  open,
  onClose,
  stopData,
  clients,
  onChange,
  onSubmit,
  onOpenClientModal
}) => {
  const handleTimeChange = (field, value) => {
    onChange(field, value ? `${value}:00` : null);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{stopData?.id ? "Edit Stop" : "Add New Stop"}</DialogTitle>
      <DialogContent dividers>
        <TextField
          select
          fullWidth
          margin="dense"
          label="Client"
          value={stopData?.client_id || ""}
          onChange={(e) => onChange('client_id', e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={onOpenClientModal} size="small">
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        >
          {clients.map((client) => (
            <MenuItem key={client.id} value={client.id}>
              {client.name}
            </MenuItem>
          ))}
        </TextField>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {['planned_arrival', 'planned_departure', 'actual_arrival', 'actual_departure'].map((field) => (
            <Grid item xs={6} key={field}>
              <TextField
                fullWidth
                margin="dense"
                label={field.replace(/_/g, ' ').toUpperCase()}
                type="time"
                InputLabelProps={{ shrink: true }}
                value={stopData?.[field]?.substring(0, 5) || ''}
                onChange={(e) => handleTimeChange(field, e.target.value)}
              />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {['arrival_container1', 'arrival_container2', 'departure_container1', 'departure_container2'].map((field) => (
            <Grid item xs={6} key={field}>
              <TextField
                fullWidth
                margin="dense"
                label={field.replace(/_/g, ' ').toUpperCase()}
                value={stopData?.[field] || ''}
                onChange={(e) => onChange(field, e.target.value)}
              />
            </Grid>
          ))}
        </Grid>

        <TextField
          fullWidth
          margin="dense"
          label="Additional Info"
          multiline
          rows={3}
          value={stopData?.additional_info || ''}
          onChange={(e) => onChange('additional_info', e.target.value)}
        />

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {['wb1', 'wb2'].map((field) => (
            <Grid item xs={6} key={field}>
              <TextField
                fullWidth
                margin="dense"
                label={field.toUpperCase()}
                value={stopData?.[field] || ''}
                onChange={(e) => onChange(field, e.target.value)}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained">
          {stopData?.id ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditStopDialog;