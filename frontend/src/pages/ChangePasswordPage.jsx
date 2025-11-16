import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Container, Paper, Typography } from "@mui/material";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import API_ENDPOINTS from "../config/api";

const ChangePasswordPage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.old_password || form.old_password.length < 6) {
      errs.old_password = "Old password is too short";
    }
    if (!form.new_password || form.new_password.length < 6) {
      errs.new_password = "New password is too short";
    }
    if (form.old_password === form.new_password) {
      errs.new_password = "Cannot reuse old password";
    }
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setShowToast(false);
    const errs = validate();
    if (Object.keys(errs).length) {
      setApiError({
        message: Object.values(errs),
        type: "warning"
      });
      setShowToast(true);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: user.username,
          old_password: form.old_password,
          new_password: form.new_password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setApiError({
          message: data.message || data.detail || "Failed to change password.",
          resolution: data.resolution || "",
          type: "error"
        });
        setShowToast(true);
      } else {
        setApiError({
          message: "Password changed successfully!",
          resolution: "",
          type: "success"
        });
        setShowToast(true);
        setForm({ old_password: "", new_password: "" });
      }
    } catch (err) {
      setApiError({
        message: err?.message || "Failed to change password.",
        resolution: err?.resolution || "",
        type: "error"
      });
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 13 }}>
      <Paper elevation={4} sx={{ p: 2.5, borderRadius: 3, background: "#f8fafc", maxWidth: 410, mx: "auto", minHeight: 0 }}>
        <Typography variant="h5" fontWeight={700} mb={2} align="center" color="primary.dark">
          Change Password
        </Typography>
        <form onSubmit={handleSubmit} noValidate className="w-full flex flex-col gap-3">
          <div className="flex items-center gap-2 relative">
            <label htmlFor="old_password" className="text-gray-700 text-base font-medium w-32 text-left">Old Password</label>
            <input
              id="old_password"
              name="old_password"
              type={showOldPassword ? "text" : "password"}
              value={form.old_password}
              onChange={handleChange}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium pr-10"
              placeholder="Old Password"
              minLength={6}
              required
              disabled={submitting}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
              onClick={() => setShowOldPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showOldPassword ? "Hide old password" : "Show old password"}
              disabled={submitting}
            >
              {showOldPassword ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-2 relative">
            <label htmlFor="new_password" className="text-gray-700 text-base font-medium w-32 text-left">New Password</label>
            <input
              id="new_password"
              name="new_password"
              type={showNewPassword ? "text" : "password"}
              value={form.new_password}
              onChange={handleChange}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium pr-10"
              placeholder="New Password"
              minLength={6}
              required
              disabled={submitting}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
              onClick={() => setShowNewPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showNewPassword ? "Hide new password" : "Show new password"}
              disabled={submitting}
            >
              {showNewPassword ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="flex justify-center mt-2 mb-1">
            <button
              type="submit"
              className="py-2 px-8 rounded-lg bg-blue-600 text-white font-bold text-base shadow hover:bg-blue-700 transition-colors duration-200 w-fit disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </Paper>
      {showToast && (
        <Toast
          message={apiError}
          type={apiError.type || "info"}
          duration={2500}
          onClose={() => setShowToast(false)}
        />
      )}
    </Container>
  );
};

export default ChangePasswordPage;
