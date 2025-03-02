import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import capitalizeFirstLetter from "../../hooks/helpers";

function TrailerTable({ trailers, onEdit, onDelete}) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const trailersPerPage = 10;

  const totalPages = Math.ceil(trailers.length / trailersPerPage);
  const startIndex = (currentPage - 1) * trailersPerPage;
  const displayedTrailers = trailers.slice(startIndex, startIndex + trailersPerPage);

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Trailer Plate</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedTrailers.map((trailer) => (
            <TableRow key={trailer.id}>
              <TableCell>{trailer.id}</TableCell>
              <TableCell>{capitalizeFirstLetter(trailer.plate)}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(trailer)}>
                  <EditIcon color="info" />
                </IconButton>
                <IconButton onClick={() => onDelete(trailer.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
          color="primary"
        />
      </Box>
    </TableContainer>
  );
}

TrailerTable.propTypes = {
  trailers: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default TrailerTable;
