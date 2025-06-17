'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Mail, Lock, Eye, EyeOff, LogOut } from 'lucide-react'

interface AuthDropdownProps {
  user: { firstName: string; lastName: string; email: string } | null
  onLogin: (userData: { firstName: string; lastName: string; email: string }) => void
  onLogout: () => void
}

export function AuthDropdown({ user, onLogin, onLogout }: AuthDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    
    const newErrors: { [key: string]: string } = {}
    if (!loginData.email) newErrors.email = 'Email is required'
    if (!loginData.password) newErrors.password = 'Password is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      // Call actual login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      })
      
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        setErrors({ general: result.error || 'Login failed. Please check your credentials.' })
        setLoading(false)
        return
      }
      
      // Store user data and token
      const userData = {
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email
      }
      
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', result.token)
      onLogin(userData)
      setIsOpen(false)
      setLoginData({ email: '', password: '' })
      
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: 'Login failed. Please try again.' })
    }
    
    setLoading(false)
  }
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    
    const newErrors: { [key: string]: string } = {}
    if (!signupData.firstName) newErrors.firstName = 'First name is required'
    if (!signupData.lastName) newErrors.lastName = 'Last name is required'
    if (!signupData.email) newErrors.email = 'Email is required'
    if (!signupData.password) newErrors.password = 'Password is required'
    if (signupData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      // Call actual register API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          email: signupData.email,
          password: signupData.password
        })
      })
      
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        setErrors({ general: result.error || 'Registration failed. Please try again.' })
        setLoading(false)
        return
      }
      
      // Store user data and token
      const userData = {
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email
      }
      
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', result.token)
      onLogin(userData)
      setIsOpen(false)
      setSignupData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
      
    } catch (error) {
      console.error('Signup error:', error)
      setErrors({ general: 'Registration failed. Please try again.' })
    }
    
    setLoading(false)
  }

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 p-2 text-gray-900 hover:text-gray-700 transition-colors"
        >
          <User className="h-6 w-6" />
          <span className="text-sm font-medium">{user.firstName}</span>
        </button>
          {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 text-sm text-gray-900 border-b">
              {user.firstName} {user.lastName}
            </div>
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <User className="h-4 w-4 mr-2" />
              Account
            </Link>
            <button
              onClick={() => {
                onLogout()
                setIsOpen(false)
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 text-gray-900 hover:text-gray-700 transition-colors"
      >
        <User className="h-6 w-6" />
        <span className="text-sm font-medium">Account</span>
      </button>
        {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[85vh] overflow-y-auto">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'login'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'signup'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="p-4 pb-6">{errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                {errors.general}
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />                    <input
                      type="email"
                      placeholder="Email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-black"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />                      <input
                        type="text"
                        placeholder="First Name"
                        value={signupData.firstName}
                        onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-black"
                      />
                    </div>
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>
                  
                  <div>                    <input
                      type="text"
                      placeholder="Last Name"
                      value={signupData.lastName}
                      onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-black"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />                    <input
                      type="email"
                      placeholder="Email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-black"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div>                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-black"
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}            <div className="mt-4 text-center text-sm text-gray-600">
              {activeTab === 'login' 
                ? "Track your orders and manage your account easily"
                : "Join us to track orders and save your preferences"
              }
            </div>
            
            <div className="border-t border-gray-200 mt-4 pt-4">
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <User className="h-4 w-4 mr-2" />
                Go to Account Page
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
