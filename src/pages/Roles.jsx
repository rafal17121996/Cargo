import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import RoleTable from "../components/Tables/RoleTable";
import RoleModal from "../components/Modals/RoleModal";
import AddIcon from "@mui/icons-material/Add";
import ConfirmationDialog from "../components/Dialogs/ConfirmationDialog";
import { useRoleActions } from "../hooks/useRoleActions";
import { useRolesData } from "../hooks/useRolesData";

function Roles() {
  const {
    fetchRoles,
    setRoles,
    roles,
  } = useRolesData();

  const [deleteRoleId, setDeleteRoleId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRole, setEditingRole] = useState(null);

  const [roleName, setRoleName] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);


  const { handleSave, confirmDelete } = useRoleActions(
    setRoles,
  );

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleAddRole = () => {
    setEditingRole(null);
    setRoleName("");
    setModalOpen(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setModalOpen(true);
  };

  const handleDeleteRole= async (id) => {
    setDeleteRoleId(id);
    setDeleteConfirmOpen(true);
  };

  const filteredRoles = roles.filter((r) => {
    const q = searchTerm.toLowerCase();
    const roleName = `${r.name}`.toLowerCase();
    return roleName.includes(q);
  });

  return (
    <Box sx={{ p: 3 }}>
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
          Roles
        </Typography>
        <TextField
          fullWidth
          variant="filled"
          size="small"
          label="Search Roles"
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
          onClick={handleAddRole}
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
          New Role
        </Button>
      </Box>

      <RoleTable
        roles={filteredRoles}
        onEdit={handleEditRole}
        onDelete={handleDeleteRole}
      />

      {modalOpen && (
        <RoleModal
          onClose={() => setModalOpen(false)}
          onSubmit={(e) => {
            e.preventDefault();
            const roleData = {
              name: roleName
            };
            handleSave(editingRole, roleData);
            setModalOpen(false);
          }}
          editingRole={editingRole}
          roleName={roleName}
          setRoleName={setRoleName}
        />
      )}

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() =>
          confirmDelete(deleteRoleId) && setDeleteConfirmOpen(false)
        }
        title="Confirm Delete"
        message="Are you sure you want to delete this role?"
      />

    </Box>
  );
}

export default Roles;
