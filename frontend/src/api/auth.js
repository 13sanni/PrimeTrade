import { apiRequest } from './client'

export const registerUser = (payload) =>
  apiRequest('/api/user/signup', {
    method: 'POST',
    body: payload,
  })

export const loginUser = async (payload) => {
  return apiRequest('/api/user/login', {
    method: 'POST',
    body: payload,
  })
}

export const getUserProfile = () =>
  apiRequest('/api/user/profile', {
    auth: true,
  })

export const updateUserProfile = (payload) =>
  apiRequest('/api/user/profile', {
    method: 'PUT',
    body: payload,
    auth: true,
  })
