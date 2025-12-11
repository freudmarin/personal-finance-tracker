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
    <header className="mb-6 sm:mb-8 sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-xl sm:text-2xl md:text-3xl">💰</span>
        <span className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent select-none">Personal Finance Tracker</span>
      </div>
      <nav className="hidden md:flex gap-4 lg:gap-6 items-center">
        {accessToken && (
          <>
            <Link to="/" className="text-gray-700 dark:text-gray-200 font-semibold hover:text-green-600 dark:hover:text-green-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Dashboard</Link>
            <Link to="/categories" className="text-gray-700 dark:text-gray-200 font-semibold hover:text-green-600 dark:hover:text-green-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Categories</Link>
          </>
        )}
        <ThemeToggle isDark={isDark} toggle={toggleDark} />
        {accessToken ? (
          <>
            {user?.email && <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm font-medium">{user.email}</span>}
            <button
              onClick={handleLogout}
              className="ml-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
            >Logout</button>
          </>
        ) : (
          <>
            {/* Hide Login/Register links if already on those pages */}
            {window.location.pathname !== '/login' && (
              <Link to="/login" className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">Login</Link>
            )}
            {window.location.pathname !== '/register' && (
              <Link to="/register" className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">Register</Link>
            )}
          </>
        )}
      </nav>
      {/* Hamburger for mobile */}
      <div className="md:hidden flex items-center gap-2">
        <ThemeToggle isDark={isDark} toggle={toggleDark} />
        <button onClick={() => setMenuOpen(m => !m)} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      {menuOpen && (
        <div className="absolute top-full right-2 sm:right-4 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl flex flex-col py-2 z-40 animate-fade-in">
          {accessToken && (
            <>
              <Link to="/" className="px-4 py-3 text-gray-700 dark:text-gray-200 font-semibold hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400 transition" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/categories" className="px-4 py-3 text-gray-700 dark:text-gray-200 font-semibold hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400 transition" onClick={() => setMenuOpen(false)}>Categories</Link>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            </>
          )}
          {accessToken ? (
            <button
              onClick={() => { setMenuOpen(false); handleLogout(); }}
              className="mx-4 my-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
            >Logout</button>
          ) : (
            <>
              <Link to="/login" className="mx-4 my-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-center shadow-md hover:shadow-lg transition-all" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="mx-4 my-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-center shadow-md hover:shadow-lg transition-all" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}