import {
  Box,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

const LastLoginsTable = ({ logins, onRowClick, users}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  
  const lastLogins = logins.reduce((acc, login) => {
    if (!acc[login.user_id] || new Date(login.login_time) > new Date(acc[login.user_id].login_time)) {
      acc[login.user_id] = login;
    }
    return acc;
  }, {});

  const uniqueLogins = Object.values(lastLogins);
  const totalPages = Math.ceil(uniqueLogins.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedLogins = uniqueLogins.slice(startIndex, startIndex + entriesPerPage);

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Last Login</TableCell>
            <TableCell>IP Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedLogins.map((login) => {
            const user = users.find((u) => u.id === login.user_id);
            return (
              <TableRow
                key={login.id}
                hover
                onClick={() => onRowClick(login.user_id)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: user?.is_online ? "green" : "red",
                      margin: "auto",
                    }}
                  />
                </TableCell>
                <TableCell>{user?.username}</TableCell>
                <TableCell>
                  {new Date(login.login_time).toLocaleString()}
                </TableCell>
                <TableCell>{login.ip_address}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
          color="primary"
        />
      </Box>
    </TableContainer>
  );
};

LastLoginsTable.propTypes = {
  logins: PropTypes.array.isRequired,
  onRowClick: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};

export default LastLoginsTable;

