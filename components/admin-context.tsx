"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AdminContextType {
  adminKey: string | null
  isAuthenticated: boolean
  login: (key: string) => void
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminKey, setAdminKey] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for stored admin key on mount
    const storedKey = localStorage.getItem('admin_key')
    if (storedKey) {
      setAdminKey(storedKey)
      setIsAuthenticated(true)
    }
  }, [])

  const login = (key: string) => {
    setAdminKey(key)
    setIsAuthenticated(true)
    localStorage.setItem('admin_key', key)
  }

  const logout = () => {
    setAdminKey(null)
    setIsAuthenticated(false)
    localStorage.removeItem('admin_key')
    router.push('/admin/login')
  }

  return (
    <AdminContext.Provider value={{ adminKey, isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
