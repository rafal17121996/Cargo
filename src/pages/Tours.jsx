import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Box,
  Paper,
  Grid,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { InputAdornment } from "@mui/material";
import { useTemplateToursData } from "../hooks/useTemplateToursData";
import { useClientsData } from "../hooks/useClientsData";
import { useTemplateTourActions } from "../hooks/useTemplateTourActions";
import TemplateTourModal from "../components/Modals/TemplateTourModal";
import ConfirmationDialog from "../components/Dialogs/ConfirmationDialog";
import TemplateTourStopModal from "../components/Modals/TemplateTourStopModal";

const getBaseHue = (id) => {
  let hash = 0;
  const str = id.toString();
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

const Tours = () => {
  const { templateTours, setTemplateTours, fetchTemplateTours } =
    useTemplateToursData();

  const {
    handleSaveTemplateTour,
    handleSaveTemplateTourStop,
    confirmDeleteTemplateTour,
    confirmDeleteTemplateTourStop,
    handleMoveStop,
  } = useTemplateTourActions(setTemplateTours, fetchTemplateTours);

  const { fetchClients, clients, renderClientAddress } = useClientsData();

  const [templateTourModalOpen, setTemplateTourModalOpen] = useState(false);
  const [templateTourModalStopOpen, setTemplateTourModalStopOpen] =
    useState(false);

  const [deleteTemplateTourId, setDeleteTemplateTourId] = useState(null);
  const [deleteTemplateTourStopId, setDeleteTemplateTourStopId] =
    useState(null);
  const [
    deleteTemplateTourStopTemplateTourId,
    setDeleteTemplateTourStopTemplateTourId,
  ] = useState(null);
  const [deleteTemplateTourConfirmOpen, setDeleteTemplateTourConfirmOpen] =
    useState(false);
  const [
    deleteTemplateTourStopConfirmOpen,
    setDeleteTemplateTourStopConfirmOpen,
  ] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [editingTemplateTour, setEditingTemplateTour] = useState(null);
  const [editingTemplateTourStop, setEditingTemplateTourStop] = useState(null);
  const [
    editingTemplateTourStopTemplateTour,
    setEditingTemplateTourStopTemplateTour,
  ] = useState(null);

  const [templateTourName, setTemplateTourName] = useState("");
  const [stopClient, setStopClient] = useState("");
  const [stopPlannedArrival, setStopPlannedArrival] = useState("");
  const [stopPlannedDeparture, setStopPlannedDeparture] = useState("");
  const [stopWb1, setStopWb1] = useState("");
  const [stopWb2, setStopWb2] = useState("");

  const [templateTourStopsSize, setTemplateTourStopsSize] = useState(0);

  const handleAddTemplateTour = () => {
    setEditingTemplateTour(null);
    setTemplateTourName("");
    setTemplateTourModalOpen(true);
  };

  const handleAddTemplateTourStop = (templateTour) => {
    setEditingTemplateTourStopTemplateTour(templateTour);
    setEditingTemplateTourStop(null);
    setTemplateTourStopsSize(templateTour.stops.length);
    setStopClient(null);
    setStopPlannedArrival("");
    setStopPlannedDeparture("");
    setStopWb1("");
    setStopWb2("");
    setTemplateTourModalStopOpen(true);
  };

  const handleEditTemplateTour = (templateTour) => {
    setEditingTemplateTour(templateTour);
    setTemplateTourName(templateTour.name);
    setTemplateTourModalOpen(true);
  };

  const handleEditTemplateTourStop = (templateTour, templateTourStop) => {
    setEditingTemplateTourStopTemplateTour(templateTour);
    setEditingTemplateTourStop(templateTourStop);
    const client = clients.find((c) => c.id === templateTourStop.client_id);
    setStopClient(client || null);
    setStopPlannedArrival(templateTourStop.planned_arrival);
    setStopPlannedDeparture(templateTourStop.planned_departure);
    setStopWb1(templateTourStop.wb1);
    setStopWb2(templateTourStop.wb2);
    setTemplateTourModalStopOpen(true);
  };

  const handleDeleteTemplateTour = async (deleteTemplateTourId) => {
    setDeleteTemplateTourId(deleteTemplateTourId);
    setDeleteTemplateTourConfirmOpen(true);
  };

  const handleDeleteTemplateTourStop = async (
    templateTourId,
    deleteTemplateTourStopId
  ) => {
    setDeleteTemplateTourStopId(deleteTemplateTourStopId);
    setDeleteTemplateTourStopTemplateTourId(templateTourId);
    setDeleteTemplateTourStopConfirmOpen(true);
  };

  useEffect(() => {
    fetchTemplateTours();
    fetchClients();
  }, [fetchTemplateTours, fetchClients]);

  const filteredTours = templateTours.filter((tour) =>
    tour.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: 3 }}>
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
          Tour Templates
        </Typography>
        <TextField
          fullWidth
          variant="filled"
          size="small"
          label="Search Templates"
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
          onClick={() => handleAddTemplateTour()}
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
          New Tour
        </Button>
      </Box>

      {/* Tours Grid */}
      {/* Tour Boxes */}
      <Grid container spacing={2}>
        {filteredTours.map((templateTour) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={templateTour.id}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                maxWidth: 300,
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
                    {`Tour ${templateTour.name}`}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditTemplateTour(templateTour)}
                      sx={{
                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTemplateTour(templateTour.id)}
                      sx={{
                        "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {/* Stop Boxes */}
                {(templateTour.stops || [])
                  .sort((a, b) => a.order - b.order)
                  .map((stop, index) => {
                    const client = clients.find((c) => c.id === stop.client_id);
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
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 500 }}
                          >
                            {client?.name || "Unknown Client"}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 0.5 }}
                          >
                            {renderClientAddress(client)}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2">
                            Arrival: {stop.planned_arrival || "N/A"}
                          </Typography>
                          <Typography variant="body2">
                            Departure: {stop.planned_departure || "N/A"}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Chip
                            label={stop.wb1?.trim() || "Leer"}
                            color={stop.wb1?.trim() ? "primary" : "default"}
                            size="small"
                            sx={{
                              borderRadius: 1,
                              background: stop.wb1?.trim()
                                ? "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)"
                                : "default",
                              color: stop.wb1?.trim() ? "white" : "default",
                            }}
                          />
                          <Chip
                            label={stop.wb2?.trim() || "Leer"}
                            color={stop.wb2?.trim() ? "primary" : "default"}
                            size="small"
                            sx={{
                              borderRadius: 1,
                              background: stop.wb2?.trim()
                                ? "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)"
                                : "default",
                              color: stop.wb2?.trim() ? "white" : "default",
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            onClick={() =>
                              handleMoveStop(templateTour, stop, "up")
                            }
                            disabled={index === 0}
                            size="small"
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.05)",
                              },
                            }}
                          >
                            <ArrowUpwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleMoveStop(templateTour, stop, "down")
                            }
                            disabled={
                              index === (templateTour.stops || []).length - 1
                            }
                            size="small"
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.05)",
                              },
                            }}
                          >
                            <ArrowDownwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleEditTemplateTourStop(templateTour, stop)
                            }
                            size="small"
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.05)",
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleDeleteTemplateTourStop(
                                templateTour.id,
                                stop.id
                              )
                            }
                            size="small"
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(255, 0, 0, 0.1)",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    );
                  })}

                {/* Add Stop Button */}
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddTemplateTourStop(templateTour)}
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

      {templateTourModalOpen && (
        <TemplateTourModal
          onClose={() => setTemplateTourModalOpen(false)}
          onSubmit={(e) => {
            e.preventDefault();
            const templateTourData = {
              name: templateTourName,
            };
            handleSaveTemplateTour(editingTemplateTour, templateTourData);
            setTemplateTourModalOpen(false);
          }}
          editingTemplateTour={editingTemplateTour}
          templateTourName={templateTourName}
          setTemplateTourName={setTemplateTourName}
        />
      )}

      {templateTourModalStopOpen && (
        <TemplateTourStopModal
          onClose={() => setTemplateTourModalStopOpen(false)}
          onSubmit={(e) => {
            e.preventDefault();
            const templateTourStopData = {
              client_id: stopClient?.id,
              order: templateTourStopsSize,
              planned_arrival: stopPlannedArrival,
              planned_departure: stopPlannedDeparture,
              wb1: stopWb1,
              wb2: stopWb2,
            };
            handleSaveTemplateTourStop(
              editingTemplateTourStopTemplateTour,
              editingTemplateTourStop,
              templateTourStopData
            );
            setTemplateTourModalStopOpen(false);
          }}
          editingTemplateTourStop={editingTemplateTourStop}
          stopClient={stopClient}
          setStopClient={setStopClient}
          stopPlannedArrival={stopPlannedArrival}
          setStopPlannedArrival={setStopPlannedArrival}
          stopPlannedDeparture={stopPlannedDeparture}
          setStopPlannedDeparture={setStopPlannedDeparture}
          stopWb1={stopWb1}
          setStopWb1={setStopWb1}
          stopWb2={stopWb2}
          setStopWb2={setStopWb2}
          clients={clients}
        />
      )}

      <ConfirmationDialog
        open={deleteTemplateTourConfirmOpen}
        onClose={() => setDeleteTemplateTourConfirmOpen(false)}
        onConfirm={() =>
          confirmDeleteTemplateTour(deleteTemplateTourId) &&
          setDeleteTemplateTourConfirmOpen(false)
        }
        title="Confirm Delete"
        message="Are you sure you want to delete this Template Tour?"
      />

      <ConfirmationDialog
        open={deleteTemplateTourStopConfirmOpen}
        onClose={() => setDeleteTemplateTourStopConfirmOpen(false)}
        onConfirm={() =>
          confirmDeleteTemplateTourStop(
            deleteTemplateTourStopId,
            deleteTemplateTourStopTemplateTourId
          ) && setDeleteTemplateTourStopConfirmOpen(false)
        }
        title="Confirm Delete"
        message="Are you sure you want to delete this Stop?"
      />
    </Box>
  );
};

export default Tours;
