// src/components/DailyPlan/components/TourCard/StopItem.jsx
import React from "react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RvHookupIcon from "@mui/icons-material/RvHookup";
import {
  Paper,
  Typography,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Info as InfoIcon,
  LocalShipping,
  RvHookup,
} from "@mui/icons-material";
import { renderClientAddress } from "../../helpers";

const StopItem = ({
  stop,
  index,
  tour,
  clients,
  onEdit,
  onDelete,
  onMove,
  clientColor,
}) => {
  const getChipProps = (value) => ({
    label: value?.trim() || "N/A",
    size: "small",
    sx: {
      borderRadius: 1,
      background: value?.trim()
        ? "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)"
        : "default",
      color: value?.trim() ? "white" : "inherit",
      maxWidth: 100,
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  });

  return (
    <Paper
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
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Typography variant="subtitle1">
          {stop.client?.name || stop.client_id}
        </Typography>
        {stop.additional_info?.trim() && (
          <Tooltip title={stop.additional_info} arrow>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
        {renderClientAddress(stop.client)}
      </Typography>

      <Grid
        container
        spacing={1}
        sx={{ mt: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Grid item xs={12}>
          <Typography variant="body2">
            <strong>ARRIVAL:</strong> {stop.planned_arrival || "N/A"} →{" "}
            {stop.actual_arrival || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Chip {...getChipProps(stop.arrival_container1)} />
        </Grid>
        <Grid item xs={6}>
          <Chip {...getChipProps(stop.arrival_container2)} />
        </Grid>

        <Grid item xs={12} sx={{ mt: 1 }}>
          <Typography variant="body2">
            <strong>DEPARTURE:</strong> {stop.planned_departure || "N/A"} →{" "}
            {stop.actual_departure || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Chip {...getChipProps(stop.departure_container1)} />
        </Grid>
        <Grid item xs={6}>
          <Chip {...getChipProps(stop.departure_container2)} />
        </Grid>

        <Grid item xs={6}>
          <Chip
            {...getChipProps(stop.wb1)}
            icon={<LocalShippingIcon fontSize="small" />}
          />
          <Chip
            {...getChipProps(stop.wb2)}
            icon={<RvHookupIcon fontSize="small" />}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, gap: 1 }}>
        <IconButton
          onClick={() => onMove(tour.id, stop.id, "up")}
          disabled={index === 0}
          size="small"
        >
          <ArrowUpwardIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => onMove(tour.id, stop.id, "down")}
          disabled={index === (tour.clients || []).length - 1}
          size="small"
        >
          <ArrowDownwardIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => {
            const clientMatch = clients.find(
              (c) => c.name?.trim() === stop.client?.name?.trim()
            );
            onEdit({
              ...stop,
              client: undefined,
              client_id: clientMatch?.id || stop.client_id,
            });
          }}
          size="small"
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={() => onDelete(stop.id, tour.id)} size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default StopItem;
