import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from "@mui/material";
import Toast from "../components/Toast";
import API_ENDPOINTS from "../config/api";
import { useAuth } from "../context/AuthContext";

const roleLabels = {
  ADMIN: "Administrator",
  USER: "Standard User",
};

const ShowUsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API_ENDPOINTS.GET_USERS, {
          credentials: "include",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || data.detail || "Failed to fetch users");
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message || "Failed to fetch users");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 6 , mb : 3}}>
      <Paper elevation={5} sx={{ p: 3, borderRadius: 4, background: "#f8fafc", maxWidth: 500, mx: "auto" }}>
        <Typography variant="h5" fontWeight={700} mb={2} align="center" color="primary.dark">
          List of Registered Users
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle1" color="text.secondary">
            Total Users: <b>{users.length}</b>
          </Typography>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#e3eafc" }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Phone Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u, idx) => (
                <TableRow key={u.username} sx={{ background: idx % 2 === 0 ? "#f4f8ff" : "#fff" }}>
                  <TableCell sx={{ fontWeight: 600 }}>{u.username}</TableCell>
                  <TableCell>{roleLabels[u.role] || u.role}</TableCell>
                  <TableCell>{u.phone_number}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {loading && (
          <Typography align="center" color="primary" mt={2}>Loading users...</Typography>
        )}
      </Paper>
      {showToast && (
        <Toast
          message={error}
          type="error"
          duration={2500}
          onClose={() => setShowToast(false)}
        />
      )}
    </Container>
  );
};

export default ShowUsersPage;
