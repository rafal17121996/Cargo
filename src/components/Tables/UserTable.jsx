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
  VpnKey as KeyIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import capitalizeFirstLetter from "../../hooks/helpers";

function UserTable({ users, onEdit, onDelete, onResetPassword }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const usersPerPage = 10;

  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const displayedUsers = users.slice(startIndex, startIndex + usersPerPage);

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Truck</TableCell>
            <TableCell>Trailer</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: user.is_online ? "green" : "red",
                    margin: "auto",
                  }}
                />
              </TableCell>

              <TableCell>{capitalizeFirstLetter(user.first_name)}</TableCell>
              <TableCell>{capitalizeFirstLetter(user.last_name)}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{capitalizeFirstLetter(user.role.name)}</TableCell>
              <TableCell>{user.truck?.plate.toUpperCase()}</TableCell>
              <TableCell>{user.trailer?.plate.toUpperCase()}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(user)}>
                  <EditIcon color="info" />
                </IconButton>
                <IconButton onClick={() => onResetPassword(user)}>
                  <KeyIcon color="warning" />
                </IconButton>
                <IconButton onClick={() => onDelete(user.id)}>
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

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onResetPassword: PropTypes.func.isRequired,
};

export default UserTable;
