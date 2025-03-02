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
import { useTrailerData } from "../hooks/useTrailersData";
import { useTrailerActions } from "../hooks/useTrailerActions";
import TrailerTable from "../components/Tables/TrailerTabel";
import TrailerModal from "../components/Modals/TrailerModal";

function Trailers() {
  const {
    fetchTrailers,
    setTrailers,
    trailers,
  } = useTrailerData();

  const [deleteTrailerId, setDeleteTrailerId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTrailer, setEditingTrailer] = useState(null);

  const [trailerPlate, setTrailerPlate] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);


  const { handleSave, confirmDelete } = useTrailerActions(
    setTrailers,
  );

  useEffect(() => {
    fetchTrailers();
  }, [fetchTrailers]);

  const handleAddTrailer = () => {
    setEditingTrailer(null);
    setTrailerPlate("");
    setModalOpen(true);
  };

  const handleEditTrailer = (trailer) => {
    setEditingTrailer(trailer);
    setTrailerPlate(trailer.plate);
    setModalOpen(true);
  };

  const handleDeleteTrailer= async (id) => {
    setDeleteTrailerId(id);
    setDeleteConfirmOpen(true);
  };

  const filteredTrailers = trailers.filter((t) => {
    const q = searchTerm.toLowerCase();
    const trailerPlate = `${t.plate}`.toLowerCase();
    return trailerPlate.includes(q);
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
          Trailers
        </Typography>
        <TextField
          fullWidth
          variant="filled"
          size="small"
          label="Search Trailers"
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
          onClick={handleAddTrailer}
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
          New Trailer
        </Button>
      </Box>

      <TrailerTable
        trailers={filteredTrailers}
        onEdit={handleEditTrailer}
        onDelete={handleDeleteTrailer}
      />

      {modalOpen && (
        <TrailerModal
          onClose={() => setModalOpen(false)}
          onSubmit={(e) => {
            e.preventDefault();
            const trailerData = {
              plate: trailerPlate
            };
            handleSave(editingTrailer, trailerData);
            setModalOpen(false);
          }}
          editingTrailer={editingTrailer}
          trailerPlate={trailerPlate}
          setTrailerPlate={setTrailerPlate}
        />
      )}

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() =>
          confirmDelete(deleteTrailerId) && setDeleteConfirmOpen(false)
        }
        title="Confirm Delete"
        message="Are you sure you want to delete this trailer?"
      />

    </Box>
  );
}

export default Trailers;
