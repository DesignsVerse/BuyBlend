'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useCart } from '@/lib/cart/cart-context';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserId } = useCart();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
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
  }, [router, searchParams, setUserId]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

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
      setSubmitting(false);
    }
  }

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-lg p-8 rounded-2xl text-center shadow-2xl border border-gray-200/20">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-900 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12 relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
      <Image
        src="/login.png" 
        alt="Login Background"
        fill
        className="object-cover opacity-30"
        priority
      />
    </div>
      {/* Overlay to enhance contrast */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative max-w-md w-full bg-white p-10 rounded-3xl border border-gray-200/20 shadow-3xl transform transition-all duration-500 hover:shadow-4xl">
        {/* Premium Header */}
        {/* <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-900 to-black rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white tracking-tighter">B</span>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight">
            BLEND
          </h1>
          <p className="text-gray-600 mt-2 text-sm font-light tracking-wide">Pure Blend, Pure You</p>
        </div> */}

        {/* Form Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light text-gray-900 tracking-tight">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            {isRegister ? 'Join the BLEND community' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/30 focus:border-gray-900/50 transition-all duration-300 bg-white/80 text-gray-900 placeholder-gray-400"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/30 focus:border-gray-900/50 transition-all duration-300 bg-white/80 text-gray-900 placeholder-gray-400"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/30 focus:border-gray-900/50 transition-all duration-300 bg-white/80 text-gray-900 placeholder-gray-400"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50/80 border border-red-200 rounded-xl animate-pulse">
              <p className="text-red-700 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-semibold hover:from-black hover:to-gray-800 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900/30 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center group"
          >
            {submitting ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="flex items-center">
                {isRegister ? 'Create Account' : 'Sign In'}
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300/60"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-white text-gray-500 text-sm font-light tracking-wide">Or continue with</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="mb-8">
  {/* Google button only */}
  <button className="w-full py-3.5 px-4 border border-gray-300/60 rounded-xl font-medium text-gray-700 
    hover:bg-gray-50/80 hover:border-gray-400 transition-all duration-200 
    flex items-center justify-center group">
    
    <svg
      className="w-5 h-5 text-red-600 group-hover:text-red-700"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187..."/>
    </svg>
    <span className="ml-2">Google</span>
  </button>
</div>


        {/* Toggle between Login/Register */}
        <p className="text-center text-sm text-gray-600 font-light tracking-wide">
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <button
            className="text-gray-900 hover:text-gray-700 font-semibold underline transition-all duration-200 hover:no-underline"
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