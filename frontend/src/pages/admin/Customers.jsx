import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Users } from 'lucide-react'
import adminService from '../../services/adminService.js'
import Skeleton from '../../components/common/Skeleton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { formatDate, getErrorMessage } from '../../utils/helpers.js'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService
      .getCustomers()
      .then((res) => setCustomers(res.data.data || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink mb-6">Customers</h1>

      {loading && <Skeleton count={6} />}

      {!loading && customers.length === 0 && (
        <EmptyState icon={Users} title="No customers yet" message="Customers who sign up will appear here." />
      )}

      {!loading && customers.length > 0 && (
        <div className="overflow-x-auto ticket-card shadow-card">
          <table className="table w-full">
            <thead>
              <tr className="text-xs uppercase text-ink/50 border-b border-sand">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Address</th>
                <th className="py-3 px-4 text-left">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-sand/60 last:border-none">
                  <td className="py-3 px-4 font-medium text-ink">{c.name}</td>
                  <td className="py-3 px-4 text-ink/60">{c.email}</td>
                  <td className="py-3 px-4 text-ink/60">{c.phone}</td>
                  <td className="py-3 px-4 text-ink/60 max-w-xs truncate">{c.address}</td>
                  <td className="py-3 px-4 text-ink/50 text-sm">{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
