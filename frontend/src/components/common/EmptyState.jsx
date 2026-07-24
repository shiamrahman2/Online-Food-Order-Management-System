import { PackageOpen } from 'lucide-react'

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'Nothing here yet',
  message = '',
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center mb-4">
        <Icon className="text-mango-dark" size={28} />
      </div>
      <h3 className="font-display text-xl font-semibold text-ink mb-1">{title}</h3>
      {message && <p className="text-ink/60 max-w-sm mb-4">{message}</p>}
      {action}
    </div>
  )
}
