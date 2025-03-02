import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Grid,
  IconButton,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import UserTable from "../components/Tables/UserTable";
import UserModal from "../components/Modals/UserModal";
import AddIcon from "@mui/icons-material/Add";
import TempPasswordModal from "../components/Modals/TempPasswordModal";
import ConfirmationDialog from "../components/Dialogs/ConfirmationDialog";
import LastLoginsTable from "../components/Tables/LastLoginTable";
import UserLoginsTable from "../components/Tables/UserLoginTable";
import capitalizeFirstLetter from "../hooks/helpers";
import { useUsersData } from "../hooks/useUsersData";
import { useLoginData } from "../hooks/useLoginData";
import { useUserActions } from "../hooks/UseUserActions";
import CloseIcon from "@mui/icons-material/Close";

function Users() {
  const {
    fetchUsers,
    fetchDropdownData,
    fetchLastLogins,
    setUsers,
    users,
    trucks,
    trailers,
    roles,
    lastLogins,
  } = useUsersData();

  const { handleUserSelect, selectedUserLogins, selectedUserId } =
    useLoginData();

  const [tempPassword, setTempPassword] = useState("");
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [tempPasswordOpen, setTempPasswordOpen] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [truck, setTruck] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [role, setRole] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const { handleSave, confirmDelete, confirmPasswordReset } = useUserActions(
    setUsers,
    setTempPassword,
    setResetConfirmOpen,
    setTempPasswordOpen
  );

  const handleResetPassword = (user) => {
    setResetUser(user);
    setResetConfirmOpen(true);
  };

  useEffect(() => {
    fetchUsers();
    fetchDropdownData();
    fetchLastLogins();
  }, [fetchDropdownData, fetchUsers, fetchLastLogins]);

  const handleAddUser = () => {
    setEditingUser(null);
    setFirstName("");
    setLastName("");
    setUsername("");
    setTruck(null);
    setTrailer(null);
    setRole(null);
    setModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setUsername(user.username);
    setTruck(user.truck);
    setTrailer(user.trailer);
    setRole(user.role);
    setModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    setDeleteUserId(id);
    setDeleteConfirmOpen(true);
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
    return fullName.includes(q);
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Top Section (Matching Tours.jsx) */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: 2,
          backgroundColor: "background.paper",
          boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0px 12px 30px rgba(149, 157, 165, 0.3)",
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #4f46e5 30%, #ec4899 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            flexGrow: 1,
          }}
        >
          Users
        </Typography>
        <TextField
          fullWidth
          variant="filled"
          size="small"
          label="Search Users"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 3,
              "&:before, &:after": { border: "none" },
              "&:hover": { backgroundColor: "action.hover" },
            },
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ maxWidth: 400 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 20 }} />}
          onClick={handleAddUser}
          sx={{
            minWidth: 120,
            borderRadius: 3,
            textTransform: "none",
            background: "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)",
            fontWeight: 600,
            letterSpacing: 0.5,
            py: 1,
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)",
            },
          }}
        >
          New User
        </Button>
      </Box>

      {/* User Table */}
      <UserTable
        users={filteredUsers}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onResetPassword={handleResetPassword}
      />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 700,
              background: "linear-gradient(45deg, #4f46e5 30%, #ec4899 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Last User Logins
          </Typography>
          <LastLoginsTable
            logins={lastLogins}
            onRowClick={handleUserSelect}
            users={users}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              justifyContent: "space-between",
            }}
          >
            <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
        background: "linear-gradient(45deg, #4f46e5 30%, #ec4899 90%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
              {selectedUserId
                ? `Login History for ${
                    users.find((u) => u.id === selectedUserId)?.username
                  }`
                : "Select a User"}
            </Typography>
            {selectedUserId && (
              <IconButton
                onClick={() => handleUserSelect(null)}
                size="small"
                sx={{ ml: 1 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <UserLoginsTable logins={selectedUserLogins} />
        </Grid>
      </Grid>

      {/* User Modal */}
      {modalOpen && (
        <UserModal
          onClose={() => setModalOpen(false)}
          onSubmit={(e) => {
            e.preventDefault();
            const userData = {
              first_name: firstName,
              last_name: lastName,
              username: username,
              truck_id: truck?.id,
              trailer_id: trailer?.id,
              role_id: role?.id,
            };
            handleSave(editingUser, userData);
            setModalOpen(false);
          }}
          editingUser={editingUser}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          username={username}
          setUsername={setUsername}
          truck={truck}
          setTruck={setTruck}
          trailer={trailer}
          setTrailer={setTrailer}
          role={role}
          setRole={setRole}
          trucks={trucks}
          trailers={trailers}
          roles={roles}
        />
      )}

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() =>
          confirmDelete(deleteUserId) && setDeleteConfirmOpen(false)
        }
        title="Confirm Delete"
        message="Are you sure you want to delete this user?"
      />
      <ConfirmationDialog
        open={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={() => confirmPasswordReset(resetUser)}
        title="Confirm Password Reset"
        message={`Reset password for ${capitalizeFirstLetter(
          resetUser?.first_name
        )} ${capitalizeFirstLetter(resetUser?.last_name)}?`}
      />

      <TempPasswordModal
        open={tempPasswordOpen}
        onClose={() => setTempPasswordOpen(false)}
        tempPassword={tempPassword}
      />
    </Box>
  );
}

export default Users;
