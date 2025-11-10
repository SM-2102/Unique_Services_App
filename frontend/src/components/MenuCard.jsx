import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowForward } from 'react-icons/io5';
import { RiCustomerService2Line } from 'react-icons/ri';
import { BiLoaderAlt } from 'react-icons/bi';

/**
 * Reusable MenuCard component with action-overlay support.
 * Props:
 * - title: string (required)
 * - children: React nodes (optional)
 * - onClick: function (optional) - legacy, not required when using actions
 * - icon: React node (optional)
 * - actions: Array<{ label: string, path: string }> (optional) - action buttons shown on overlay
 */
const MenuCard = ({ title, children, onClick, icon, actions = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  
  // Function to check if the card should show enquiry
  const shouldShowEnquiry = (cardTitle) => {
    const normalizedTitle = cardTitle?.toLowerCase().trim() || '';
    return !normalizedTitle.includes('customer') && !normalizedTitle.includes('challan');
  };

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
              let containerClass = "";
              const buttonClass =
                "px-3 py-2 w-[172px] text-sm gap-1.5 flex items-center justify-center border border-transparent shadow-sm";

              if (actions.length === 1) {
                // Single button centered
                containerClass = "flex justify-center items-center w-full";
              } else if (actions.length === 2) {
                // Two buttons stacked vertically
                containerClass = "grid grid-cols-1 max-w-[200px] w-full gap-2.5 place-items-center";
              } else if (actions.length === 5) {
                // Special layout: 2x2 grid + 1 centered below
                containerClass = "grid grid-cols-2 max-w-[350px] w-full gap-2.5 place-items-center";
              } else {
                // Default layout: 2-column grid for 3–4 buttons
                containerClass = "grid grid-cols-2 max-w-[350px] w-full gap-2.5 place-items-center";
              }

              return (
                <div className={containerClass}>
                  {actions.map((a, idx) => {
                    // For the 5-button case: center the last one
                    const specialClass =
                      actions.length === 5 && idx === 4 ? "col-span-2 justify-self-center" : "";

                    return (
                      <button
                        key={idx}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          if (a.path) navigate(a.path);
                          setIsOpen(false);
                        }}
                        className={`${buttonClass} ${specialClass} rounded-md bg-white/95 border border-white/40 shadow-sm hover:shadow-md font-medium text-blue-800 hover:bg-white hover:scale-105 transform transition-all duration-150`}
                      >
                        {a.label}
                      </button>
                    );
                  })}
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
          <div className="flex flex-col items-center justify-center space-y-2">
            <BiLoaderAlt className="w-8 h-8 text-blue-600 animate-spin" />
            <div className="relative">
              <span className="text-sm font-medium text-blue-600 inline-block animate-[pulse_2s_ease-in-out_infinite] opacity-0">
                Loading Data ...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Bar - Hidden for customer and challan */}
      {shouldShowEnquiry(title) && (
        <div 
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            navigate('/page-not-available');
          }}
          className="absolute bottom-4 right-4 bg-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
        >
          <div className="relative overflow-hidden rounded-full">
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Enquiry
                </span>
              </div>
              <div className="bg-gradient-to-r from-white-500 to-white-700 rounded-full p-1 transform  transition-transform duration-300">
                <RiCustomerService2Line className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuCard;
