import { useEffect, useMemo, useState } from 'react'
import Expenses from './components/Expenses/Expenses.jsx'
import Header from './components/Header.jsx'
import useDarkMode from './hooks/useDarkMode.js'
import NewExpense from './components/NewExpense/NewExpense.jsx'
import { fetchExpenses, addExpense as apiAddExpense, updateExpense as apiUpdateExpense, deleteExpense as apiDeleteExpense } from './utils/api'

const STORAGE_KEY = 'expense_tracker_items_v1'
const isProd = process.env.NODE_ENV === 'production'

export default function App(){
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isDark, setIsDark] = useDarkMode('expense_dark_mode')

  const total = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (item.amount || 0), 0)
  }, [expenses])



  // Load expenses from backend or localStorage
  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
        try {
          const data = await fetchExpenses()
          setExpenses(Array.isArray(data) ? data : [])
        } catch (e) {
          setExpenses([])
        }

      setLoading(false)
    }
    load()
  }, [])




  async function addExpense(item) {
      try {
        const newItem = await apiAddExpense(item)
        setExpenses(prev => [newItem, ...prev])
      } catch (e) {
      
      }
  }


  async function updateExpense(id, updated) {
      try {
        const newItem = await apiUpdateExpense(id, updated)
        setExpenses(prev => prev.map(e => e.id === id ? newItem : e))
      } catch (e) {
      
      }
  }


  async function deleteExpense(id) {
      try {
        await apiDeleteExpense(id)
        setExpenses(prev => prev.filter(e => e.id !== id))
      } catch (e) {
  
      }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-3xl mx-auto">
        <Header isDark={isDark} toggleDark={() => setIsDark(d => !d)} />
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
            onExport={()=> { /* noop placeholder */ }}
          />
        )}
      </div>
    </div>
  )
}
