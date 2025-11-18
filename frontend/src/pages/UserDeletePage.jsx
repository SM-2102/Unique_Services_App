import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Typography } from "@mui/material";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { deleteUser, fetchAllUsers } from "../services/user";

const DeleteUserPage = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  // Fetch users function for reuse
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await fetchAllUsers();
      // Exclude current user
      setUsers(data.filter(u => u.username !== user?.username));
    } catch (err) {
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setShowToast(false);
    if (!username || username.length < 3 || username.length > 20) {
      setApiError({
        message: "Username must be 3-20 letters",
        resolution: "Please enter a valid username.",
        type: "warning"
      });
      setShowToast(true);
      return;
    }
    setSubmitting(true);
    try {
      await deleteUser(username);
      setApiError({
        message: `User deleted successfully!`,
        resolution: "",
        type: "success"
      });
      setShowToast(true);
      setUsername("");
      // Refresh user list after successful deletion
      fetchUsers();
    } catch (err) {
      setApiError({
        message: err?.message || "Failed to delete user.",
        resolution: err?.resolution || "",
        type: "error"
      });
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 15 }}>
      <Paper elevation={4} sx={{ p: 2.5, borderRadius: 3, background: "#f8fafc", maxWidth: 340, mx: "auto", minHeight: 0 }}>
        <Typography variant="h5" fontWeight={700} mb={2} align="center" color="primary.dark">
          Delete User
        </Typography>
        <form onSubmit={handleSubmit} noValidate className="w-full flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="username" className="text-gray-700 text-base font-medium w-28 text-left">Username</label>
            <select
              id="username"
              name="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
              required
              disabled={submitting || loadingUsers}
              autoComplete="username"
            >
              <option value="" disabled>Select a user</option>
              {users.map(u => (
                <option key={u.username} value={u.username}>{u.username}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-center mt-2 mb-1">
            <button
              type="submit"
              className="py-2 px-8 rounded-lg bg-red-600 text-white font-bold text-base shadow hover:bg-red-700 transition-colors duration-200 w-fit disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Delete User"}
            </button>
          </div>
        </form>
      </Paper>
      {showToast && (
        <Toast
          message={apiError}
          type={apiError.type || (apiError && apiError.resolution ? "error" : "success")}
          duration={2500}
          onClose={() => setShowToast(false)}
        />
      )}
    </Container>
  );
};

export default DeleteUserPage;
