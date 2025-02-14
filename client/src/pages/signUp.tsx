// src/components/SignUp.tsx
import React, { useState } from 'react';
import { supabase } from '../libs/helper/superBaseClient';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setError(null);

    // Sign up the user using Supabase auth.
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    // After signing up, insert user info into your User table.
    const { user } = data;
    if (user) {
      const { error: dbError } = await supabase
        .from('User')
        .insert([
          {
            email: user.email,
            password: '', // Leave empty since Supabase manages the password securely.
            name,
          },
        ]);

      if (dbError) {
        setError(dbError.message);
      } else {
        // Redirect to the /login page upon successful sign-up.
        navigate('/login');
      }
    }
  };

  const handleGoogleSignIn = async () => {
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
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        {error && <p className="mb-4 text-red-600 text-center">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full border border-gray-300 rounded p-2"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button
          onClick={handleSignUp}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded mb-4"
        >
          Sign Up
        </button>
        <div className="flex items-center justify-center">
          <span className="text-gray-600 mr-2">or</span>
          <button
            onClick={handleGoogleSignIn}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
