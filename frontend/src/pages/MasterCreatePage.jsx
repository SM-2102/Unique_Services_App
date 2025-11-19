import React, { useState, useEffect } from "react";
import Toast from "../components/Toast";
import { createMaster } from "../services/masterCreateService";
import { getNextMasterCode } from "../services/masterCodeService";
import { fetchMasterNames } from "../services/masterNamesService";
import { Typography } from "@mui/material";
import { validateMaster } from "../utils/masterValidation";

const initialForm = {
  code: "",
  name: "",
  address: "",
  city: "",
  pin: "",
  contact1: "",
  contact2: "",
  gst: "",
  remark: "",
};

const MasterCreatePage = () => {
  const [form, setForm] = useState(initialForm);
  const [codeLoading, setCodeLoading] = useState(true);
  const [masterNames, setMasterNames] = useState([]);
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showContact2, setShowContact2] = useState(false);

  // Fetch next code and master names on mount
  useEffect(() => {
    setError("");
    setShowToast(false);
    let mounted = true;
    setCodeLoading(true);
    getNextMasterCode()
      .then((code) => {
        if (mounted) setForm((prev) => ({ ...prev, code }));
      })
      .catch(() => {
        setError({
          message: "Failed to fetch next code",
          type: "error",
        });
        setShowToast(true);
        return;
      })
      .finally(() => {
        if (mounted) setCodeLoading(false);
      });
    // Fetch master names for autocomplete
    fetchMasterNames()
      .then((data) => {
        if (mounted && Array.isArray(data)) setMasterNames(data);
      })
      .catch(() => {
        setMasterNames([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    // Enforce max character limits per field
    switch (name) {
      case "name":
        if (value.length > 40) return;
        // Capitalize first letter of each word
        newValue = value
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        // Autocomplete: filter suggestions as user types
        if (newValue.length > 0) {
          const filtered = masterNames.filter((n) =>
            n.toLowerCase().startsWith(newValue.toLowerCase()),
          );
          setNameSuggestions(filtered);
          setShowSuggestions(filtered.length > 0);
        } else {
          setShowSuggestions(false);
        }
        break;
      case "address":
        if (value.length > 40) return;
        break;
      case "city":
        if (value.length > 20) return;
        break;
      case "pin":
        if (value.length > 6) return;
        break;
      case "contact1":
      case "contact2":
        if (value.length > 10) return;
        break;
      case "gst":
        if (value.length > 15) return;
        newValue = value.toUpperCase();
        break;
      case "remark":
        if (value.length > 50) return;
        break;
      default:
        break;
    }
    setForm((prev) => ({ ...prev, [name]: newValue }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleAddContact2 = (e) => {
    e.preventDefault();
    setShowContact2(true);
  };


  // Always compute validation errors for rendering
  const [errs, errs_label] = validateMaster(form, showContact2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowToast(false);
    if (errs.length > 0) {
      setError({
        message: errs[0],
        type: "warning",
      });
      setShowToast(true);
      return;
    }
    setSubmitting(true);
    try {
      const { code, ...rest } = form;
      const payload = Object.fromEntries(
        Object.entries(rest).map(([k, v]) => [k, v === "" ? null : v]),
      );
      await createMaster(payload);
      setError({
        message: "Master record created successfully!",
        type: "success",
      });
      setShowToast(true);
      setForm(initialForm);
      // Fetch next master code after successful creation
      setCodeLoading(true);
      getNextMasterCode()
        .then((code) => {
          setForm((prev) => ({ ...prev, code }));
        })
        .catch(() => {
          setError({
            message: "Failed to fetch next code",
            type: "error",
          });
          setShowToast(true);
        })
        .finally(() => {
          setCodeLoading(false);
        });
      setForm(initialForm);
    } catch (err) {
      setError({
        message: err?.message || "Failed to create master.",
        resolution: err?.resolution || "",
        type: "error",
      });
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] mt-8 mb-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#f8fafc] shadow-lg rounded-lg p-8 w-full max-w-150 border border-gray-200"
        noValidate
      >
        <Typography
          variant="h4"
          fontWeight={600}
          mb={4}
          align="center"
          color="primary.dark"
        >
          Create Customer Record
        </Typography>
        <div className="flex flex-col gap-4">
          {/* Code (readonly, small, label beside input) */}
          <div className="flex items-center gap-3 mb-2 justify-center">
            <label htmlFor="code" className="text-lg font-medium text-gray-700">
              Master Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              value={form.code}
              readOnly
              disabled={codeLoading || submitting}
              autoComplete="off"
              className="w-25 text-center px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 font-medium cursor-not-allowed"
            />
          </div>
          {/* Name (label beside input) */}
          <div
            className="flex items-center gap-2 w-full"
            style={{ position: "relative" }}
          >
            <label
              htmlFor="name"
              className="w-25 text-lg font-medium text-gray-700"
            >
              Name<span className="text-red-500">*</span>
            </label>
            <div className="flex-1 relative">
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${errs_label.name ? "border-red-300" : "border-gray-300"} bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium`}
                minLength={3}
                maxLength={40}
                required
                disabled={submitting}
                autoComplete="name"
                onFocus={() => {
                  if (form.name.length > 0 && nameSuggestions.length > 0)
                    setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              {showSuggestions && (
                <ul
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 10,
                    background: "#fff",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    width: "100%",
                    maxHeight: 180,
                    overflowY: "auto",
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                  }}
                >
                  {nameSuggestions.map((n) => (
                    <li
                      key={n}
                      style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
                      onMouseDown={() => {
                        setForm((prev) => ({ ...prev, name: n }));
                        setShowSuggestions(false);
                      }}
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {/* Address (label beside input) */}
          <div className="flex items-center gap-2 w-full">
            <label
              htmlFor="address"
              className="w-25 text-lg font-medium text-gray-700"
            >
              Address<span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              className={`flex-1 px-3 py-2 rounded-lg border ${errs_label.address ? "border-red-300" : "border-gray-300"} bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium`}
              maxLength={40}
              required
              rows={2}
              autoComplete="street-address"
              disabled={submitting}
            />
          </div>
          {/* City and PIN on same line, equal label/input width */}
          <div className="flex items-center w-full gap-5">
            <div className="flex items-center gap-2">
              <label
                htmlFor="city"
                className="w-26 text-lg font-medium text-gray-700"
              >
                City<span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                className={`w-36 px-3 py-2 rounded-lg border ${errs_label.city ? "border-red-300" : "border-gray-300"} bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium`}
                maxLength={20}
                required
                autoComplete="address-level2"
                disabled={submitting}
              />
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="pin"
                className="w-26 text-lg font-medium text-gray-700"
              >
                Pincode
              </label>
              <input
                id="pin"
                name="pin"
                type="text"
                value={form.pin}
                onChange={handleChange}
                className={`w-36 px-3 py-2 rounded-lg border ${errs_label.pin ? "border-red-300" : "border-gray-300"} bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium`}
                maxLength={6}
                pattern="\d{6}"
                autoComplete="postal-code"
                disabled={submitting}
              />
            </div>
          </div>
          {/* Contact 1 and Contact 2/Button on same line, equal label/input width */}
          <div className="flex items-center w-full gap-5">
            <div className="flex items-center w-1/2 gap-2">
              <label
                htmlFor="contact1"
                className="w-26 text-lg font-medium text-gray-700"
              >
                Contact 1<span className="text-red-500">*</span>
              </label>
              <input
                id="contact1"
                name="contact1"
                type="text"
                value={form.contact1}
                onChange={handleChange}
                className={`w-36 px-3 py-2 rounded-lg border ${errs_label.contact1 ? "border-red-300" : "border-gray-300"} bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium`}
                maxLength={10}
                pattern="\d{10}"
                required
                autoComplete="tel"
                disabled={submitting}
              />
            </div>
            <div className="flex items-center w-1/2 gap-2">
              {showContact2 ? (
                <>
                  <label
                    htmlFor="contact2"
                    className="w-26 text-lg font-medium text-gray-700"
                  >
                    Contact 2
                  </label>
                  <input
                    id="contact2"
                    name="contact2"
                    type="text"
                    value={form.contact2}
                    onChange={handleChange}
                    className={`w-36 px-3 py-2 rounded-lg border ${errs_label.contact2 ? "border-red-300" : "border-gray-300"} bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium`}
                    maxLength={10}
                    pattern="\d{10}"
                    autoComplete="tel"
                    disabled={submitting}
                  />
                </>
              ) : (
                <button
                  className="text-blue-600 font-semibold hover:underline focus:outline-none text-left"
                  onClick={handleAddContact2}
                  type="button"
                  tabIndex={0}
                  disabled={submitting}
                >
                  + Add Another Contact
                </button>
              )}
            </div>
          </div>
          {/* GST (label beside input) */}
          <div className="flex items-center gap-3 w-full">
            <label
              htmlFor="gst"
              className="w-25 text-lg font-medium text-gray-700"
            >
              GST
            </label>
            <input
              id="gst"
              name="gst"
              type="text"
              value={form.gst}
              onChange={handleChange}
              className={`flex-1 px-3 py-2 rounded-lg border ${errs_label.gst ? "border-red-300" : "border-gray-300"} bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium`}
              maxLength={15}
              pattern="[A-Z0-9]{15}"
              autoComplete="off"
              disabled={submitting}
            />
          </div>
          {/* Remark (label beside input) */}
          <div className="flex items-center gap-3 w-full">
            <label
              htmlFor="remark"
              className="w-25 text-lg font-medium text-gray-700"
            >
              Remark
            </label>
            <textarea
              id="remark"
              name="remark"
              value={form.remark}
              onChange={handleChange}
              className={`flex-1 px-3 py-2 rounded-lg border ${errs_label.remark ? "border-red-300" : "border-gray-300"} bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium`}
              maxLength={50}
              rows={2}
              autoComplete="off"
              disabled={submitting}
            />
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="py-2 px-8 rounded-lg bg-blue-600 text-white font-bold text-base shadow hover:bg-blue-900 transition-colors duration-200 w-fit disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Record"}
          </button>
        </div>
      </form>
      {showToast && (
        <Toast
          message={error.message}
          resolution={error.resolution}
          type={error.type}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default MasterCreatePage;
