import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '../../utils/constants'

export default function StatusBadge({ status }) {
  const label = ORDER_STATUS_LABEL[status] || status
  const color = ORDER_STATUS_COLOR[status] || 'bg-gray-100 text-gray-700 border-gray-200'

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${color}`}>
      {label}
    </span>
  )
}
