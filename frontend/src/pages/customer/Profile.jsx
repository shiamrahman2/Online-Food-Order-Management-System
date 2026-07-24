// import { useState } from 'react'
// import toast from 'react-hot-toast'
// import { User, Lock } from 'lucide-react'
// import customerService from '../../services/customerService.js'
// import { useAuth } from '../../context/AuthContext.jsx'
// import { getErrorMessage } from '../../utils/helpers.js'
// import { Eye, EyeOff } from 'lucide-react'

// export default function CustomerProfile() {
//   const { user, refreshUser } = useAuth()
//   const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' })
//   const [pwForm, setPwForm] = useState({ old_password: '', new_password: '' })
//   const [savingProfile, setSavingProfile] = useState(false)
//   const [savingPw, setSavingPw] = useState(false)

//   const updateField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
//   const updatePwField = (key) => (e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault()
//     setSavingProfile(true)
//     try {
//       const res = await customerService.updateProfile(form)
//       refreshUser(res.data.data)
//       toast.success('Profile updated')
//     } catch (err) {
//       toast.error(getErrorMessage(err))
//     } finally {
//       setSavingProfile(false)
//     }
//   }

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault()
//     setSavingPw(true)
//     try {
//       await customerService.changePassword(pwForm)
//       toast.success('Password changed')
//       setPwForm({ old_password: '', new_password: '' })
//     } catch (err) {
//       toast.error(getErrorMessage(err))
//     } finally {
//       setSavingPw(false)
//     }
//   }
// const [showOldPassword, setShowOldPassword] = useState(false)
// const [showNewPassword, setShowNewPassword] = useState(false)
//   return (
//     <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
//       <h1 className="font-display text-3xl font-bold text-ink">Your profile</h1>

//       <form onSubmit={handleProfileSubmit} className="ticket-card shadow-card p-6 space-y-4">
//         <h2 className="font-display font-semibold text-lg flex items-center gap-2 text-ink"><User size={18} className="text-mango-dark" /> Personal details</h2>
//         <div>
//           <label className="text-sm font-medium text-ink/70">Full name</label>
//           <input value={form.name} onChange={updateField('name')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
//         </div>
//         <div>
//           <label className="text-sm font-medium text-ink/70">Email</label>
//           <input value={user?.email || ''} disabled className="input w-full mt-1 bg-sand/60 border-sand rounded-xl text-ink/50" />
//         </div>
//         <div>
//           <label className="text-sm font-medium text-ink/70">Phone</label>
//           <input value={form.phone} onChange={updateField('phone')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
//         </div>
//         <div>
//           <label className="text-sm font-medium text-ink/70">Delivery address</label>
//           <input value={form.address} onChange={updateField('address')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
//         </div>
//         <button type="submit" disabled={savingProfile} className="btn bg-mango hover:bg-mango-dark text-white border-none rounded-xl focus-ring">
//           {savingProfile ? 'Saving...' : 'Save changes'}
//         </button>
//       </form>

//       <form onSubmit={handlePasswordSubmit} className="ticket-card shadow-card p-6 space-y-4">
//         <h2 className="font-display font-semibold text-lg flex items-center gap-2 text-ink"><Lock size={18} className="text-mango-dark" /> Change password</h2>
//         {/* <div>
//           <label className="text-sm font-medium text-ink/70">Current password</label>
//           <input type="password" required value={pwForm.old_password} onChange={updatePwField('old_password')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
//         </div>
//         <div>
//           <label className="text-sm font-medium text-ink/70">New password</label>
//           <input type="password" required value={pwForm.new_password} onChange={updatePwField('new_password')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
//         </div> */}
//         <div>
//   <label className="text-sm font-medium text-ink/70">
//     Current password
//   </label>

//   <div className="relative mt-1">
//     <input
//       type={showOldPassword ? 'text' : 'password'}
//       required
//       value={pwForm.old_password}
//       onChange={updatePwField('old_password')}
//       className="input w-full bg-cream border-sand focus:border-mango rounded-xl focus-ring pr-12"
//     />

//     <button
//       type="button"
//       onClick={() => setShowOldPassword(!showOldPassword)}
//       className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
//     >
//       {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//     </button>
//   </div>
// </div>
// <div>
//   <label className="text-sm font-medium text-ink/70">
//     New password
//   </label>

//   <div className="relative mt-1">
//     <input
//       type={showNewPassword ? 'text' : 'password'}
//       required
//       value={pwForm.new_password}
//       onChange={updatePwField('new_password')}
//       className="input w-full bg-cream border-sand focus:border-mango rounded-xl focus-ring pr-12"
//     />

//     <button
//       type="button"
//       onClick={() => setShowNewPassword(!showNewPassword)}
//       className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
//     >
//       {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//     </button>
//   </div>
// </div>
//         <button type="submit" disabled={savingPw} className="btn bg-ink hover:bg-plum text-white border-none rounded-xl focus-ring">
//           {savingPw ? 'Updating...' : 'Update password'}
//         </button>
//       </form>
//     </div>
//   )
// }
import { useState } from 'react'
import toast from 'react-hot-toast'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import customerService from '../../services/customerService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { getErrorMessage } from '../../utils/helpers.js'

export default function CustomerProfile() {
  const { user, refreshUser } = useAuth()
  
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    phone: user?.phone || '', 
    address: user?.address || '' 
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
      const res = await customerService.updateProfile(form)
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
      await customerService.changePassword(pwForm)
      toast.success('Password changed')
      setPwForm({ old_password: '', new_password: '' })
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSavingPw(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="font-display text-3xl font-bold text-ink">Your profile</h1>

      <form onSubmit={handleProfileSubmit} className="ticket-card shadow-card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg flex items-center gap-2 text-ink">
          <User size={18} className="text-mango-dark" /> Personal details
        </h2>
        
        <div>
          <label className="text-sm font-medium text-ink/70">Full name</label>
          <input 
            value={form.name} 
            onChange={updateField('name')} 
            className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" 
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Email</label>
          <input 
            type="email"
            required
            value={form.email} 
            onChange={updateField('email')} 
            className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" 
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70">Phone</label>
          <input 
            value={form.phone} 
            onChange={updateField('phone')} 
            className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" 
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70">Delivery address</label>
          <input 
            value={form.address} 
            onChange={updateField('address')} 
            className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" 
          />
        </div>

        <button type="submit" disabled={savingProfile} className="btn bg-mango hover:bg-mango-dark text-white border-none rounded-xl focus-ring">
          {savingProfile ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      {/* Change Password Form */}
      <form onSubmit={handlePasswordSubmit} className="ticket-card shadow-card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg flex items-center gap-2 text-ink">
          <Lock size={18} className="text-mango-dark" /> Change password
        </h2>

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
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

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
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={savingPw} className="btn bg-ink hover:bg-plum text-white border-none rounded-xl focus-ring">
          {savingPw ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  )
}