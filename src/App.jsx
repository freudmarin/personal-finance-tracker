import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Expenses from './components/Expenses/Expenses.jsx'
import Header from './components/Header.jsx'
import useDarkMode from './hooks/useDarkMode.js'
import NewExpense from './components/NewExpense/NewExpense.jsx'
import CategoriesPage from './components/Categories/CategoriesPage.jsx'
import { fetchExpenses, addExpense as apiAddExpense, updateExpense as apiUpdateExpense, deleteExpense as apiDeleteExpense, fetchCategories } from './utils/api'

const STORAGE_KEY = 'expense_tracker_items_v1'
const isProd = process.env.NODE_ENV === 'production'

export default function App(){
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [catError, setCatError] = useState(null)

  const [isDark, setIsDark] = useDarkMode('expense_dark_mode')

  const total = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (item.amount || 0), 0)
  }, [expenses])

  // Load expenses from backend or localStorage
  async function reloadExpenses() {
    setLoading(true)
    setError(null)
    try {
      const expensesData = await fetchExpenses()
      setExpenses(Array.isArray(expensesData) ? expensesData : [])
    } catch (e) {
      setExpenses([])
    }
    setLoading(false)
  }

  async function reloadCategories() {
    try {
      const cats = await fetchCategories()
      setCategories(Array.isArray(cats) ? cats : [])
    } catch {
      setCategories([])
      setCatError('Failed to load categories')
    }
  }

  useEffect(() => {
    reloadExpenses()
    reloadCategories()
  }, [])

  async function addExpense(item) {
    try {
      const newItem = await apiAddExpense(item)
      setExpenses(prev => [newItem, ...prev])
    } catch (e) {}
  }

  async function updateExpense(id, updated) {
    try {
      const newItem = await apiUpdateExpense(id, updated)
      setExpenses(prev => prev.map(e => e.id === id ? newItem : e))
    } catch (e) {}
  }

  async function deleteExpense(id) {
    try {
      await apiDeleteExpense(id)
      setExpenses(prev => prev.filter(e => e.id !== id))
    } catch (e) {}
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-3xl mx-auto">
          <Header isDark={isDark} toggleDark={() => setIsDark(d => !d)} />
          <nav className="mb-6 flex gap-4">
            <Link to="/" className="text-blue-600 hover:underline">Expenses</Link>
            <Link to="/categories" className="text-blue-600 hover:underline">Categories</Link>
          </nav>
          <Routes>
            <Route path="/categories" element={<CategoriesPage reloadExpenses={reloadExpenses} reloadCategories={reloadCategories} categories={categories} catError={catError} />} />
            <Route path="/" element={
              <>
                <NewExpense onAdd={addExpense} />
                {total > 0 && <h2 className="mt-6 text-xl font-semibold text-gray-800 dark:text-gray-100">Total Expenses: ${total.toFixed(2)}</h2>}
                {error && <div className="mb-4 text-red-600">{error}</div>}
                {loading ? (
                  <div className="text-gray-500 dark:text-gray-300">Loading...</div>
                ) : (
                  <Expenses
                    items={expenses}
                    onDelete={deleteExpense}
                    onUpdate={updateExpense}
                    categories={categories}
                  />
                )}
              </>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  )
}
