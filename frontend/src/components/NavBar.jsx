import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { menuConfig } from "../config/menuConfig";

// Convert menuConfig to menuItems for NavBar (submenus = actions)
const menuItems = menuConfig.map(({ title, actions }) => ({
  title,
  submenus: actions.map(({ label, path }) => ({ title: label, path })),
}));

const NavBar = ({ open, setOpen }) => {
  const [submenuOpen, setSubmenuOpen] = useState(null);
  const overlayRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, setOpen]);

  // Close all submenus when NavBar is opened
  useEffect(() => {
    if (open) setSubmenuOpen(null);
  }, [open]);

  const handleSubmenu = (idx) =>
    setSubmenuOpen(idx === submenuOpen ? null : idx);

  if (!open) return null;

  return (
    <div
      className="fixed top-0 left-0 w-80 max-w-[90vw] h-screen bg-black/10 backdrop-blur-xl z-[1200] shadow-2xl flex flex-col animate-fade-in"
      ref={overlayRef}
    >
      {/* NavBar button and title at the top */}
      <div className="flex items-center h-22 px-4 border-b border-blue-200/30 ml-4 relative">
        <button
          className="w-10 h-10 rounded-full hover:bg-blue-700 text-white transition-colors duration-200 focus:outline-none flex items-center justify-center absolute left-4 top-1/2 -translate-y-1/2"
          onClick={() => setOpen(false)}
          title="Close Navigation Bar"
        >
          <FaBars className="text-2xl" />
        </button>
        <span className="ml-16 text-2xl font-bold text-black tracking-wide">
          Navigation Bar
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item, idx) => (
          <div key={item.title} className="mb-2">
            <div
              className="flex items-center text-black text-base font-semibold px-6 py-3 rounded-md cursor-pointer hover:bg-blue-900/30 transition select-none"
              onClick={() => handleSubmenu(idx)}
            >
              <span>{item.title}</span>
              {submenuOpen === idx ? (
                <FaChevronUp className="ml-2 text-blue-700" />
              ) : (
                <FaChevronDown className="ml-2 text-blue-700" />
              )}
            </div>
            {submenuOpen === idx && (
              <div className="ml-4 mt-1 flex flex-col">
                {item.submenus.map((sub) => (
                  <Link
                    key={sub.title}
                    to={sub.path}
                    className="text-black no-underline text-sm px-6 py-2 rounded hover:bg-blue-700/30 hover:text-white transition font-medium"
                    style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                    onClick={() => setOpen(false)}
                  >
                    {sub.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
