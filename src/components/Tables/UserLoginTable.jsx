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

const UserLoginsTable = ({ logins = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const totalPages = Math.ceil(logins.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedLogins = logins.slice(startIndex, startIndex + entriesPerPage);

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Login Time</TableCell>
            <TableCell>IP Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedLogins.map((login) => (
            <TableRow key={login.id}>
              <TableCell>
                {new Date(login.login_time).toLocaleString()}
              </TableCell>
              <TableCell>{login.ip_address}</TableCell>
            </TableRow>
          ))}
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

UserLoginsTable.propTypes = {
  logins: PropTypes.array.isRequired,
};

export default UserLoginsTable;