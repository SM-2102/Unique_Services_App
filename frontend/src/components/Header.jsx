import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPowerOff } from 'react-icons/fa';
import logo from '../assets/logo.png';
import UserMenu from './UserMenu';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-blue-900 p-3 px-8 shadow h-22">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-16 mr-4 ml-14" />
        <div className="flex flex-col justify-center">
          <span className="text-white text-4xl font-semibold tracking-wide leading-tight mt-1" style={{fontFamily: 'Times New Roman, Times, serif'}}>UNIQUE SERVICES</span>
          <span className="text-blue-50 text-lg font-medium mb-1" style={{fontFamily: 'Montserrat, sans-serif'}}>12 Sankharitola Street, Kolkata - 700014</span>
        </div>
      </div>
      {!isLoginPage && (
        <div className="flex items-center space-x-4 mr-14">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-900 hover:bg-red-500 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:scale-105 transform"
            title="Logout"
          >
            <FaPowerOff className="w-5 h-5" />
          </button>
          <UserMenu />
        </div>
      )}
    </header>
  );
};

export default Header;
