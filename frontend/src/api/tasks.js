import { apiRequest } from './client'

export const getTasks = ({ page = 1, limit = 10, search = '' } = {}) => {
  const params = new URLSearchParams()
  if (page) params.set('page', page)
  if (limit) params.set('limit', limit)
  if (search?.trim()) params.set('search', search.trim())

  const query = params.toString()
  return apiRequest(`/api/tasks${query ? `?${query}` : ''}`, {
    auth: true,
  })
}

export const createTask = (payload) =>
  apiRequest('/api/tasks', {
    method: 'POST',
    body: payload,
    auth: true,
  })

export const deleteTask = (taskId) =>
  apiRequest(`/api/tasks/${taskId}`, {
    method: 'DELETE',
    auth: true,
  })

export const updateTask = (taskId, payload) =>
  apiRequest(`/api/tasks/${taskId}`, {
    method: 'PUT',
    body: payload,
    auth: true,
  })
