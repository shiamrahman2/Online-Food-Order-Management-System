export function formatCurrency(amount) {
  const value = Number(amount || 0)
  return `৳${value.toFixed(2)}`
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    'Something went wrong. Please try again.'
  )
}

export function calculateCartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}
