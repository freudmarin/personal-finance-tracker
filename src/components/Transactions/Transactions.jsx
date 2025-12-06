import { useMemo, useState } from 'react';
import Card from '../UI/Card';
import { toCSV, downloadCSV } from '../../utils/csv';
import Modal from '../UI/Modal';
import TransactionForm from '../Transaction/TransactionForm';

// Accept onAdd for new transactions
export default function Transactions({ items, onDelete, onUpdate, onAdd, categories, typeFilter, setTypeFilter }) {
  const years = useMemo(() => {
    const set = new Set(items.map(i => i.date?.slice(0, 4) || 'Unknown'));
    return ['All', ...Array.from(set).sort((a, b) => b.localeCompare(a))];
  }, [items]);

  const [yearFilter, setYearFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);

  const filtered = useMemo(() => {
    let result = items;
    if (yearFilter !== 'All') {
      result = result.filter(i => i.date?.startsWith(yearFilter));
    }
    if (categoryFilter !== 'All') {
      result = result.filter(i => i.category.id === categoryFilter);
    }
    if (typeFilter && typeFilter !== 'all') {
      result = result.filter(i => i.type === typeFilter);
    }
    return result;
  }, [items, yearFilter, categoryFilter, typeFilter]);

  function exportCSV() {
    const csv = toCSV(filtered);
    downloadCSV(csv, 'transactions.csv');
  }

  function handleAdd() {
    setEditTx(null);
    setShowModal(true);
  }

  function handleEdit(tx) {
    setEditTx(tx);
    setShowModal(true);
  }

  return (
    <Card className="mt-4">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 rounded-t-2xl p-4 mb-4 shadow">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Income & Expenses</h2>
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition font-semibold text-base"
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' /></svg>
              New Entry
            </button>
            <button onClick={exportCSV} className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:from-indigo-600 hover:to-indigo-800 transition font-semibold text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-8m0 8l-4-4m4 4l4-4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20h16" /></svg>
              Export CSV
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Year filter */}
          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 min-w-[120px] font-medium text-base transition"
            style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
          >
            {years.map(y => (
              <option key={y} value={y} className="font-medium text-base text-gray-700 dark:text-gray-200">{y}</option>
            ))}
          </select>
          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 min-w-[160px] font-medium text-base transition"
            style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
          >
            <option value="All" className="font-medium text-base text-gray-700 dark:text-gray-200">All Categories</option>
            {(Array.isArray(categories) ? categories : []).map(cat => (
              <option key={cat.id} value={cat.id} className="font-medium text-base text-gray-700 dark:text-gray-200">{cat.name}</option>
            ))}
          </select>
          {/* Type filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'income', 'expense'].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-full font-medium border transition focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-gray-900 dark:focus:border-gray-100 ${typeFilter === type
                  ? (type === 'income'
                      ? 'bg-green-600 text-white border-gray-900 shadow'
                      : type === 'expense'
                        ? 'bg-red-600 text-white border-gray-900 shadow'
                        : 'bg-blue-600 text-white border-gray-900 shadow dark:border-gray-100')
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300 text-center py-8">No records. Add your first entry.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-white via-green-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 rounded-3xl shadow-lg p-6 flex flex-col border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-200 group"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg text-gray-800 dark:text-gray-100 group-hover:text-green-600 transition">{item.title}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${item.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">{item.date}</div>
              <div className="flex gap-2 flex-wrap mb-1">
                {Array.isArray(item.tags) && item.tags.map(tag => (
                  <span key={tag} className="bg-gray-200 dark:bg-gray-700 rounded px-2 py-0.5 text-xs">#{tag}</span>
                ))}
              </div>
              <div className="font-bold text-xl text-gray-900 dark:text-white">${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.category?.name}</div>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-medium shadow hover:bg-yellow-500 transition"
                  onClick={() => handleEdit(item)}
                >Edit</button>
                <button
                  className="bg-red-500 text-black px-4 py-2 rounded-xl font-medium shadow hover:bg-red-600 transition"
                  onClick={() => onDelete(item.id)}
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal onClose={() => { setShowModal(false); setEditTx(null); }}>
          <TransactionForm
            initial={editTx}
            onSubmit={data => {
              if (editTx) onUpdate(editTx.id, data);
              else if (onAdd) onAdd(data);
              setShowModal(false);
              setEditTx(null);
            }}
            onCancel={() => { setShowModal(false); setEditTx(null); }}
          />
        </Modal>
      )}
    </Card>
  );
}
