// CSV helpers for export (and import if needed)
export function toCSV(items) {
  const headers = ['id', 'title', 'amount', 'date', 'category', 'tags']
  const rows = items.map((e, i) => {
    // Use sequential ID for export
    const id = i + 1
    const title = String(e.title || '').replace(/"/g, '""')
    const amount = e.amount ?? ''
    let dateStr = ''
    if (e.date) {
      const d = (e.date instanceof Date) ? e.date : new Date(e.date)
      if (!isNaN(d)) dateStr = d.toISOString().slice(0, 10)
    }
    const category = String(e.category?.name || '').replace(/"/g, '""')
    const tags = Array.isArray(e.tags) ? e.tags.join(', ').replace(/"/g, '""') : '' 
    return `${id},"${title}",${amount},"${dateStr}","${category}","${tags}"`
  })
  return [headers.join(','), ...rows].join('\r\n')
}

export function downloadCSV(csv, filename = 'expenses.csv') {
  const blob = new Blob(["\uFEFF", csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
