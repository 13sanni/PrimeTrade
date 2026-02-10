const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const getAuthToken = () => localStorage.getItem('token')
export const setAuthToken = (token) => localStorage.setItem('token', token)
export const clearAuthToken = () => localStorage.removeItem('token')

export const apiRequest = async (path, options = {}) => {
  const { method = 'GET', body, auth = false, headers = {} } = options

  const finalHeaders = { ...headers }
  const isFormData = body instanceof FormData

  if (body && !isFormData) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getAuthToken()
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  })

  const data = await response
    .json()
    .catch(() => ({ message: 'Unexpected response from server' }))

  if (!response.ok) {
    const error = new Error(data?.message || 'Request failed')
    error.status = response.status
    error.details = data
    throw error
  }

  return data
}
