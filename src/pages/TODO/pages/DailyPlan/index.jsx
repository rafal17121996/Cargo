// src/components/DailyPlan/index.jsx
import React, { useState, useCallback } from "react";
import { Grid, Box, Typography, TextField, Button } from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import TourCard from "./components/TourCard";
import AddEditTourDialog from "./components/Dialogs/AddEditTourDialog";
import AddEditStopDialog from "./components/Dialogs/AddEditStopDialog";
import ClientModal from "./components/Dialogs/ClientModal";
import useTours from "./hooks/useTours";
import useClients from "./hooks/useClients";
import useDrivers from "./hooks/useDrivers";
import api from '../../../../api/api';

const DailyPlan = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [addingStop, setAddingStop] = useState(null);
  const [editingStop, setEditingStop] = useState(null);
  const [newStopData, setNewStopData] = useState({
    client_id: "",
    planned_arrival: "",
    planned_departure: "",
    actual_arrival: "",
    actual_departure: "",
    arrival_container1: "",
    arrival_container2: "",
    departure_container1: "",
    departure_container2: "",
    additional_info: "",
    wb1: "",
    wb2: "",
  });

  const {
    dailyTours,
    editingTour,
    addingTour,
    newTourData,
    setEditingTour,
    setAddingTour,
    setNewTourData,
    handleAddTour,
    handleEditTour,
    handleDeleteTour,
    fetchDailyTours,
    handleDeleteStop,
  } = useTours(selectedDate);

  const { clients, clientModalOpen, setClientModalOpen, fetchClients } =
    useClients();
  const { drivers } = useDrivers();

  const handleAddStop = useCallback(async () => {
    try {
      const response = await api.post(
        `/tours/${addingStop}/clients`,
        newStopData
      );
      await fetchDailyTours();
      setAddingStop(null);
      setNewStopData({
        /* reset data */
      });
    } catch (error) {
      console.error("Error adding stop:", error);
    }
  }, [addingStop, newStopData, fetchDailyTours]);

  const handleEditStop = useCallback(async () => {
    try {
      await api.put(`/tours/clients/${editingStop.id}`, editingStop);
      await fetchDailyTours();
      setEditingStop(null);
    } catch (error) {
      console.error("Error updating stop:", error);
    }
  }, [editingStop, fetchDailyTours]);

  const handleEditClient = useCallback((client) => {
    setSelectedClient(client);
    setClientModalOpen(true);
  }, []);

  const handleMoveStop = useCallback(
    async (tourId, stopId, direction) => {
      // ... existing move logic ...
    },
    [dailyTours, fetchDailyTours]
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
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
          Daily Tours
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            sx={{ maxWidth: 200 }}
          />
          <Button
            variant="contained"
            onClick={fetchDailyTours}
            sx={{
              minWidth: 120,
              borderRadius: 3,
              textTransform: "none",
              background: "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)",
              },
            }}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            onClick={() => setAddingTour(true)}
            sx={{
              minWidth: 120,
              borderRadius: 3,
              textTransform: "none",
              background: "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)",
              },
            }}
            startIcon={<AddIcon />}
          >
            Add Tour
          </Button>
        </Box>
      </Box>

      {/* Tours Grid */}
      <Grid container spacing={3}>
        {dailyTours.map((tour) => (
          <Grid item xs={12} sm={6} md={4} key={tour.id}>
            <TourCard
              tour={tour}
              drivers={drivers}
              clients={clients}
              onEditTour={setEditingTour}
              onDeleteTour={handleDeleteTour}
              onAddStop={setAddingStop}
              onEditStop={setEditingStop}
              onDeleteStop={handleDeleteStop}
              onMoveStop={handleMoveStop}
              onEditClient={handleEditClient}
            />
          </Grid>
        ))}
      </Grid>

      {/* Dialogs */}
      <AddEditTourDialog
        open={addingTour || !!editingTour}
        onClose={() => {
          setAddingTour(false);
          setEditingTour(null);
        }}
        tourData={editingTour || newTourData}
        drivers={drivers}
        onChange={(field, value) =>
          editingTour
            ? setEditingTour((prev) => ({ ...prev, [field]: value }))
            : setNewTourData((prev) => ({ ...prev, [field]: value }))
        }
        onSubmit={editingTour ? handleEditTour : handleAddTour}
        mode={editingTour ? "edit" : "add"}
      />

      <AddEditStopDialog
        open={!!addingStop || !!editingStop}
        onClose={() => {
          setAddingStop(null);
          setEditingStop(null);
        }}
        stopData={editingStop || newStopData}
        clients={clients}
        onChange={(field, value) =>
          editingStop
            ? setEditingStop((prev) => ({ ...prev, [field]: value }))
            : setNewStopData((prev) => ({ ...prev, [field]: value }))
        }
        onSubmit={editingStop ? handleEditStop : handleAddStop}
        onOpenClientModal={() => setClientModalOpen(true)}
      />

      <ClientModal
        open={clientModalOpen}
        onClose={() => {
          setClientModalOpen(false);
          setSelectedClient(null);
        }}
        onSubmit={async (clientData) => {
          try {
            if (selectedClient) {
              await api.put(`/clients/${selectedClient.id}`, clientData);
            } else {
              await api.post("/clients", clientData);
            }
            fetchClients();
          } catch (error) {
            console.error("Error saving client:", error);
          }
        }}
        editingClient={selectedClient}
      />
    </Box>
  );
};

export default DailyPlan;
