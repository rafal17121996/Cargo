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

function RoleTable({ roles, onEdit, onDelete}) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const rolesPerPage = 10;

  const totalPages = Math.ceil(roles.length / rolesPerPage);
  const startIndex = (currentPage - 1) * rolesPerPage;
  const displayedRoles = roles.slice(startIndex, startIndex + rolesPerPage);

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Role Name</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedRoles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.id}</TableCell>
              <TableCell>{capitalizeFirstLetter(role.name)}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(role)}>
                  <EditIcon color="info" />
                </IconButton>
                <IconButton onClick={() => onDelete(role.id)}>
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

RoleTable.propTypes = {
  roles: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default RoleTable;
