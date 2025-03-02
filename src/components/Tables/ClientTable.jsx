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

function ClientTable({ clients, onEdit, onDelete}) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const clientsPerPage = 10;

  const totalPages = Math.ceil(clients.length / clientsPerPage);
  const startIndex = (currentPage - 1) * clientsPerPage;
  const displayedClients = clients.slice(startIndex, startIndex + clientsPerPage);

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Client Name</TableCell>
            <TableCell>Street</TableCell>
            <TableCell>House Number</TableCell>
            <TableCell>Postal Code</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Country</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedClients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.id}</TableCell>
              <TableCell>{capitalizeFirstLetter(client.name)}</TableCell>
                <TableCell>{capitalizeFirstLetter(client.street)}</TableCell>
                <TableCell>{client.house_number}</TableCell>
                <TableCell>{client.postal_code}</TableCell>
                <TableCell>{capitalizeFirstLetter(client.city)}</TableCell>
                <TableCell>{capitalizeFirstLetter(client.country)}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(client)}>
                  <EditIcon color="info" />
                </IconButton>
                <IconButton onClick={() => onDelete(client.id)}>
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

ClientTable.propTypes = {
  clients: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ClientTable;
