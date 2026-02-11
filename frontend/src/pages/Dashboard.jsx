import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createTask, deleteTask, getTasks, updateTask } from '../api/tasks'
import { useAuth } from '../context/AuthContext'
import useDebouncedValue from '../hooks/useDebouncedValue'

const Dashboard = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [tasks, setTasks] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    pageSize: 10,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  })
  const [creating, setCreating] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState('')
  const [updatingTaskId, setUpdatingTaskId] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)

  const fetchTasks = useCallback(async (page = 1, searchTerm = debouncedSearch) => {
    setLoading(true)
    setError('')

    try {
      const data = await getTasks({ page, limit: 10, search: searchTerm })
      setTasks(data?.tasks || [])
      setPagination(
        data?.pagination || {
          currentPage: page,
          totalPages: 1,
          totalTasks: 0,
          pageSize: 10,
        }
      )
    } catch (err) {
      if (err?.status === 401) {
        logout()
        navigate('/login')
        return
      }
      setError(
        err?.message || 'Unable to fetch tasks.'
      )
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, logout, navigate])

  useEffect(() => {
    fetchTasks(1, debouncedSearch)
  }, [debouncedSearch, fetchTasks])

  const searchSuggestions = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return []

    const uniqueTitles = new Set()
    for (const task of tasks) {
      const title = task?.title?.trim()
      if (!title) continue
      if (title.toLowerCase().includes(term)) {
        uniqueTitles.add(title)
      }
      if (uniqueTitles.size >= 6) break
    }

    return Array.from(uniqueTitles)
  }, [tasks, search])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateTask = async (event) => {
    event.preventDefault()
    setCreating(true)
    setError('')

    if (!form.title.trim()) {
      setError('Please provide a task title.')
      setCreating(false)
      return
    }

    try {
      await createTask({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        dueDate: form.dueDate || undefined,
      })

      setForm({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
      })

      fetchTasks(1)
    } catch (err) {
      setError(err?.message || 'Unable to create task.')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!taskId) return
    setDeletingTaskId(taskId)
    setError('')

    try {
      await deleteTask(taskId)
      setTasks((prev) => prev.filter((task) => task._id !== taskId))
      setPagination((prev) => ({
        ...prev,
        totalTasks: Math.max((prev?.totalTasks || 1) - 1, 0),
      }))
    } catch (err) {
      setError(err?.message || 'Unable to delete task.')
    } finally {
      setDeletingTaskId('')
    }
  }

  const handleToggleTaskStatus = async (task) => {
    if (!task?._id) return
    const nextStatus =
      task.status === 'completed' ? 'pending' : 'completed'

    setUpdatingTaskId(task._id)
    setError('')

    try {
      const data = await updateTask(task._id, { status: nextStatus })
      const updatedTask = data?.task
      setTasks((prev) =>
        prev.map((item) =>
          item._id === task._id
            ? { ...item, ...(updatedTask || { status: nextStatus }) }
            : item
        )
      )
    } catch (err) {
      setError(err?.message || 'Unable to update task status.')
    } finally {
      setUpdatingTaskId('')
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(20,184,166,0.14),transparent_36%),radial-gradient(circle_at_85%_12%,rgba(245,158,11,0.16),transparent_38%),linear-gradient(180deg,#f8f5ef_0%,#f3eee3_100%)] text-slate-900">
      <nav className="sticky top-0 z-40 border-b border-amber-100/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-900">
            PrimeTrade
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/profile" className="text-sm font-medium text-teal-700 hover:text-teal-900">Profile</Link>
            <button onClick={handleLogout} className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-slate-400">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Create tasks, search, and track the 10 newest items.
            </p>
          </div>
          <div className="relative w-full max-w-sm">
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 120)
              }}
              placeholder="Search tasks..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
            {showSuggestions && searchSuggestions.length > 0 ? (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                {searchSuggestions.map((title) => (
                  <button
                    key={title}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setSearch(title)
                      setShowSuggestions(false)
                    }}
                    className="block w-full border-b border-slate-100 px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-teal-50 last:border-b-0"
                  >
                    {title}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
          <div className="rounded-2xl border border-amber-100 bg-white/90 p-6 shadow-lg shadow-amber-100/40">
            <h2 className="text-lg font-semibold text-slate-900">Create new task</h2>
            <p className="mt-1 text-sm text-slate-600">
              Add a task and keep your momentum going.
            </p>
            <form className="mt-6 space-y-4" onSubmit={handleCreateTask}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="Task title"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Optional details"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Priority</label>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Due date</label>
                  <input
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleFormChange}
                    type="date"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={creating}
                className="w-full rounded-xl bg-linear-to-r from-teal-600 to-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? 'Creating...' : 'Create task'}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white/90 p-6 shadow-lg shadow-amber-100/40">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Newest tasks</h2>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                {pagination.totalTasks || 0} total
              </div>
            </div>

            {error ? (
              <p className="mt-4 text-sm text-rose-600" role="alert">{error}</p>
            ) : null}

            {loading ? (
              <p className="mt-5 text-sm text-slate-600">Loading tasks...</p>
            ) : null}

            {!loading && tasks.length === 0 ? (
              <p className="mt-5 text-sm text-slate-600">
                No tasks found. Try adjusting your search or add a new task.
              </p>
            ) : null}

            <div className="mt-6 space-y-4">
              {tasks.map((task) => (
                <div key={task._id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {task.dueDate
                          ? `Due ${new Date(task.dueDate).toLocaleDateString()}`
                          : 'No due date'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-teal-200 bg-teal-50 px-2 py-1 font-medium text-teal-800">
                        {task.priority} priority
                      </span>
                      <span className="rounded-full bg-amber-100 px-2 py-1 font-medium text-amber-800">
                        {task.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleTaskStatus(task)}
                        disabled={updatingTaskId === task._id}
                        className="rounded-full border border-cyan-300 bg-cyan-50 px-2 py-1 font-medium text-cyan-800 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingTaskId === task._id
                          ? 'Updating...'
                          : task.status === 'completed'
                            ? 'Mark pending'
                            : 'Mark done'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task._id)}
                        disabled={
                          deletingTaskId === task._id ||
                          updatingTaskId === task._id
                        }
                        className="rounded-full border border-rose-300 bg-rose-50 px-2 py-1 font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingTaskId === task._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                disabled={pagination.currentPage <= 1 || loading}
                onClick={() =>
                  fetchTasks(pagination.currentPage - 1, debouncedSearch)
                }
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Prev
              </button>
              <span className="text-sm text-slate-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                disabled={
                  pagination.currentPage >= pagination.totalPages || loading
                }
                onClick={() =>
                  fetchTasks(pagination.currentPage + 1, debouncedSearch)
                }
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
