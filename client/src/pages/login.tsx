// src/components/Login.tsx
import React, { useState } from 'react';
import { supabase } from '../helper/superBaseClient';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);

    // Log in the user using Supabase Auth.
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      return;
    }

    // Optional: Store role info locally if needed, e.g., in localStorage or context.
    // localStorage.setItem('role', role);

    // Redirect based on the selected role.
    if (role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/member-dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (oauthError) {
      setError(oauthError.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Log In</h1>
        {error && <p className="mb-4 text-red-600 text-center">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <span className="block text-gray-700 mb-1">Login as:</span>
          <div className="flex items-center">
            <label className="mr-4 flex items-center">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === 'admin'}
                onChange={(e) =>
                  setRole(e.target.value as 'admin' | 'member')
                }
                className="mr-1"
              />
              Admin
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="member"
                checked={role === 'member'}
                onChange={(e) =>
                  setRole(e.target.value as 'admin' | 'member')
                }
                className="mr-1"
              />
              Member
            </label>
          </div>
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded mb-4"
        >
          Log In
        </button>
        <div className="flex items-center justify-center">
          <span className="text-gray-600 mr-2">or</span>
          <button
            onClick={handleGoogleLogin}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
