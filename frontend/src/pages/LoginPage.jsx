import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div
      className="flex items-center justify-center bg-[#f]"
      style={{ minHeight: 'calc(100vh - 5rem * 2)' }} // 2 x h-15 = 5rem x 2
    >
  <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-lg p-6 flex flex-col items-center mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-wide text-center">Unique Services Management App</h2>
        <form className="w-full flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <label className="text-gray-700 text-base font-medium w-28 text-left" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium pr-10"
              placeholder="Username"
              autoComplete="username"
            />
          </div>
          <div className="flex items-center gap-2 relative">
            <label className="text-gray-700 text-base font-medium w-28 text-left" htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium pr-10"
              placeholder="Password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-bold text-base shadow hover:bg-blue-700 transition-colors duration-200"
          >
            Login
          </button>
        </form>
        <div className="mt-4 w-full flex justify-end">
          <button className="text-s text-blue-600 hover:text-red-800 font-medium underline transition-colors duration-150">Change Password</button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;