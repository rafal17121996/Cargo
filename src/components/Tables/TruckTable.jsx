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

function TruckTable({ trucks, onEdit, onDelete}) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const trucksPerPage = 10;

  const totalPages = Math.ceil(trucks.length / trucksPerPage);
  const startIndex = (currentPage - 1) * trucksPerPage;
  const displayedTrucks = trucks.slice(startIndex, startIndex + trucksPerPage);

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Truck Plate</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedTrucks.map((truck) => (
            <TableRow key={truck.id}>
              <TableCell>{truck.id}</TableCell>
              <TableCell>{capitalizeFirstLetter(truck.plate)}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(truck)}>
                  <EditIcon color="info" />
                </IconButton>
                <IconButton onClick={() => onDelete(truck.id)}>
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

TruckTable.propTypes = {
  trucks: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default TruckTable;
