import React from 'react';
import logo from '../assets/logo.png';

const Header = () => {
  return (
  <header className="fixed top-0 left-0 w-full z-50 flex items-center bg-[#2C3E50] p-3 px-8 shadow h-20">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-16 mr-4 ml-14" />
           <div className="flex flex-col justify-center">
             <span className="text-white text-4xl font-semibold tracking-wide leading-tight mt-1" style={{fontFamily: 'Times New Roman, Times, serif'}}>UNIQUE SERVICES</span>
               <span className="text-blue-50 text-lg font-medium mb-1" style={{fontFamily: 'Montserrat, sans-serif'}}>12 Sankharitola Street, Kolkata - 700014</span>
           </div>
      </div>
    </header>
  );
};

export default Header;
