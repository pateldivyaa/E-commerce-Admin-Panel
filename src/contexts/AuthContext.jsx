import { createContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

export const AuthContext = createContext(null)

const API_URL = 'http://localhost:5001'

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('ecomm_user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setCurrentUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('ecomm_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.get(`${API_URL}/users?email=${email}`)
      const user = response.data[0]

      if (user && user.password === password) {
        const { password: _, ...userWithoutPassword } = user
        setCurrentUser(userWithoutPassword)
        setIsAuthenticated(true)
        localStorage.setItem('ecomm_user', JSON.stringify(userWithoutPassword))
        toast.success('Login successful!')
        return { success: true, user: userWithoutPassword }
      }

      toast.error('Invalid credentials')
      return { success: false, error: 'Invalid credentials' }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
      return { success: false, error: error.message || 'Login failed' }
    }
  }

  const register = async (name, email, password) => {
    try {
      // Check if user already exists
      const existingUser = await axios.get(`${API_URL}/users?email=${email}`)
      if (existingUser.data.length > 0) {
        toast.error('Email already registered')
        return { success: false, error: 'Email already registered' }
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: 'admin',
        profilePicture: null,
        createdAt: new Date().toISOString()
      }

      await axios.post(`${API_URL}/users`, newUser)

      const { password: _, ...userWithoutPassword } = newUser
      setCurrentUser(userWithoutPassword)
      setIsAuthenticated(true)
      localStorage.setItem('ecomm_user', JSON.stringify(userWithoutPassword))

      toast.success('Registration successful!')
      return { success: true, user: userWithoutPassword }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
      return { success: false, error: error.message || 'Registration failed' }
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('ecomm_user')
    toast.success('Logged out successfully')
  }

  const updateProfile = async (userData) => {
    try {
      const updatedUser = { ...currentUser, ...userData }
      await axios.patch(`${API_URL}/users/${currentUser.id}`, updatedUser)
      
      setCurrentUser(updatedUser)
      localStorage.setItem('ecomm_user', JSON.stringify(updatedUser))
      toast.success('Profile updated successfully')
      return updatedUser
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile')
      throw error
    }
  }

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}