import { useEffect, useState } from 'react'
import Input from '../UI/Input'
import Button from '../UI/Button'
import { fetchCategories } from '../../utils/api'

export default function TransactionForm({ onSubmit, onCancel, initial }) {
	const [title, setTitle] = useState(initial?.title || '')
	const [amount, setAmount] = useState(initial?.amount ?? '')
	const [date, setDate] = useState(initial?.date || '')
	const [categoryId, setCategoryId] = useState(
		initial?.categoryId || initial?.category?.id || ''
	)
	const [type, setType] = useState(initial?.type || 'expense')
	const [tags, setTags] = useState(Array.isArray(initial?.tags) ? initial.tags.join(', ') : '')
	const [categories, setCategories] = useState([])
	const [errors, setErrors] = useState({})

	useEffect(() => {
		fetchCategories().then(cats => {
			setCategories(cats);
			// If editing, set categoryId from initial.category.id if present and not already set
			if (initial?.category?.id && !categoryId) {
				setCategoryId(initial.category.id);
			}
		}).catch(() => setCategories([]));
		// eslint-disable-next-line
	}, []);

	function validate() {
		const newErrors = {}
		if (!title.trim()) newErrors.title = 'Title is required.'
		if (!amount || isNaN(amount) || Number(amount) <= 0) newErrors.amount = 'Amount must be a positive number.'
		if (!date) newErrors.date = 'Date is required.'
		if (!categoryId) newErrors.categoryId = 'Category is required.'
		if (!type) newErrors.type = 'Type is required.'
		// tags are optional
		return newErrors
	}

	function handleTitleChange(e) {
		const value = e.target.value
		setTitle(value)
		setErrors(prev => {
			const newErrors = { ...prev }
			if (value.trim()) delete newErrors.title
			else newErrors.title = 'Title is required.'
			return newErrors
		})
	}

	function handleAmountChange(e) {
		const value = e.target.value
		setAmount(value)
		setErrors(prev => {
			const newErrors = { ...prev }
			if (value && !isNaN(value) && Number(value) > 0) delete newErrors.amount
			else newErrors.amount = 'Amount must be a positive number.'
			return newErrors
		})
	}

	function handleDateChange(e) {
		const value = e.target.value
		setDate(value)
		setErrors(prev => {
			const newErrors = { ...prev }
			if (value) delete newErrors.date
			else newErrors.date = 'Date is required.'
			return newErrors
		})
	}

	function submit(e) {
		e.preventDefault()
		const newErrors = validate()
		setErrors(newErrors)
		if (Object.keys(newErrors).length > 0) return
		const tagsList = tags.split(',').map(t => t.trim()).filter(Boolean)
		onSubmit({ title: title.trim(), amount: Number(amount), date, categoryId, type, tags: tagsList })
	}

	return (
		<form onSubmit={submit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow flex flex-col gap-4">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
					<Input
						placeholder="Title"
						value={title}
						onChange={handleTitleChange}
						className={`border p-3 text-base rounded-lg w-full min-w-[200px] max-w-[400px] ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
					/>
					{errors.title && (
						<span className="block mt-1 text-xs text-red-600">
							{errors.title}
						</span>
					)}
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
					<select
						value={type}
						onChange={e => setType(e.target.value)}
						className={`border p-3 text-base rounded-lg w-full min-w-[200px] max-w-[400px] ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
					>
						<option value="expense">Expense</option>
						<option value="income">Income</option>
					</select>
					{errors.type && (
						<span className="block mt-1 text-xs text-red-600">{errors.type}</span>
					)}
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
					<Input
						type="number"
						placeholder="Amount"
						value={amount}
						onChange={handleAmountChange}
						min="0"
						step="0.01"
						className={`border p-3 text-base rounded-lg w-full min-w-[200px] max-w-[400px] ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
					/>
					{errors.amount && (
						<span className="block mt-1 text-xs text-red-600">
							{errors.amount}
						</span>
					)}
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
					<select
						value={categoryId}
						onChange={e => {
							const value = e.target.value;
							setCategoryId(value);
							setErrors(prev => {
								const newErrors = { ...prev };
								if (value) delete newErrors.categoryId;
								else newErrors.categoryId = 'Category is required.';
								return newErrors;
							});
						}}
						className={`border p-3 text-base rounded-lg w-full min-w-[200px] max-w-[400px] ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
					>
						<option value="">Select category</option>
						{categories.map(cat => (
							<option key={cat.id} value={cat.id}>{cat.name}</option>
						))}
					</select>
					{errors.categoryId && (
						<span className="block mt-1 text-xs text-red-600">{errors.categoryId}</span>
					)}
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
					<Input
						placeholder="e.g. groceries, food, work"
						value={tags}
						onChange={e => setTags(e.target.value)}
						className={`border p-3 text-base rounded-lg w-full min-w-[200px] max-w-[400px] ${errors.tags ? 'border-red-500' : 'border-gray-300'}`}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
					<Input
						type="date"
						value={date}
						onChange={handleDateChange}
						className={`border p-3 text-base rounded-lg w-full min-w-[200px] max-w-[400px] ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
						placeholder="mm/dd/yyyy"
					/>
					{errors.date && (
						<span className="block mt-1 text-xs text-red-600">
							{errors.date}
						</span>
					)}
				</div>
			</div>
			<div className="flex gap-4 items-end mt-2">
				<Button
					type="button"
					className="border border-gray-300 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600"
					onClick={onCancel}
				>
					Cancel
				</Button>
				<Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
			</div>
		</form>
	)
}