import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPowerOff, FaHome } from "react-icons/fa";
import logo from "../assets/logo.png";
import UserMenu from "./UserMenu";
import { logout } from "../services/logout";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/";
  const { handleUnauthorized } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col sm:flex-row items-center sm:justify-between bg-blue-900 p-2 sm:p-3 sm:px-8 shadow h-auto sm:h-22">
      <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
        <img
          src={logo}
          alt="Logo"
          className="h-12 w-12 sm:h-16 sm:w-auto mr-0 sm:mr-4 ml-0 sm:ml-14 mb-2 sm:mb-0"
        />
        <div className="flex flex-col justify-center items-center sm:items-start text-center sm:text-left w-full">
          <span
            className="text-white text-2xl sm:text-4xl font-semibold tracking-wide leading-tight mt-1"
            style={{ fontFamily: "Times New Roman, Times, serif" }}
          >
            Unique Services
          </span>
          <span
            className="text-blue-50 text-sm sm:text-lg font-medium mb-1"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            12 Sankharitola Street, Kolkata - 700014
          </span>
        </div>
      </div>
      {!isLoginPage && (
        <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0 mr-0 sm:mr-14">
          {/* Dashboard Home Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-900 hover:bg-blue-600 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 hover:scale-105 transform"
            title="Go to Dashboard"
          >
            <FaHome className="w-5 h-5" />
          </button>
          <UserMenu />
          {/* Logout Button */}
          <button
            onClick={async () => {
              // Call backend logout and then clear auth state and navigate to login
              const result = await logout();
              if (result.success) {
                // Update auth context so app knows user is logged out
                try {
                  handleUnauthorized();
                } catch (e) {
                  // if context not available for some reason, ignore
                  // eslint-disable-next-line no-console
                  console.warn("handleUnauthorized not available", e);
                }
                navigate("/");
              } else {
                // Keep user on page and log error; could show toast later
                // eslint-disable-next-line no-console
                console.error("Logout failed:", result.message);
                // Still navigate to login to ensure UI shows logged-out state
                try {
                  handleUnauthorized();
                } catch {}
                navigate("/");
              }
            }}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-900 hover:bg-red-500 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:scale-105 transform"
            title="Logout"
          >
            <FaPowerOff className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
        </div>
      )}
    </header>
  );
};

export default Header;
