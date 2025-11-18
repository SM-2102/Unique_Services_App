import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPowerOff, FaHome, FaBars } from "react-icons/fa";
import NavBar from "./NavBar";
import logo from "../assets/logo.png";
import UserMenu from "./UserMenu";
import { logout } from "../services/logout";
import { useAuth } from "../context/AuthContext";


const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/";
  const isMenuPage = location.pathname === "/dashboard";
  const { handleUnauthorized } = useAuth();
  const [navOpen, setNavOpen] = React.useState(false);

  // Only show NavBar icon on allowed pages
  const showNavIcon = !isLoginPage && !isMenuPage;

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col sm:flex-row items-center sm:justify-between bg-blue-900 p-2 sm:p-3 sm:px-8 shadow h-auto sm:h-22">
      <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
        <div className="relative flex items-center" style={{ minWidth: 130 , minHeight: 48 }}>
          {/* Reserve space for NavBar icon, absolutely position icon so logo never shifts */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            {showNavIcon && (
              <button
                className="w-10 h-10 rounded-full bg-blue-900 hover:bg-blue-700 text-white transition-colors duration-200 focus:outline-none flex items-center justify-center"
                onClick={() => setNavOpen(true)}
                title="Open Navigation Menu"
              >
                <FaBars className="text-2xl" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-center w-16 h-12 ml-15">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-12 sm:h-16 sm:w-auto mb-2 sm:mb-0"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center sm:items-start text-center sm:text-left w-full">
          <span
            className="text-white text-2xl sm:text-4xl font-semibold tracking-wide leading-tight mt-1"
            style={{ fontFamily: "Times New Roman, Times, serif" }}
          >
            ABC Company
          </span>
          <span
            className="text-blue-50 text-sm sm:text-lg font-medium mb-1"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Delivering Excellence Since 1990
          </span>
        </div>
      </div>
      {!isLoginPage && (
        <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0 mr-0 sm:mr-14">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-900 hover:bg-blue-600 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 hover:scale-105 transform"
            title="Go to Dashboard"
          >
            <FaHome className="w-5 h-5" />
          </button>
          <UserMenu />
          <button
            onClick={async () => {
              const result = await logout();
              if (result.success) {
                try {
                  handleUnauthorized();
                } catch (e) {
                  console.warn("handleUnauthorized not available", e);
                }
                navigate("/");
              } else {
                console.error("Logout failed:", result.message);
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
      {/* NavBar overlay, controlled by state */}
      {showNavIcon && (
        <NavBar open={navOpen} setOpen={setNavOpen} />
      )}
    </header>
  );
};

export default Header;
