"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSettings, FiSun, FiMoon } from 'react-icons/fi';

const DashboardPage = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // On component mount, set the theme based on localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className={`min-h-screen relative ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* First vertical line */}
      <div className={`absolute left-1/4 top-0 bottom-0 w-[3px] ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
      }`} />
      
      {/* Second vertical line */}
      <div className={`absolute left-3/4 top-0 bottom-0 w-[3px] ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
      }`} />

      <nav className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg relative z-10`}>
        <div className="w-full px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className={`text-xl font-bold pl-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Home
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 text-white' 
                    : 'hover:bg-gray-100 text-gray-600'
                } focus:outline-none`}
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <FiSun className="w-6 h-6" />
                ) : (
                  <FiMoon className="w-6 h-6" />
                )}
              </button>
              <div className="relative pr-2">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`p-2 rounded-full ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700 text-white' 
                      : 'hover:bg-gray-100 text-gray-600'
                  } focus:outline-none`}
                >
                  <FiSettings className="w-6 h-6" />
                </button>
                
                {isDropdownOpen && (
                  <div className={`absolute right-1 mt-2 w-48 rounded-md shadow-lg py-1 z-10 
                    ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <a
                      href="/dashboard/profile"
                      className={`block px-4 py-2 text-sm ${
                        theme === 'dark' 
                          ? 'text-gray-200 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        theme === 'dark' 
                          ? 'text-gray-200 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DashboardPage;