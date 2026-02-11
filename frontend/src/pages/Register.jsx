import { useState } from 'react'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'

const Register = () => {
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: '',
  })

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ loading: true, error: '', success: '' })

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setStatus({
        loading: false,
        error: 'Please fill out all fields.',
        success: '',
      })
      return
    }

    if (form.password.length < 6) {
      setStatus({
        loading: false,
        error: 'Password must be at least 6 characters.',
        success: '',
      })
      return
    }

    try {
      const data = await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })

      setStatus({
        loading: false,
        error: '',
        success: data?.message || 'Account created. Please login.',
      })

      setForm({ name: '', email: '', password: '' })
      navigate('/login')
    } catch (error) {
      const apiErrors = error?.details?.errors
      const message = Array.isArray(apiErrors)
        ? apiErrors.join(' ')
        : error?.details?.message || error?.message || 'Unable to create account.'

      setStatus({
        loading: false,
        error: message,
        success: '',
      })
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_14%,rgba(20,184,166,0.16),transparent_40%),radial-gradient(circle_at_88%_8%,rgba(245,158,11,0.2),transparent_44%),linear-gradient(180deg,#f8f5ef_0%,#f3eee3_100%)] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-14 lg:grid-cols-2">
        <Motion.div
          className="space-y-6"
          initial={prefersReducedMotion ? false : 'hidden'}
          animate={prefersReducedMotion ? false : 'visible'}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          variants={fadeUp}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-teal-800">
            PrimeTrade
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            Create your account
          </h1>
          <p className="text-base text-slate-600 sm:text-lg">
            Manage tasks, track progress, and stay focused. Your workspace is
            ready the moment you sign up.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
              Secure JWT auth
            </span>
            <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
              Task management
            </span>
            <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
              Fast and responsive
            </span>
          </div>
        </Motion.div>

        <Motion.div
          className="rounded-2xl border border-amber-100 bg-white/90 p-8 shadow-xl shadow-amber-100/60 backdrop-blur"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={prefersReducedMotion ? false : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Full name</label>
              <input
                name="name"
                type="text"
                placeholder="Jane Doe"
                value={form.name}
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
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                name="password"
                type="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {status.error ? (
              <p className="text-sm text-rose-600" role="alert">{status.error}</p>
            ) : null}

            {status.success ? (
              <p className="text-sm text-emerald-600" role="status">{status.success}</p>
            ) : null}

            <button
              type="submit"
              disabled={status.loading}
              className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status.loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link className="font-semibold text-teal-700 hover:text-teal-900" to="/login">
                Sign in
              </Link>
            </p>
          </form>
        </Motion.div>
      </div>
    </div>
  )
}

export default Register
