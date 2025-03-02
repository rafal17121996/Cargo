// src/components/DailyPlan/components/TourCard/index.jsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
  Paper,
  Chip,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
    Info as InfoIcon,
    LocalShipping as LocalShippingIcon,
    RvHookup as RvHookupIcon,
  } from "@mui/icons-material";
import StopItem from "./StopItem";
import { getBaseHue } from "../../helpers";

const TourCard = ({
  tour,
  drivers,
  clients,
  onEditTour,
  onDeleteTour,
  onAddStop,
  onEditStop,
  onDeleteStop,
  onMoveStop,
}) => {
  return (
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
                background: "linear-gradient(45deg, #4f46e5 30%, #ec4899 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {`Tour ${tour.name}`}
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              <InfoIcon fontSize="small" />
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
            <IconButton size="small" onClick={() => onEditTour(tour)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDeleteTour(tour.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {(tour.clients || [])
          .sort((a, b) => a.order - b.order)
          .map((stop, index) => (
            <StopItem
              key={stop.id}
              stop={stop}
              index={index}
              tour={tour}
              clients={clients}
              onEdit={onEditStop}
              onDelete={onDeleteStop}
              onMove={onMoveStop}
              clientColor={`hsl(${getBaseHue(
                stop.client?.name || stop.client_id
              )}, 70%, 85%)`}
            />
          ))}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => onAddStop(tour.id)}
          sx={{
            mt: 2,
            width: "100%",
            borderRadius: 2,
            textTransform: "none",
            background: "linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)",
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
  );
};

export default TourCard;
