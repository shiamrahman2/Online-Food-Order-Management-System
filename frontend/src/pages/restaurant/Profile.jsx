 import { useState } from 'react'
import toast from 'react-hot-toast'
import { Store, Lock, Eye, EyeOff } from 'lucide-react'
import restaurantService from '../../services/restaurantService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { getErrorMessage } from '../../utils/helpers.js'

export default function RestaurantProfile() {
  const { user, refreshUser } = useAuth()

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    description: user?.description || '',
    address: user?.address || '',
    phone: user?.phone || '',
    logo: user?.logo || '',
  })

  const [pwForm, setPwForm] = useState({
    old_password: '',
    new_password: ''
  })

  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const updateField = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.value
    }))

  const updatePwField = (key) => (e) =>
    setPwForm((f) => ({
      ...f,
      [key]: e.target.value
    }))

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const res = await restaurantService.updateProfile(form)
      refreshUser(res.data.data)
      toast.success('Profile updated successfully')
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
      await restaurantService.changePassword(pwForm)
      toast.success('Password changed successfully')
      setPwForm({
        old_password: '',
        new_password: ''
      })
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSavingPw(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="font-display text-3xl font-bold text-ink">
        Restaurant profile
      </h1>

      {/* PROFILE UPDATE */}
      <form onSubmit={handleProfileSubmit} className="ticket-card shadow-card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg flex items-center gap-2 text-ink">
          <Store size={18} className="text-mango-dark" />
          Business details
        </h2>

        {/* Name */}
        <div>
          <label className="text-sm font-medium text-ink/70">Restaurant name</label>
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

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-ink/70">Description</label>
          <textarea
            value={form.description}
            onChange={updateField('description')}
            rows={2}
            className="textarea w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"
          />
        </div>

        {/* Address */}
        <div>
          <label className="text-sm font-medium text-ink/70">Address</label>
          <input
            value={form.address}
            onChange={updateField('address')}
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

        {/* Logo */}
        <div>
          <label className="text-sm font-medium text-ink/70">Logo URL</label>
          <input
            value={form.logo}
            onChange={updateField('logo')}
            placeholder="https://..."
            className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"
          />
        </div>

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
          <Lock size={18} className="text-mango-dark" />
          Change password
        </h2>

        {/* Old Password */}
        <div>
          <label className="text-sm font-medium text-ink/70">Current password</label>
          <div className="relative mt-1">
            <input
              type={showOldPassword ? 'text' : 'password'}
              required
              value={pwForm.old_password}
              onChange={updatePwField('old_password')}
              className="input w-full bg-cream border-sand focus:border-mango rounded-xl focus-ring pr-12"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
              className="input w-full bg-cream border-sand focus:border-mango rounded-xl focus-ring pr-12"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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