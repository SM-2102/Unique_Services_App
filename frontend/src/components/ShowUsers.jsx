import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";

const roleLabels = {
  ADMIN: "Administrator",
  USER: "Standard User",
};

/**
 * ShowUsers is a reusable component to display a list of users in a table.
 * @param {Array} users - The list of users to display.
 * @param {string} [title] - Optional title for the table.
 */
const ShowUsers = ({ users = [], title = "List of Registered Users" }) => {
  return (
    <Paper
      elevation={5}
      sx={{
        p: 3,
        borderRadius: 4,
        background: "#f8fafc",
        maxWidth: 500,
        mx: "auto",
      }}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        mb={2}
        align="center"
        color="primary.dark"
      >
        {title}
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="subtitle1" color="text.secondary">
          Total Users: <b>{users.length}</b>
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#e3eafc" }}>
              <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                Username
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                Phone Number
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u, idx) => (
              <TableRow
                key={u.username}
                sx={{ background: idx % 2 === 0 ? "#f4f8ff" : "#fff" }}
              >
                <TableCell sx={{ fontWeight: 600 }}>{u.username}</TableCell>
                <TableCell>{roleLabels[u.role] || u.role}</TableCell>
                <TableCell>{u.phone_number}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Loading and error states are now handled by parent components */}
    </Paper>
  );
};

export default ShowUsers;
