import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle.jsx';  
export default function Header({ isDark, toggleDark }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { accessToken, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="mb-6 sm:mb-8 sticky top-0 z-30 bg-white/95 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 backdrop-blur-xl shadow-xl border-b-2 border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span className="text-lg sm:text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent select-none hidden sm:block">Personal Finance Tracker</span>
        </Link>
        
        <nav className="hidden md:flex gap-2 lg:gap-3 items-center">
          {accessToken && (
            <>
              <Link to="/" className="text-gray-700 dark:text-gray-200 font-semibold hover:text-green-600 dark:hover:text-green-400 transition-all px-4 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800/50 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                <span className="hidden lg:inline">Dashboard</span>
              </Link>
              <Link to="/categories" className="text-gray-700 dark:text-gray-200 font-semibold hover:text-green-600 dark:hover:text-green-400 transition-all px-4 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800/50 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                <span className="hidden lg:inline">Categories</span>
              </Link>
              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2"></div>
            </>
          )}
          <ThemeToggle isDark={isDark} toggle={toggleDark} />
          {accessToken ? (
            <>
              {user?.email && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{user.email}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
              </button>
            </>
          ) : (
            <>
              {window.location.pathname !== '/login' && (
                <Link to="/login" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">Login</Link>
              )}
              {window.location.pathname !== '/register' && (
                <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">Register</Link>
              )}
            </>
          )}
        </nav>
        
        {/* Hamburger for mobile */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle isDark={isDark} toggle={toggleDark} />
          <button onClick={() => setMenuOpen(m => !m)} className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
        
        {menuOpen && (
          <div className="absolute top-full right-2 sm:right-4 mt-3 w-64 bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl flex flex-col py-3 z-40 animate-fade-in backdrop-blur-xl">
            {accessToken && (
              <>
                <Link to="/" className="mx-3 px-4 py-3 text-gray-700 dark:text-gray-200 font-semibold hover:bg-green-50 dark:hover:bg-gray-800/50 hover:text-green-600 dark:hover:text-green-400 transition rounded-xl flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Dashboard
                </Link>
                <Link to="/categories" className="mx-3 px-4 py-3 text-gray-700 dark:text-gray-200 font-semibold hover:bg-green-50 dark:hover:bg-gray-800/50 hover:text-green-600 dark:hover:text-green-400 transition rounded-xl flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                  Categories
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2 mx-3"></div>
              </>
            )}
            {accessToken ? (
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="mx-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="mx-3 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-xl font-semibold text-center shadow-lg hover:shadow-xl transition-all" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="mx-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-semibold text-center shadow-lg hover:shadow-xl transition-all" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}