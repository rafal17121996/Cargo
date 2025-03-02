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
import capitalizeFirstLetter from "../../hooks/helpers";

function UserModal({
  onClose,
  onSubmit,
  editingUser,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  username,
  setUsername,
  truck,
  setTruck,
  trailer,
  setTrailer,
  role,
  setRole,
  trucks,
  trailers,
  roles
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
          {editingUser ? "Edit User" : "Add New User"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
          {/* First Name */}
          <TextField
            fullWidth
            label="First Name"
            value={capitalizeFirstLetter(firstName)}
            onChange={(e) => setFirstName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          {/* Last Name */}
          <TextField
            fullWidth
            label="Last Name"
            value={capitalizeFirstLetter(lastName)}
            onChange={(e) => setLastName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          {/* Username */}
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          {/* Truck */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="truck-select-label">Truck</InputLabel>
            <Select
              labelId="truck-select-label"
              label="Truck"
              value={truck ? truck.id : ""}
              onChange={(e) => {
                const selectedTruck = trucks.find(t => t.id === e.target.value);
                setTruck(selectedTruck);
              }}
            >
              {trucks.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.plate.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Trailer */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="trailer-select-label">Trailer</InputLabel>
            <Select
              labelId="trailer-select-label"
              label="Trailer"
              value={trailer ? trailer.id : ""}
              onChange={(e) => {
                const selectedTrailer = trailers.find(t => t.id === e.target.value);
                setTrailer(selectedTrailer);
              }}
            >
              {trailers.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.plate.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl required fullWidth sx={{ mb: 2 }}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              label="Role"
              value={role ? role.id : ""}
              onChange={(e) => {
                const selectedRole = roles.find(r => r.id === e.target.value);
                setRole(selectedRole);
              }}
            >
              {roles.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
          {editingUser ? "Save Changes" : "Create User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UserModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editingUser: PropTypes.bool,
  firstName: PropTypes.string,
  setFirstName: PropTypes.func,
  lastName: PropTypes.string,
  setLastName: PropTypes.func,
  username: PropTypes.string,
  setUsername: PropTypes.func,
  password: PropTypes.string,
  setPassword: PropTypes.func,
  truck: PropTypes.string,
  setTruck: PropTypes.func,
  trailer: PropTypes.string,
  setTrailer: PropTypes.func,
  role: PropTypes.string,
  setRole: PropTypes.func,
  trucks: PropTypes.array,
  trailers: PropTypes.array,
  roles: PropTypes.array,
};

export default UserModal;