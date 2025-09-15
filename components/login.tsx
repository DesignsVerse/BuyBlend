"use client"
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

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
        // After registration, switch to login mode
        alert('Registration successful. Please login.');
        setIsRegister(false);
      } else {
        // After login redirect to profile
        router.push('/profile');
      }
    } catch (err) {
      setError('Something went wrong.');
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '1rem' }}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div>
            <label htmlFor="name">Name</label><br />
            <input id="name" name="name" type="text" required />
          </div>
        )}
        <div>
          <label htmlFor="email">Email</label><br />
          <input id="email" name="email" type="email" required />
        </div>
        <div>
          <label htmlFor="password">Password</label><br />
          <input id="password" name="password" type="password" required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <hr />
      <button onClick={() => setIsRegister(!isRegister)} style={{ marginTop: '0.5rem' }}>
        {isRegister ? 'Already have account? Login' : 'New user? Register here'}
      </button>
    </div>
  );
}
