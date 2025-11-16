import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { createUser } from "../services/auth";
import Toast from "../components/Toast";

const roles = ["USER", "ADMIN"];

const CreateUserPage = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "USER",
    phone_number: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.username || form.username.length < 3) {
      errs.username = "Enter your full name";
    }
    if (!form.password || form.password.length < 6) {
      errs.password = "Password is too short";
    }
    if (!form.phone_number || !/^\d{10}$/.test(form.phone_number)) {
      errs.phone_number = "Invalid contact number";
    }
    if (!roles.includes(form.role)) {
      errs.role = "Role must be USER or ADMIN";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      if (value.length > 25) return; // Prevent input beyond 25 chars
    }
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setShowToast(false);
    const errs = validate();
    if (Object.keys(errs).length) {
      // Show all field errors in a warning toast
      setApiError({
        message: Object.values(errs),
      });
      setShowToast(true);
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await createUser(form);
      setApiError({
        message: `User '${form.username}' created successfully!`,
        resolution: "",
        type: "success"
      });
      setShowToast(true);
    } catch (err) {
      setApiError({
        message: err?.message || "Failed to create user.",
        resolution: err?.resolution || ""
      });
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 2.5, borderRadius: 3, background: "#f8fafc", maxWidth: 340, mx: "auto", minHeight: 0 }}>
        <Typography variant="h5" fontWeight={700} mb={2} align="center" color="primary.dark">
          Create New User
        </Typography>
        <form onSubmit={handleSubmit} noValidate className="w-full flex flex-col gap-3">
          {/* Username */}
          <div className="flex items-center gap-2">
            <label htmlFor="username" className="text-gray-700 text-base font-medium w-28 text-left">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
              placeholder="Username"
              autoComplete="username"
              maxLength={20}
              required
              disabled={submitting}
              inputMode="text"
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-2">
            <label htmlFor="password" className="text-gray-700 text-base font-medium w-28 text-left">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
              placeholder="Password"
              autoComplete="new-password"
              minLength={6}
              required
              disabled={submitting}
            />
          </div>

          {/* Phone Number */}
          <div className="flex items-center gap-2">
            <label htmlFor="phone_number" className="text-gray-700 text-base font-medium w-28 text-left">Contact</label>
            <input
              id="phone_number"
              name="phone_number"
              type="text"
              value={form.phone_number}
              onChange={handleChange}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
              placeholder="Phone Number"
              maxLength={10}
              required
              disabled={submitting}
            />
          </div>

          {/* Role */}
          <div className="flex items-center gap-2">
            <label htmlFor="role" className="text-gray-700 text-base font-medium w-28 text-left">Role</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
              required
              disabled={submitting}
            >
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center mt-2 mb-1">
            <button
              type="submit"
              className="py-2 px-8 rounded-lg bg-blue-600 text-white font-bold text-base shadow hover:bg-blue-700 transition-colors duration-200 w-fit disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </Paper>
      {showToast && (
        <Toast
          message={apiError}
          type={apiError.type || (Object.keys(errors).length ? "warning" : "error")}
          duration={2500}
          onClose={() => setShowToast(false)}
        />
      )}
    </Container>
  );
};

export default CreateUserPage;
