import React from 'react';

/**
 * Reusable MenuCard component
 * Props:
 * - title: string (required)
 * - children: React nodes (optional) - metrics or extra content
 * - onClick: function (optional)
 */
const MenuCard = ({ title, children, onClick, icon }) => {
  return (
    <div
      role={onClick ? 'button' : 'group'}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick(e);
      }}
      className={
        'bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200 ease-in-out p-6 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-blue-300 h-52'
      }
    >
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
