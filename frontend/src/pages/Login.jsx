import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { loginUser } from '../api/auth'

const Login = () => {
  const prefersReducedMotion = useReducedMotion()
  const [form, setForm] = useState({ email: '', password: '' })
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

    if (!form.email.trim() || !form.password) {
      setStatus({
        loading: false,
        error: 'Please enter your email and password.',
        success: '',
      })
      return
    }

    try {
      const data = await loginUser({
        email: form.email.trim(),
        password: form.password,
      })

      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      setStatus({
        loading: false,
        error: '',
        success: data?.message || 'Login successful.',
      })
    } catch (error) {
      const apiErrors = error?.details?.errors
      const message = Array.isArray(apiErrors)
        ? apiErrors.join(' ')
        : error?.details?.message || error?.message || 'Unable to login.'

      setStatus({
        loading: false,
        error: message,
        success: '',
      })
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
        <motion.div
          className="space-y-6"
          initial={prefersReducedMotion ? false : 'hidden'}
          animate={prefersReducedMotion ? false : 'visible'}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          variants={fadeUp}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            PrimeTrade
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Welcome back
          </h1>
          <p className="text-base text-slate-300 sm:text-lg">
            Sign in to manage your tasks and keep your workflow moving.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
            <span className="rounded-full border border-slate-700 px-3 py-1">
              Fast login
            </span>
            <span className="rounded-full border border-slate-700 px-3 py-1">
              Secure access
            </span>
            <span className="rounded-full border border-slate-700 px-3 py-1">
              Built for focus
            </span>
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={prefersReducedMotion ? false : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-200">Password</label>
              <input
                name="password"
                type="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            {status.error ? (
              <p className="text-sm text-rose-300" role="alert">
                {status.error}
              </p>
            ) : null}

            {status.success ? (
              <p className="text-sm text-emerald-300" role="status">
                {status.success}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status.loading}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status.loading ? 'Signing in...' : 'Sign in'}
            </button>

            <p className="text-center text-sm text-slate-400">
              New here?{' '}
              <a className="text-cyan-300 hover:text-cyan-200" href="/register">
                Create an account
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
