import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUserProfile, updateUserProfile } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const navigate = useNavigate()
  const { logout, updateUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getUserProfile()
      const user = data?.user

      setProfile({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      })

      if (user) {
        updateUser({
          id: user?._id || user?.id || '',
          name: user?.name || '',
          email: user?.email || '',
        })
      }
    } catch (err) {
      if (err?.status === 401) {
        logout()
        navigate('/login')
        return
      }
      setError(err?.message || 'Unable to fetch profile.')
    } finally {
      setLoading(false)
    }
  }, [logout, navigate, updateUser])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleChange = (event) => {
    const { name, value } = event.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const name = profile.name.trim()
    const email = profile.email.trim()
    const currentPassword = profile.currentPassword
    const newPassword = profile.newPassword
    const confirmNewPassword = profile.confirmNewPassword
    const hasPasswordChange = Boolean(
      currentPassword || newPassword || confirmNewPassword
    )

    if (!name || !email) {
      setError('Please provide your name and email.')
      setSaving(false)
      return
    }

    if (hasPasswordChange) {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        setError('To change password, fill current, new, and confirm password.')
        setSaving(false)
        return
      }

      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters.')
        setSaving(false)
        return
      }

      if (newPassword !== confirmNewPassword) {
        setError('New password and confirm password do not match.')
        setSaving(false)
        return
      }
    }

    try {
      const payload = { name, email }
      if (hasPasswordChange) {
        payload.currentPassword = currentPassword
        payload.newPassword = newPassword
      }

      const data = await updateUserProfile(payload)
      const user = data?.user

      const nextProfile = {
        name: user?.name || name,
        email: user?.email || email,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }

      setProfile(nextProfile)
      updateUser({
        id: user?._id || user?.id || '',
        name: nextProfile.name,
        email: nextProfile.email,
      })
      setSuccess(data?.message || 'Profile updated successfully.')
    } catch (err) {
      const apiErrors = err?.details?.errors
      const message = Array.isArray(apiErrors)
        ? apiErrors.join(' ')
        : err?.details?.message || err?.message || 'Unable to update profile.'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_10%,rgba(20,184,166,0.14),transparent_38%),radial-gradient(circle_at_88%_12%,rgba(245,158,11,0.16),transparent_40%),linear-gradient(180deg,#f8f5ef_0%,#f3eee3_100%)] text-slate-900">
      <nav className="sticky top-0 z-40 border-b border-amber-100/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-900">
            PrimeTrade
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-sm font-medium text-teal-700 hover:text-teal-900">Dashboard</Link>
            <button onClick={handleLogout} className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-slate-400">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Profile</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Review and update your account information.
        </p>

        <div className="mt-4 max-w-3xl rounded-2xl border border-amber-100 bg-white/90 p-6 shadow-lg shadow-amber-100/40">
          {loading ? (
            <p className="text-sm text-slate-600">Loading profile...</p>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full name</label>
                <input
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={handleChange}
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Current password</label>
                <input
                  name="currentPassword"
                  type="password"
                  value={profile.currentPassword}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="Leave blank to keep current password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">New password</label>
                  <input
                    name="newPassword"
                    type="password"
                    value={profile.newPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Confirm new password</label>
                  <input
                    name="confirmNewPassword"
                    type="password"
                    value={profile.confirmNewPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Re-enter new password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {error ? (
                <p className="text-sm text-rose-600" role="alert">{error}</p>
              ) : null}

              {success ? (
                <p className="text-sm text-emerald-600" role="status">{success}</p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-teal-600 to-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
                <button
                  type="button"
                  onClick={loadProfile}
                  disabled={loading || saving}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Refresh
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}

export default Profile
