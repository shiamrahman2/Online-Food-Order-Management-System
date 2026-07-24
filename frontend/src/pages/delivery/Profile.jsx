import { useState } from 'react'
import toast from 'react-hot-toast'
import { Bike, Lock, Eye, EyeOff } from 'lucide-react'
import deliveryService from '../../services/deliveryService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { getErrorMessage } from '../../utils/helpers.js'

const VEHICLE_TYPES = ['motorcycle', 'bicycle', 'car', 'van']

export default function DeliveryProfile() {
  const { user, refreshUser } = useAuth()

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    vehicle_type: user?.vehicle_type || 'motorcycle',
    vehicle_number: user?.vehicle_number || '',
    is_available: user?.is_available ?? false,
  })

  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const updateField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const updatePwField = (key) => (e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const res = await deliveryService.updateProfile(form)
      refreshUser(res.data.data)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setSavingPw(true)
    try {
      await deliveryService.changePassword(pwForm)
      toast.success('Password changed')
      setPwForm({ old_password: '', new_password: '' })
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSavingPw(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="font-display text-3xl font-bold text-ink">Your profile</h1>

      {/* PROFILE UPDATE */}
      <form onSubmit={handleProfileSubmit} className="ticket-card shadow-card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg flex items-center gap-2 text-ink">
          <Bike size={18} className="text-mango-dark" /> Rider details
        </h2>

        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-ink/70">Full name</label>
          <input
            value={form.name}
            onChange={updateField('name')}
            className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-ink/70">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={updateField('email')}
            className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium text-ink/70">Phone</label>
          <input
            value={form.phone}
            onChange={updateField('phone')}
            className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"
          />
        </div>

        {/* Vehicle Type & Number */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Vehicle type</label>
            <select
              value={form.vehicle_type}
              onChange={updateField('vehicle_type')}
              className="select w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"
            >
              {VEHICLE_TYPES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Vehicle number</label>
            <input
              value={form.vehicle_number}
              onChange={updateField('vehicle_number')}
              className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"
            />
          </div>
        </div>

        {/* Availability Checkbox */}
        <label className="flex items-center gap-2 text-sm font-medium text-ink/70">
          <input
            type="checkbox"
            checked={form.is_available}
            onChange={(e) => setForm((f) => ({ ...f, is_available: e.target.checked }))}
            className="checkbox checkbox-sm"
          />
          Available for Delivery
        </label>

        <button
          type="submit"
          disabled={savingProfile}
          className="btn bg-mango hover:bg-mango-dark text-white border-none rounded-xl focus-ring"
        >
          {savingProfile ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      {/* PASSWORD CHANGE */}
      <form onSubmit={handlePasswordSubmit} className="ticket-card shadow-card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg flex items-center gap-2 text-ink">
          <Lock size={18} className="text-mango-dark" /> Change password
        </h2>

        {/* Current Password */}
        <div>
          <label className="text-sm font-medium text-ink/70">Current password</label>
          <div className="relative mt-1">
            <input
              type={showOldPassword ? 'text' : 'password'}
              required
              value={pwForm.old_password}
              onChange={updatePwField('old_password')}
              className="input w-full bg-cream border-sand focus:border-mango rounded-xl focus-ring pr-10"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="text-sm font-medium text-ink/70">New password</label>
          <div className="relative mt-1">
            <input
              type={showNewPassword ? 'text' : 'password'}
              required
              value={pwForm.new_password}
              onChange={updatePwField('new_password')}
              className="input w-full bg-cream border-sand focus:border-mango rounded-xl focus-ring pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={savingPw}
          className="btn bg-ink hover:bg-plum text-white border-none rounded-xl focus-ring"
        >
          {savingPw ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  )
}