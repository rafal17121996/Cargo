import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import ClientTable from "../components/Tables/ClientTable";
import ClientModal from "../components/Modals/ClientModal";
import AddIcon from "@mui/icons-material/Add";
import ConfirmationDialog from "../components/Dialogs/ConfirmationDialog";
import { useClientActions } from "../hooks/useClientActions";
import { useClientsData } from "../hooks/useClientsData";

function Clients() {
  const { fetchClients, setClients, clients } = useClientsData();

  const [deleteClientId, setDeleteClientId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState(null);

  const [clientName, setClientName] = useState("");
  const [clientStreet, setClientStreet] = useState("");
  const [clientHouseNumber, setClientHouseNumber] = useState("");
  const [clientPostalCode, setClientPostalCode] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [clientCountry, setClientCountry] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { handleSave, confirmDelete } = useClientActions(setClients);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleAddClient = () => {
    setEditingClient(null);
    setClientName("");
    setClientStreet("");
    setClientHouseNumber("");
    setClientPostalCode("");
    setClientCity("");
    setClientCountry("");
    setModalOpen(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setClientName(client.name);
    setClientStreet(client.street);
    setClientHouseNumber(client.house_number);
    setClientPostalCode(client.postal_code);
    setClientCity(client.city);
    setClientCountry(client.country);
    setModalOpen(true);
  };

  const handleDeleteClient = async (id) => {
    setDeleteClientId(id);
    setDeleteConfirmOpen(true);
  };

  const filteredClients = clients.filter((r) => {
    const q = searchTerm.toLowerCase();
    const clientName = `${r.name}`.toLowerCase();
    return clientName.includes(q);
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
          Clients
        </Typography>
        <TextField
          fullWidth
          variant="filled"
          size="small"
          label="Search Clients"
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
          onClick={handleAddClient}
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
          New Client
        </Button>
      </Box>

      <ClientTable
        clients={filteredClients}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
      />

      {modalOpen && (
        <ClientModal
          onClose={() => setModalOpen(false)}
          onSubmit={(e) => {
            e.preventDefault();
            const clientData = {
              name: clientName,
              street: clientStreet,
              house_number: clientHouseNumber,
              postal_code: clientPostalCode,
              city: clientCity,
              country: clientCountry,
            };
            handleSave(editingClient, clientData);
            setModalOpen(false);
          }}
          editingClient={editingClient}
          clientName={clientName}
          setClientName={setClientName}
          clientStreet={clientStreet}
          setClientStreet={setClientStreet}
          clientHouseNumber={clientHouseNumber}
          setClientHouseNumber={setClientHouseNumber}
          clientPostalCode={clientPostalCode}
          setClientPostalCode={setClientPostalCode}
          clientCity={clientCity}
          setClientCity={setClientCity}
          clientCountry={clientCountry}
          setClientCountry={setClientCountry}
        />
      )}

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() =>
          confirmDelete(deleteClientId) && setDeleteConfirmOpen(false)
        }
        title="Confirm Delete"
        message="Are you sure you want to delete this client?"
      />
    </Box>
  );
}

export default Clients;
