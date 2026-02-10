import { apiRequest, setAuthToken } from './client'

export const registerUser = (payload) =>
  apiRequest('/api/user/signup', {
    method: 'POST',
    body: payload,
  })

export const loginUser = async (payload) => {
  const data = await apiRequest('/api/user/login', {
    method: 'POST',
    body: payload,
  })

  if (data?.token) {
    setAuthToken(data.token)
  }

  return data
}
