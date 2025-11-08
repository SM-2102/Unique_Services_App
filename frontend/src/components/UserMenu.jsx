import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaKey, FaUserPlus, FaUserMinus, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Mock user data - replace with actual user context/state
  const user = {
    username: 'Admin User',
    role: 'USER'  // Changed to ADMIN to test the admin features
  };

  const roleLabels = {
    ADMIN: "Administrator",
    USER: "Standard User",
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  const handleChangePassword = () => {
    // Add change password logic here
  };

  const handleCreateUser = () => {
    navigate('/not-available'); // Update this when the create user page is ready
  };

  const handleDeleteUser = () => {
    navigate('/not-available'); // Update this when the delete user page is ready
  };

  const handleShowUsers = () => {
    navigate('/not-available'); // Update this when the user list page is ready
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-700 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FaUser className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-m font-medium text-gray-900">{user.username}</p>
            <p className="text-s text-gray-500">
            {roleLabels[user.role] || user.role}
            </p>
          </div>

          {user.role === 'ADMIN' && (
            <>
              <button
                onClick={handleCreateUser}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FaUserPlus className="mr-3 h-4 w-4 text-blue-500" />
                Create User
              </button>

              <button
                onClick={handleDeleteUser}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FaUserMinus className="mr-3 h-4 w-4 text-orange-500" />
                Delete User
              </button>

              <button
                onClick={handleShowUsers}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FaUsers className="mr-3 h-4 w-4 text-green-500" />
                Show All Users
              </button>

              <div className="border-t border-gray-100 my-1"></div>
            </>
          )}

          <button
            onClick={handleChangePassword}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <FaKey className="mr-3 h-4 w-4 text-gray-400" />
            Change Password
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;