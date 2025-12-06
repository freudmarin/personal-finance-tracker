import ThemeToggle from './ThemeToggle'
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Header({ isDark, toggleDark }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="mb-8 sticky top-0 z-30 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-lg rounded-2xl px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="text-2xl md:text-3xl font-extrabold text-green-600 select-none">💰</span>
        <span className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white select-none">Personal Finance Tracker</span>
      </div>
      <nav className="hidden md:flex gap-6 items-center">
        <Link to="/" className="text-gray-700 dark:text-gray-200 font-medium hover:text-green-600 dark:hover:text-green-400 transition">Income & Expenses</Link>
        <Link to="/categories" className="text-gray-700 dark:text-gray-200 font-medium hover:text-green-600 dark:hover:text-green-400 transition">Categories</Link>
        <ThemeToggle isDark={isDark} toggle={toggleDark} />
      </nav>
      {/* Hamburger for mobile */}
      <div className="md:hidden flex items-center gap-2">
        <ThemeToggle isDark={isDark} toggle={toggleDark} />
        <button onClick={() => setMenuOpen(m => !m)} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      {menuOpen && (
        <div className="absolute top-full right-4 mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-lg flex flex-col py-2 z-40 animate-fade-in">
          <Link to="/" className="px-6 py-3 text-gray-700 dark:text-gray-200 font-medium hover:text-green-600 dark:hover:text-green-400 transition" onClick={() => setMenuOpen(false)}>Income & Expenses</Link>
          <Link to="/categories" className="px-6 py-3 text-gray-700 dark:text-gray-200 font-medium hover:text-green-600 dark:hover:text-green-400 transition" onClick={() => setMenuOpen(false)}>Categories</Link>
        </div>
      )}
    </header>
  )
}