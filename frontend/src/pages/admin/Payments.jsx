import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Receipt, CheckCircle2 } from 'lucide-react'
import adminService from '../../services/adminService.js'
import Skeleton from '../../components/common/Skeleton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Modal from '../../components/common/Modal.jsx'
import { formatCurrency, formatDate, getErrorMessage } from '../../utils/helpers.js'

const STATUS_OPTIONS = ['pending', 'paid', 'failed', 'refunded']

const STATUS_STYLE = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-basil/10 text-basil',
  failed: 'bg-chili/10 text-chili',
  refunded: 'bg-indigo-100 text-indigo-700',
}

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState(null)
  const [status, setStatus] = useState('pending')
  const [txnId, setTxnId] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    adminService
      .getPayments()
      .then((res) => setPayments(res.data.data || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openEdit = (p) => {
    setEditTarget(p)
    setStatus(p.payment_status)
    setTxnId(p.transaction_id || '')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await adminService.updatePaymentStatus(editTarget.id, { payment_status: status, transaction_id: txnId })
      toast.success('Payment status updated')
      setEditTarget(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink mb-6">Payments</h1>

      {loading && <Skeleton count={6} />}

      {!loading && payments.length === 0 && (
        <EmptyState icon={Receipt} title="No payments yet" message="Payments will appear here as orders are placed." />
      )}

      {!loading && payments.length > 0 && (
        <div className="overflow-x-auto ticket-card shadow-card">
          <table className="table w-full">
            <thead>
              <tr className="text-xs uppercase text-ink/50 border-b border-sand">
                <th className="py-3 px-4 text-left">Order</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Method</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Transaction ID</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-sand/60 last:border-none">
                  <td className="py-3 px-4 font-medium text-ink">#{p.order_id}</td>
                  <td className="py-3 px-4 price-tag text-ink/80">{formatCurrency(p.amount)}</td>
                  <td className="py-3 px-4 text-ink/60 capitalize">{p.payment_method}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${STATUS_STYLE[p.payment_status] || 'bg-gray-100 text-gray-600'}`}>
                      {p.payment_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-ink/50 text-xs">{p.transaction_id || '—'}</td>
                  <td className="py-3 px-4 text-ink/50 text-xs">{formatDate(p.created_at)}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => openEdit(p)} className="btn btn-sm btn-ghost focus-ring" aria-label="Update status"><CheckCircle2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={Boolean(editTarget)} onClose={() => setEditTarget(null)} title={`Update payment #${editTarget?.id}`} size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="select w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Transaction ID</label>
            <input value={txnId} onChange={(e) => setTxnId(e.target.value)} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="TXN123456789" />
          </div>
          <button onClick={handleSave} disabled={saving} className="btn w-full bg-mango hover:bg-mango-dark text-white border-none rounded-xl focus-ring">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
