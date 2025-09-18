'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useCart } from '@/lib/cart/cart-context';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserId } = useCart();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // ✅ spinner state

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          // Set cart userId to load server cart
          setUserId(data.user.id);
          router.push('/profile');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    }

    const registerParam = searchParams.get('register');
    if (registerParam === 'true') {
      setIsRegister(true);
    }

    checkAuth();
  }, [router, searchParams]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSubmitting(true); // ✅ loader start

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const name = isRegister ? formData.get('name')?.toString() || '' : undefined;

    try {
      const url = isRegister ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isRegister ? { email, password, name } : { email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      if (isRegister) {
        alert('Registration successful. Please login.');
        setIsRegister(false);
      } else {
        // After login, fetch /api/auth/me to get user and set cart userId
        try {
          const me = await fetch('/api/auth/me');
          if (me.ok) {
            const dataMe = await me.json();
            setUserId(dataMe.user.id);
          }
        } catch {}
        router.push('/profile');
        router.refresh();
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setSubmitting(false); // ✅ loader stop
    }
  }

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg text-center">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-800 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="max-w-md w-full bg-white p-10 rounded-lg border border-gray-200 shadow-lg">
        {/* Brand Header */}
        <div className="text-center font-sans mb-4">
          <h1 className="text-3xl font-bold text-black tracking-tight">BLEND</h1>
          <p className="text-gray-600 mt- text-sm">Pure Blend, Pure You</p>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-4 text-black">
          {isRegister ? 'Create an Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* ✅ Button with spinner */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black shadow-md flex items-center justify-center"
          >
            {submitting ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              isRegister ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button className="py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center">
            GitHub
          </button>
          <button className="py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center">
            Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <button
            className="text-black hover:text-gray-800 font-semibold underline transition-all"
            onClick={() => {
              setError('');
              setIsRegister(!isRegister);
            }}
          >
            {isRegister ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
