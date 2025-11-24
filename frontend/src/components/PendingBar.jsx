import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PendingBar = ({ pendingData = [], onSelect }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (id) => {
    if (onSelect) onSelect(id);
    setOpen(false);
  };

  return (
    <>
      {/* Sliding Panel (keeps out of header/footer via top/bottom offsets) */}
      <div
        className={`fixed right-0 w-80 max-w-[90vw] z-[2000] transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"} bg-blue-900/10 backdrop-blur-md shadow-2xl
          border border-blue-800/20 top-[88px] bottom-[30px] rounded-l-md overflow-hidden flex flex-col`}
      >
        {/* List (no separate header/footer inside - uses surrounding layout offsets) */}
        <ul className="flex-1 overflow-y-auto py-3 px-3 space-y-2 font-sans" style={{ fontFamily: "Montserrat, Arial, sans-serif" }}>
          {pendingData.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className="flex items-center justify-between gap-3 cursor-pointer rounded-md px-2 py-1 transition-colors duration-150 bg-transparent hover:bg-blue-800/10"
            >
              <div className="truncate text-sm text-black font-medium">
                {item.id} - <span className="text-black font-normal">{item.name}</span>
              </div>
            </li>
          ))}
          {pendingData.length === 0 && (
            <li className="text-center text-sm text-slate-300 py-6">No pending items</li>
          )}
        </ul>
      </div>
      {/* Handle (longer, with label) */}
      <div
        onClick={() => setOpen(!open)}
        className={`fixed top-1/2 -translate-y-1/2 z-[3000] flex items-center gap-2 bg-blue-900 text-white shadow-lg cursor-pointer
          px-4 py-3 rounded-l-xl select-none transition-all duration-300 ${open ? "right-80" : "right-0"}`}
        title="Toggle Pending Bar"
      >
        {open ? <FaChevronRight className="text-base" /> : <FaChevronLeft className="text-base" />}
        <span className="text-md font-bold">Pending</span>
      </div>
    </>
  );
};

export default PendingBar;
