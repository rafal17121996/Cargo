import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ConfirmationDialog from "../components/Dialogs/ConfirmationDialog";
import { useTruckData } from "../hooks/useTrucksData";
import { useTruckActions } from "../hooks/useTruckActions";
import TruckModal from "../components/Modals/Truckmodal";
import TruckTable from "../components/Tables/TruckTable";

function Trucks() {
  const {
    fetchTrucks,
    setTrucks,
    trucks,
  } = useTruckData();

  const [deleteTruckId, setDeleteTruckId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTruck, setEditingTruck] = useState(null);

  const [truckPlate, setTruckPlate] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);


  const { handleSave, confirmDelete } = useTruckActions(
    setTrucks,
  );

  useEffect(() => {
    fetchTrucks();
  }, [fetchTrucks]);

  const handleAddTruck = () => {
    setEditingTruck(null);
    setTruckPlate("");
    setModalOpen(true);
  };

  const handleEditTruck = (truck) => {
    setEditingTruck(truck);
    setTruckPlate(truck.plate);
    setModalOpen(true);
  };

  const handleDeleteTruck= async (id) => {
    setDeleteTruckId(id);
    setDeleteConfirmOpen(true);
  };

  const filteredTrucks = trucks.filter((t) => {
    const q = searchTerm.toLowerCase();
    const truckPlate = `${t.plate}`.toLowerCase();
    return truckPlate.includes(q);
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
          Trucks
        </Typography>
        <TextField
          fullWidth
          variant="filled"
          size="small"
          label="Search Trucks"
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
          onClick={handleAddTruck}
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
          New Truck
        </Button>
      </Box>

      <TruckTable
        trucks={filteredTrucks}
        onEdit={handleEditTruck}
        onDelete={handleDeleteTruck}
      />

      {modalOpen && (
        <TruckModal
          onClose={() => setModalOpen(false)}
          onSubmit={(e) => {
            e.preventDefault();
            const truckData = {
              plate: truckPlate
            };
            handleSave(editingTruck, truckData);
            setModalOpen(false);
          }}
          editingTruck={editingTruck}
          truckPlate={truckPlate}
          setTruckPlate={setTruckPlate}
        />
      )}

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() =>
          confirmDelete(deleteTruckId) && setDeleteConfirmOpen(false)
        }
        title="Confirm Delete"
        message="Are you sure you want to delete this truck?"
      />

    </Box>
  );
}

export default Trucks;
