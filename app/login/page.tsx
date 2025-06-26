'use client'

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        // Register
        const registerResponse = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, firstName, lastName }),
        });

        const registerData = await registerResponse.json();
          if (!registerResponse.ok) {
          throw new Error(registerData.error || 'Registration failed');
        }
        
        // After successful registration, log user in
        localStorage.setItem('user', JSON.stringify({
          id: registerData.user.id,
          email: registerData.user.email,
          firstName: registerData.user.firstName,
          lastName: registerData.user.lastName,
          token: registerData.token
        }));

        router.push('/account');
      } else {
        // Login
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginResponse.json();
          if (!loginResponse.ok) {
          throw new Error(loginData.error || 'Login failed');
        }

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify({
          id: loginData.user.id,
          email: loginData.user.email,
          firstName: loginData.user.firstName,
          lastName: loginData.user.lastName,
          token: loginData.token
        }));

        // Redirect to account page
        router.push('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };
  // No demo login function - requiring real authentication

  return (
    <div className="min-h-screen bg-[#f5f3ea] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center">
            <Link href="/">
              <span className="inline-block text-4xl font-serif font-normal tracking-tight text-gray-900 leading-none cursor-pointer">ZEVANY</span>
            </Link>
            <h2 className="mt-6 text-3xl font-serif font-light text-gray-900">
              {isRegister ? 'Create your account' : 'Sign in to your account'}
            </h2>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6 bg-white p-8 shadow-lg" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              {isRegister && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="first-name" className="sr-only">First name</label>
                    <input 
                      id="first-name" 
                      name="first-name" 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required 
                      className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm" 
                      placeholder="First name" 
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="sr-only">Last name</label>
                    <input 
                      id="last-name" 
                      name="last-name" 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required 
                      className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm" 
                      placeholder="Last name" 
                    />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input 
                  id="email-address" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm" 
                  placeholder="Email address" 
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="current-password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm" 
                  placeholder="Password" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-gray-600 hover:text-gray-900">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isRegister ? 'Create Account' : 'Sign In'
                )}              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => setIsRegister(!isRegister)} className="font-medium text-gray-900 hover:underline">
                {isRegister ? 'Sign In' : 'Create one'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
