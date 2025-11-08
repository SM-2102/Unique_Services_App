import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Reusable MenuCard component with action-overlay support.
 * Props:
 * - title: string (required)
 * - children: React nodes (optional)
 * - onClick: function (optional) - legacy, not required when using actions
 * - icon: React node (optional)
 * - actions: Array<{ label: string, path: string }> (optional) - action buttons shown on overlay
 */
const MenuCard = ({ title, children, onClick, icon, actions = [], actionsGridCols = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutside = (e) => {
      if (isOpen && ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  const handleCardClick = (e) => {
    // If actions exist, toggle the overlay instead of invoking onClick
    if (actions && actions.length > 0) {
      setIsOpen((v) => !v);
      return;
    }
    if (onClick) onClick(e);
  };

  const gradientBarClass = isOpen ? 'w-full transition-all duration-500' : 'w-0 transition-all duration-500';

  return (
    <div
      ref={ref}
      role={onClick || (actions && actions.length > 0) ? 'button' : 'group'}
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if ((onClick || (actions && actions.length > 0)) && (e.key === 'Enter' || e.key === ' ')) handleCardClick(e);
      }}
      className={
        'relative bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200 ease-in-out p-6 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-blue-300 h-52 overflow-hidden'
      }
    >
      {/* animated bluish left-to-right bar */}
      <div className={`absolute left-0 top-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 opacity-20 ${gradientBarClass}`} aria-hidden="true" />

      {/* overlay that contains action buttons when open */}
      {isOpen && actions && actions.length > 0 && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10 px-4">
          {(() => {
            // determine cols: prefer explicit prop, else default behavior
            const cols = actionsGridCols || (actions.length === 1 ? 1 : actions.length <= 4 ? 2 : 2);
            // For single button, use flex instead of grid for perfect centering
            const containerClass = actions.length === 1
              ? "flex justify-center items-center w-full"
              : `grid ${cols === 2 ? 'grid-cols-2 max-w-[350px]' : 'grid-cols-3 max-w-[480px]'} w-full gap-3 place-items-center`;

            const buttonClass = actions.length === 1
              ? "px-6 py-2.5 w-[180px] text-sm mx-auto"
              : cols === 3
                ? "px-3 py-1.5 w-[130px] text-xs"
                : "px-4 py-2 w-[150px] text-sm";

            return (
              <div className={containerClass}>
                {actions.map((a, idx) => (
                  <button
                    key={idx}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      if (a.path) navigate(a.path);
                      setIsOpen(false);
                    }}
                    className={`${buttonClass} rounded-md bg-white/95 border border-white/40 shadow-sm hover:shadow-md font-medium text-blue-800 hover:bg-white hover:scale-105 transform transition-all duration-150`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="relative group">
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-800 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-500 transition-all duration-300" style={{fontFamily: 'Times New Roman, serif'}}>{title}</h3>
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full transition-all duration-300"></div>
        </div>
        <div className="ml-3 inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-inner">
          {icon ? (
            React.isValidElement(icon) ? (
              React.cloneElement(icon, { className: 'h-6 w-6' })
            ) : (
              icon
            )
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m4 4v-6a2 2 0 00-2-2h-3" />
            </svg>
          )}
        </div>
      </div>

      <div className="mt-5 text-gray-600 min-h-[48px]">
        {children ? (
          children
        ) : (
          <div className="text-sm italic text-gray-400">No data available</div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
