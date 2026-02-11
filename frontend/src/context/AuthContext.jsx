/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { clearAuthToken, getAuthToken, setAuthToken } from '../api/client'

const AuthContext = createContext(null)

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser)
  const [token, setToken] = useState(() => getAuthToken())

  const login = useCallback(({ token: nextToken, user: nextUser }) => {
    if (nextToken) {
      setAuthToken(nextToken)
      setToken(nextToken)
    }

    if (nextUser) {
      localStorage.setItem('user', JSON.stringify(nextUser))
      setUser(nextUser)
    }
  }, [])

  const logout = useCallback(() => {
    clearAuthToken()
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
  }, [])

  const updateUser = useCallback((nextUser) => {
    if (!nextUser) return
    localStorage.setItem('user', JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
      updateUser,
    }),
    [login, logout, token, updateUser, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
