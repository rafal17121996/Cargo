import React, { useEffect, useState, useCallback } from "react";
import api from "../../../../../api/api";
import ClientModal from "../../Clients/ClientsModal";
import Grid from "@mui/material/Grid2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RvHookupIcon from "@mui/icons-material/RvHookup";
import TemplateSelectionDialog from "../../DailyPlan/TemplateSelectionDialog";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Paper,
  MenuItem,
  Chip,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Info as InfoIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

// Updated Color Generation Helpers
const getBaseHue = (id) => {
  let hash = 0;
  const str = id.toString();
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

const renderClientAddress = (client) => {
  if (!client) return "";
  return `${client.street || ""} ${client.haus_number || ""}, ${
    client.postal_code || ""
  } ${client.city || ""}, ${client.country || ""}`;
};

const DailyPlan = () => {
  // State for daily tours, clients, date, and modal/form handling
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [dailyTours, setDailyTours] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [editingStop, setEditingStop] = useState(null);
  const [editingTour, setEditingTour] = useState(null);
  const [addingStop, setAddingStop] = useState(null);
  const [addingTour, setAddingTour] = useState(false);
  const [drivers, setDrivers] = useState([]);
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
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientStreet, setClientStreet] = useState("");
  const [clientHausNumber, setClientHausNumber] = useState("");
  const [clientPostalCode, setClientPostalCode] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [clientCountry, setClientCountry] = useState("");

  const fetchDailyTours = useCallback(async () => {
    try {
      const response = await api.get("/tours", {
        params: {
          date: selectedDate,
          expand: "driver",
        },
      });
      const sortedTours = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date) || a.id - b.id
      );
      setDailyTours(sortedTours);
    } catch (error) {
      console.error("Error fetching daily tours:", error);
      setDailyTours([]);
    }
  }, [selectedDate]);

  const fetchTourTemplates = useCallback(async () => {
    try {
      const response = await api.get("/tour-templates");
      setAvailableTemplates(response.data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  }, []);

  const handleCreateFromTemplates = useCallback(async () => {
    try {
      // Process each template, allowing individual failures
      const results = await Promise.all(
        selectedTemplates.map(async (template) => {
          try {
            // Create tour payload
            const tourPayload = {
              name: template.editedName || template.name,
              date: selectedDate,
              tour_template_id: template.id,
              driver_id: template.driver_id || null,
            };
  
            // Create tour
            const { data: newTour } = await api.post("/tours", tourPayload);
  
            // Copy stops with validation
            if (template.stops?.length) {
              await Promise.all(
                template.stops.map(async (stop) => {
                  const stopPayload = {
                    client_id: stop.client_id,
                    planned_arrival: stop.planned_arrival || null,
                    planned_departure: stop.planned_departure || null,
                    order: stop.order || 0,
                    wb1: stop.wb1 || "",
                    wb2: stop.wb2 || "",
                  };
                  return api.post(`/tours/${newTour.id}/clients`, stopPayload);
                })
              );
            }
  
            // Update driver if specified
            if (template.driver_id) {
              const driver = drivers.find((d) => d.id === template.driver_id);
              if (driver) {
                await api.patch(`/users/${template.driver_id}`, {
                  truck: template.truck || driver.truck,
                  trailer: template.trailer || driver.trailer,
                });
              }
            }
  
            return { success: true };
          } catch (error) {
            console.error("Error processing template:", {
              error: error.response?.data || error.message,
              template,
              stopPayload
            });
            return { error: error.message };
          }
        })
      );
  
      // Check for any errors and notify
      const errors = results.filter((result) => result.error);
      if (errors.length > 0) {
        alert(`Some tours could not be created. See console for details.`);
      }
    } catch (error) {
      console.error("Template creation failed:", error);
      alert(`Error creating tours: ${error.response?.data?.detail || error.message}`);
    } finally {
      // Always fetch the latest tours and reset state
      await fetchDailyTours();
      setTemplateDialogOpen(false);
      setSelectedTemplates([]);
    }
  }, [selectedTemplates, selectedDate, drivers, fetchDailyTours]);
  const fetchClients = useCallback(async () => {
    try {
      const response = await api.get("/clients/");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  }, []);

  useEffect(() => {
    fetchDailyTours();
    fetchClients();
  }, [fetchDailyTours, fetchClients]);

  const [newTourData, setNewTourData] = useState({
    name: "",
    date: selectedDate,
    tour_template_id: "",
    driver_id: "",
    truck: "",
    trailer: "",
  });

  const fetchDrivers = useCallback(async () => {
    try {
      const response = await api.get("/users/");
      setDrivers(response.data.filter((user) => !user.is_dispatcher));
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  }, []);

  useEffect(() => {
    fetchDailyTours();
    fetchClients();
    fetchDrivers();
  }, [fetchDailyTours, fetchClients, fetchDrivers]);

  const handleAddTour = useCallback(async () => {
    try {
      const tourPayload = {
        name: newTourData.name,
        date: newTourData.date || selectedDate,
        tour_template_id: newTourData.tour_template_id || null,
        driver_id: newTourData.driver_id || null,
      };

      // First create the tour
      const response = await api.post("/tours", tourPayload);

      // Then update driver if needed
      if (newTourData.driver_id) {
        const driver = drivers.find((d) => d.id === newTourData.driver_id);
        if (driver) {
          const driverPayload = {
            username: driver.username,
            first_name: driver.first_name,
            last_name: driver.last_name,
            is_dispatcher: driver.is_dispatcher,
            truck: newTourData.truck || "",
            trailer: newTourData.trailer || "",
          };
          await api.put(`/users/${newTourData.driver_id}`, driverPayload);
        }
      }
      await fetchDailyTours();

      setAddingTour(false);
      setNewTourData({
        name: "",
        date: selectedDate,
        tour_template_id: "",
        driver_id: "",
        truck: "",
        trailer: "",
      });
    } catch (error) {
      console.error("Error adding tour:", error);
    }
  }, [newTourData, selectedDate, drivers]);

  const handleEditTour = useCallback(async () => {
    try {
      const tourPayload = {
        name: editingTour.name,
        driver_id:
          editingTour.driver_id !== null ? editingTour.driver_id : null,
        date: editingTour.date,
        tour_template_id: editingTour.tour_template_id,
      };

      // Update tour
      await api.put(`/tours/${editingTour.id}`, tourPayload);

      // Update driver's truck/trailer if driver exists
      if (editingTour.driver_id) {
        const driver = drivers.find((d) => d.id === editingTour.driver_id);
        if (driver) {
          const driverPayload = {
            username: driver.username,
            first_name: driver.first_name,
            last_name: driver.last_name,
            is_dispatcher: driver.is_dispatcher,
            truck: editingTour.truck || "",
            trailer: editingTour.trailer || "",
          };
          await api.put(`/users/${editingTour.driver_id}`, driverPayload);
        }
      }

      // Refresh data
      await fetchDailyTours();
      setEditingTour(null);
    } catch (error) {
      console.error("Error updating tour:", error);
    }
  }, [editingTour, drivers, fetchDailyTours]);

  const handleDeleteTour = useCallback(
    async (tourId) => {
      try {
        await api.delete(`/tours/${tourId}`);
        fetchDailyTours();
      } catch (error) {
        console.error("Error deleting tour:", error);
      }
    },
    [fetchDailyTours]
  );

  const handleAddStop = useCallback(async () => {
    try {
      const tour = dailyTours.find((t) => t.id === addingStop);
      const nextOrder =
        tour && tour.clients && tour.clients.length > 0
          ? Math.max(...tour.clients.map((s) => s.order || 0)) + 1
          : 0;
      const newStopPayload = {
        ...newStopData,
        order: nextOrder,
        client_id: parseInt(newStopData.client_id, 10), // Ensure client_id is a number
      };
      const response = await api.post(
        `/tours/${addingStop}/clients`,
        newStopPayload
      );
      const clientData = clients.find(
        (c) => c.id === parseInt(newStopData.client_id, 10)
      );
      const newStop = { ...response.data, client: clientData };
      setDailyTours((prevTours) =>
        prevTours.map((t) =>
          t.id === addingStop
            ? { ...t, clients: [...(t.clients || []), newStop] }
            : t
        )
      );
      setAddingStop(null);
      setNewStopData({
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
    } catch (error) {
      console.error("Error adding stop:", error);
    }
  }, [addingStop, newStopData, dailyTours, clients]);

  const handleEditStop = useCallback(async () => {
    try {
      await api.put(`/tours/clients/${editingStop.id}`, editingStop);
      setEditingStop(null);
      fetchDailyTours();
    } catch (error) {
      console.error("Error updating stop:", error);
    }
  }, [editingStop, fetchDailyTours]);

  const handleDeleteStop = useCallback(
    async (stopId, tourId) => {
      try {
        await api.delete(`/tours/clients/${stopId}`);
        fetchDailyTours();
      } catch (error) {
        console.error("Error deleting stop:", error);
      }
    },
    [fetchDailyTours]
  );

  const handleMoveStop = useCallback(
    async (tourId, stopId, direction) => {
      try {
        const tour = dailyTours.find((t) => t.id === tourId);
        if (!tour) return;

        const stops = [...tour.clients].sort((a, b) => a.order - b.order);
        const currentIndex = stops.findIndex((s) => s.id === stopId);
        const newIndex =
          direction === "up" ? currentIndex - 1 : currentIndex + 1;

        if (newIndex < 0 || newIndex >= stops.length) return;

        [stops[currentIndex], stops[newIndex]] = [
          stops[newIndex],
          stops[currentIndex],
        ];

        const orderUpdates = stops.map((stop, index) => ({
          id: stop.id,
          order: index,
        }));

        await api.put(`/tours/${tourId}/clients/order`, orderUpdates);
        await fetchDailyTours();
      } catch (error) {
        console.error("Error moving stop:", error);
      }
    },
    [dailyTours, fetchDailyTours]
  );

  return (
    <Box sx={{ padding: 3 }}>
      {/* Updated Header Section */}
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
        <TextField
          label="Select Date"
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
            fontWeight: 600,
            letterSpacing: 0.5,
            py: 1,
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)",
            },
          }}
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
            fontWeight: 600,
            letterSpacing: 0.5,
            py: 1,
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)",
            },
          }}
        >
          Add Tour
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            fetchTourTemplates();
            setTemplateDialogOpen(true);
          }}
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
          Load from Template
        </Button>
      </Box>

      <Grid container spacing={2}>
        {dailyTours.map((tour) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={tour.id}>
            <Card
              sx={{
                height: "100%",
                maxWidth: 300,
                borderRadius: 3,
                background: "linear-gradient(145deg, #ffffff, #f9f9f9)",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        background:
                          "linear-gradient(45deg, #4f46e5 30%, #ec4899 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {`Tour ${tour.name}`}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      <InfoIcon fontSize="small" />{" "}
                      {tour.driver
                        ? `${tour.driver.first_name} ${tour.driver.last_name}`
                        : "No driver assigned"}
                    </Typography>
                    {tour.driver && (
                      <>
                        <Typography
                          variant="body2"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <LocalShippingIcon fontSize="small" />
                          {tour.driver.truck || "No truck plate"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <RvHookupIcon fontSize="small" />
                          {tour.driver.trailer || "No trailer plate"}
                        </Typography>
                      </>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const tourWithDriverData = {
                          ...tour,
                          driver_id: tour.driver?.id || "",
                          truck: tour.driver?.truck || "",
                          trailer: tour.driver?.trailer || "",
                        };
                        setEditingTour(tourWithDriverData);
                      }}
                      sx={{
                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTour(tour.id)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.05)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                {(tour.clients || [])
                  .sort((a, b) => a.order - b.order)
                  .map((stop, index) => {
                    const clientColor = `hsl(${getBaseHue(
                      stop.client?.name || stop.client_id
                    )}, 70%, 85%)`;
                    return (
                      <Paper
                        key={stop.id}
                        elevation={0}
                        sx={{
                          mt: 1,
                          p: 1.5,
                          borderRadius: 2,
                          background: `linear-gradient(145deg, ${clientColor}, #ffffff)`,
                          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                          },
                        }}
                      >
                        {/* Client Info with additional info icon */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="subtitle1">
                            {stop.client?.name || stop.client_id}
                          </Typography>
                          {stop.additional_info &&
                            stop.additional_info.trim() !== "" && (
                              <Tooltip title={stop.additional_info} arrow>
                                <IconButton
                                  size="small"
                                  sx={{
                                    "&:hover": {
                                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                                    },
                                  }}
                                >
                                  <InfoIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {renderClientAddress(stop.client)}
                        </Typography>

                        {/* Arrival / Departure details */}
                        <Grid
                          container
                          spacing={1}
                          sx={{
                            mt: 1,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {/* ARRIVAL row */}
                          <Grid size={12}>
                            <Typography variant="body2">
                              <strong>ARRIVAL:</strong>{" "}
                              {stop.planned_arrival || "N/A"} →{" "}
                              {stop.actual_arrival || "N/A"}
                            </Typography>
                          </Grid>
                          {/* Arrival containers in one color */}
                          <Grid size={6}>
                            <Chip
                              label={
                                stop.arrival_container1 &&
                                stop.arrival_container1.trim() !== ""
                                  ? stop.arrival_container1
                                  : "N/A"
                              }
                              sx={{
                                borderRadius: 1,
                                background: stop.arrival_container1?.trim()
                                  ? "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)"
                                  : "default",
                                color: stop.arrival_container1?.trim()
                                  ? "white"
                                  : "default",
                              }}
                            />
                          </Grid>
                          <Grid size={6}>
                            <Chip
                              label={
                                stop.arrival_container2 &&
                                stop.arrival_container2.trim() !== ""
                                  ? stop.arrival_container2
                                  : "N/A"
                              }
                              sx={{
                                borderRadius: 1,
                                background: stop.arrival_container2?.trim()
                                  ? "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)"
                                  : "default",
                                color: stop.arrival_container2?.trim()
                                  ? "white"
                                  : "default",
                              }}
                              size="small"
                            />
                          </Grid>
                          {/* DEPARTURE row */}
                          <Grid size={12} sx={{ mt: 1 }}>
                            <Typography variant="body2">
                              <strong>DEPARTURE:</strong>{" "}
                              {stop.planned_departure || "N/A"} →{" "}
                              {stop.actual_departure || "N/A"}
                            </Typography>
                          </Grid>
                          {/* Departure containers and WB chips in a different color */}
                          <Grid size={6}>
                            <Chip
                              label={
                                stop.departure_container1 &&
                                stop.departure_container1.trim() !== ""
                                  ? stop.departure_container1
                                  : "N/A"
                              }
                              sx={{
                                borderRadius: 1,
                                background: stop.departure_container1?.trim()
                                  ? "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)"
                                  : "default",
                                color: stop.departure_container1?.trim()
                                  ? "white"
                                  : "default",
                              }}
                              size="small"
                            />
                          </Grid>
                          <Grid size={6}>
                            <Chip
                              label={
                                stop.departure_container2 &&
                                stop.departure_container2.trim() !== ""
                                  ? stop.departure_container2
                                  : "N/A"
                              }
                              sx={{
                                borderRadius: 1,
                                background: stop.departure_container2?.trim()
                                  ? "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)"
                                  : "default",
                                color: stop.departure_container2?.trim()
                                  ? "white"
                                  : "default",
                              }}
                              size="small"
                            />
                          </Grid>
                          <Grid size={6}>
                            <Chip
                              label={
                                stop.wb1 && stop.wb1.trim() !== ""
                                  ? stop.wb1
                                  : "Leer"
                              }
                              sx={{
                                borderRadius: 1,
                                background: stop.wb1?.trim()
                                  ? "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)"
                                  : "default",
                                color: stop.wb1?.trim() ? "white" : "default",
                              }}
                              size="small"
                            />
                          </Grid>
                          <Grid size={6}>
                            <Chip
                              label={
                                stop.wb2 && stop.wb2.trim() !== ""
                                  ? stop.wb2
                                  : "Leer"
                              }
                              sx={{
                                borderRadius: 1,
                                background: stop.wb2?.trim()
                                  ? "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)"
                                  : "default",
                                color: stop.wb2?.trim() ? "white" : "default",
                              }}
                              size="small"
                            />
                          </Grid>
                        </Grid>

                        {/* Action Buttons */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 1,
                            gap: 1,
                          }}
                        >
                          <IconButton
                            onClick={() =>
                              handleMoveStop(tour.id, stop.id, "up")
                            }
                            disabled={index === 0}
                            size="small"
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.05)",
                              },
                              "&.Mui-disabled": {
                                opacity: 0.5,
                              },
                            }}
                          >
                            <ArrowUpwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleMoveStop(tour.id, stop.id, "down")
                            }
                            disabled={index === (tour.clients || []).length - 1}
                            size="small"
                          >
                            <ArrowDownwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              const computedClientId =
                                (
                                  stop.client?.id ||
                                  stop.client?.client_id ||
                                  stop.client?._id ||
                                  clients.find(
                                    (client) =>
                                      client.name.trim() ===
                                      stop.client.name.trim()
                                  )?.id
                                )?.toString() || "";
                              setEditingStop({
                                ...stop,
                                client: undefined,
                                client_id: computedClientId,
                              });
                            }}
                            size="small"
                            color="info"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteStop(stop.id, tour.id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    );
                  })}
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddingStop(tour.id)}
                  sx={{
                    mt: 2,
                    width: "100%",
                    borderRadius: 2,
                    textTransform: "none",
                    background:
                      "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)",
                    },
                  }}
                >
                  Add Stop
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={addingTour} onClose={() => setAddingTour(false)}>
        <DialogTitle>Add New Tour</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tour Name"
            fullWidth
            value={newTourData.name}
            onChange={(e) =>
              setNewTourData({ ...newTourData, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Driver"
            select
            fullWidth
            value={newTourData.driver_id || ""}
            onChange={(e) => {
              const value = e.target.value;
              const driverId = parseInt(value, 10); // Convert to number
              const selectedDriver = drivers.find((d) => d.id === driverId);
              setNewTourData((prev) => ({
                ...prev,
                driver_id: driverId, // Store as number
                truck: selectedDriver?.truck || "",
                trailer: selectedDriver?.trailer || "",
              }));
            }}
          >
            <MenuItem value="">No driver</MenuItem>
            {drivers.map((driver) => (
              <MenuItem key={driver.id} value={driver.id}>
                {" "}
                {/* Value is number */}
                {driver.first_name} {driver.last_name}
              </MenuItem>
            ))}
          </TextField>

          {newTourData.driver_id && (
            <>
              <TextField
                margin="dense"
                label="Truck Plate"
                fullWidth
                value={newTourData.truck || ""}
                onChange={(e) =>
                  setNewTourData((prev) => ({ ...prev, truck: e.target.value }))
                }
              />
              <TextField
                margin="dense"
                label="Trailer Plate"
                fullWidth
                value={newTourData.trailer || ""}
                onChange={(e) =>
                  setNewTourData((prev) => ({
                    ...prev,
                    trailer: e.target.value,
                  }))
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddingTour(false)}>Cancel</Button>
          <Button
            onClick={handleAddTour}
            sx={{
              background: "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)",
              color: "white",
              "&:hover": {
                boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)",
              },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Tour Dialog */}
      <Dialog open={!!editingTour} onClose={() => setEditingTour(null)}>
        <DialogTitle>Edit Daily Tour</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tour Name"
            fullWidth
            value={editingTour?.name || ""}
            onChange={(e) =>
              setEditingTour({ ...editingTour, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Driver"
            select
            fullWidth
            value={editingTour?.driver_id || ""}
            onChange={(e) => {
              const value = e.target.value;
              const selectedDriver = drivers.find((d) => d.id === value);
              setEditingTour((prev) => ({
                ...prev,
                driver_id: value ? parseInt(value) : null, // Convert to number or null
                truck: selectedDriver?.truck || "",
                trailer: selectedDriver?.trailer || "",
              }));
            }}
          >
            <MenuItem value="">No driver</MenuItem>
            {drivers.map((driver) => (
              <MenuItem key={driver.id} value={driver.id}>
                {driver.first_name} {driver.last_name}
              </MenuItem>
            ))}
          </TextField>
          {editingTour?.driver_id && (
            <>
              <TextField
                margin="dense"
                label="Truck Plate"
                fullWidth
                value={editingTour.truck || ""}
                onChange={(e) =>
                  setEditingTour((prev) => ({ ...prev, truck: e.target.value }))
                }
              />
              <TextField
                margin="dense"
                label="Trailer Plate"
                fullWidth
                value={editingTour.trailer || ""}
                onChange={(e) =>
                  setEditingTour((prev) => ({
                    ...prev,
                    trailer: e.target.value,
                  }))
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingTour(null)}>Cancel</Button>
          <Button
            onClick={handleEditTour}
            sx={{
              background: "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)",
              color: "white",
              "&:hover": {
                boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Stop Dialog */}
      <Dialog open={!!addingStop} onClose={() => setAddingStop(null)}>
        <DialogTitle>Add New Stop</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Client"
            select
            fullWidth
            value={newStopData.client_id.toString() || ""}
            onChange={(e) =>
              setNewStopData({ ...newStopData, client_id: e.target.value })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setClientModalOpen(true)}>
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          >
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {" "}
                {/* Remove .toString() */}
                {client.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Planned Arrival"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={
              newStopData.planned_arrival
                ? newStopData.planned_arrival.substring(0, 5)
                : ""
            }
            onChange={(e) =>
              setNewStopData({
                ...newStopData,
                planned_arrival: e.target.value || null, // Send null instead of empty string
              })
            }
          />
          <TextField
            margin="dense"
            label="Planned Departure"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={
              newStopData.planned_departure
                ? newStopData.planned_departure.substring(0, 5)
                : ""
            }
            onChange={(e) =>
              setNewStopData({
                ...newStopData,
                planned_departure: e.target.value || null, // Send null instead of empty string
              })
            }
          />
          <TextField
            margin="dense"
            label="Actual Arrival"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={
              newStopData.actual_arrival
                ? newStopData.actual_arrival.substring(0, 5)
                : ""
            }
            onChange={(e) =>
              setNewStopData({
                ...newStopData,
                actual_arrival: e.target.value || null, // Send null instead of empty string
              })
            }
          />
          <TextField
            margin="dense"
            label="Actual Departure"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={
              newStopData.actual_departure
                ? newStopData.actual_departure.substring(0, 5)
                : ""
            }
            onChange={(e) =>
              setNewStopData({
                ...newStopData,
                actual_departure: e.target.value || null, // Send null instead of empty string
              })
            }
          />
          <TextField
            margin="dense"
            label="Arrival Container 1"
            type="text"
            fullWidth
            value={newStopData.arrival_container1 || ""}
            onChange={(e) =>
              setNewStopData({
                ...newStopData,
                arrival_container1: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Arrival Container 2"
            type="text"
            fullWidth
            value={newStopData.arrival_container2 || ""}
            onChange={(e) =>
              setNewStopData({
                ...newStopData,
                arrival_container2: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Departure Container 1"
            type="text"
            fullWidth
            value={newStopData.departure_container1 || ""}
            onChange={(e) =>
              setNewStopData({
                ...newStopData,
                departure_container1: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Departure Container 2"
            type="text"
            fullWidth
            value={newStopData.departure_container2 || ""}
            onChange={(e) =>
              setNewStopData({
                ...newStopData,
                departure_container2: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Additional Info"
            type="text"
            fullWidth
            value={newStopData.additional_info || ""}
            onChange={(e) =>
              setNewStopData({
                ...newStopData,
                additional_info: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="WB1"
            type="text"
            fullWidth
            value={newStopData.wb1 || ""}
            onChange={(e) =>
              setNewStopData({ ...newStopData, wb1: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="WB2"
            type="text"
            fullWidth
            value={newStopData.wb2 || ""}
            onChange={(e) =>
              setNewStopData({ ...newStopData, wb2: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddingStop(null)}>Cancel</Button>
          <Button
            onClick={handleAddStop}
            sx={{
              background: "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)",
              color: "white",
              "&:hover": {
                boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)",
              },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit Stop Dialog */}
      <Dialog open={!!editingStop} onClose={() => setEditingStop(null)}>
        <DialogTitle>Edit Stop</DialogTitle>

        <DialogContent>
          <TextField
            margin="dense"
            label="Client"
            select
            fullWidth
            value={editingStop?.client_id?.toString() || ""}
            onChange={(e) =>
              setEditingStop({ ...editingStop, client_id: e.target.value })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ marginRight: 2 }}>
                  <IconButton onClick={() => setClientModalOpen(true)}>
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          >
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id.toString()}>
                {client.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Planned Arrival"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={
              editingStop?.planned_arrival
                ? editingStop.planned_arrival.substring(0, 5)
                : ""
            }
            onChange={(e) =>
              setEditingStop({
                ...editingStop,
                planned_arrival: e.target.value || null,
              })
            }
          />
          <TextField
            margin="dense"
            label="Planned Departure"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={
              editingStop?.planned_departure
                ? editingStop.planned_departure.substring(0, 5)
                : ""
            }
            onChange={(e) =>
              setEditingStop({
                ...editingStop,
                planned_departure: e.target.value || null,
              })
            }
          />
          <TextField
            margin="dense"
            label="Actual Arrival"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={
              editingStop?.actual_arrival
                ? editingStop.actual_arrival.substring(0, 5)
                : ""
            }
            onChange={(e) =>
              setEditingStop({
                ...editingStop,
                actual_arrival: e.target.value || null,
              })
            }
          />
          <TextField
            margin="dense"
            label="Actual Departure"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={
              editingStop?.actual_departure
                ? editingStop.actual_departure.substring(0, 5)
                : ""
            }
            onChange={(e) =>
              setEditingStop({
                ...editingStop,
                actual_departure: e.target.value || null,
              })
            }
          />
          <TextField
            margin="dense"
            label="Arrival Container 1"
            type="text"
            fullWidth
            value={editingStop?.arrival_container1 || ""}
            onChange={(e) =>
              setEditingStop({
                ...editingStop,
                arrival_container1: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Arrival Container 2"
            type="text"
            fullWidth
            value={editingStop?.arrival_container2 || ""}
            onChange={(e) =>
              setEditingStop({
                ...editingStop,
                arrival_container2: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Departure Container 1"
            type="text"
            fullWidth
            value={editingStop?.departure_container1 || ""}
            onChange={(e) =>
              setEditingStop({
                ...editingStop,
                departure_container1: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Departure Container 2"
            type="text"
            fullWidth
            value={editingStop?.departure_container2 || ""}
            onChange={(e) =>
              setEditingStop({
                ...editingStop,
                departure_container2: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Additional Info"
            type="text"
            fullWidth
            value={editingStop?.additional_info || ""}
            onChange={(e) =>
              setEditingStop({
                ...editingStop,
                additional_info: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="WB1"
            type="text"
            fullWidth
            value={editingStop?.wb1 || ""}
            onChange={(e) =>
              setEditingStop({ ...editingStop, wb1: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="WB2"
            type="text"
            fullWidth
            value={editingStop?.wb2 || ""}
            onChange={(e) =>
              setEditingStop({ ...editingStop, wb2: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingStop(null)}>Cancel</Button>
          <Button
            onClick={handleEditStop}
            sx={{
              background: "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)",
              color: "white",
              "&:hover": {
                boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {clientModalOpen && (
        <ClientModal
          onClose={() => setClientModalOpen(false)}
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const res = await api.post("/clients", {
                name: clientName,
                street: clientStreet,
                haus_number: clientHausNumber,
                postal_code: clientPostalCode,
                city: clientCity,
                country: clientCountry,
              });
              setClients((prev) => [...prev, res.data]);
              await fetchClients();
              setClientName("");
              setClientStreet("");
              setClientHausNumber("");
              setClientPostalCode("");
              setClientCity("");
              setClientCountry("");
              setClientModalOpen(false);
            } catch (err) {
              console.error("Error saving client", err);
              alert("Error saving client");
            }
          }}
          editingClient={null}
          name={clientName}
          setName={setClientName}
          street={clientStreet}
          setStreet={setClientStreet}
          hausNumber={clientHausNumber}
          setHausNumber={setClientHausNumber}
          postalCode={clientPostalCode}
          setPostalCode={setClientPostalCode}
          city={clientCity}
          setCity={setClientCity}
          country={clientCountry}
          setCountry={setClientCountry}
        />
      )}
      {templateDialogOpen && (
        <TemplateSelectionDialog
          open={templateDialogOpen}
          onClose={() => {
            setTemplateDialogOpen(false);
            setSelectedTemplates([]); // Reset selected templates when dialog closes
          }}
          templates={availableTemplates}
          selectedTemplates={selectedTemplates}
          onSelectTemplates={setSelectedTemplates}
          drivers={drivers}
          onCreate={handleCreateFromTemplates}
        />
      )}
    </Box>
  );
};

export default DailyPlan;
