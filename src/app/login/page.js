'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/firebase/config';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' | 'error'

  const handleLogin = async (e) => {
    e.preventDefault();
    setToastMessage('');
    setToastType('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('[LOGIN] Success:', user.email);
      setToastMessage('✅ Login successful');
      setToastType('success');

      setTimeout(() => {
        window.location.href = '/home';
      }, 1000);
    } catch (error) {
      console.error('[LOGIN] Error:', error.message);
      if (error.code === 'auth/user-not-found') {
        setToastMessage('❌ No user found with that email address');
      } else {
        setToastMessage('❌ ' + error.message);
      }
      setToastType('error');
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setToastMessage('✅ Google sign-in successful');
      setToastType('success');

      setTimeout(() => {
        window.location.href = '/home';
      }, 1000);
    } catch (error) {
      console.error('[GOOGLE SIGN-IN ERROR]', error.message);
      setToastMessage('❌ Google sign-in failed');
      setToastType('error');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-4">
  <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-md rounded-xl border border-gray-700 shadow-2xl">
    <h1 className="text-4xl font-extrabold text-center mb-4 tracking-tight leading-snug">
      Welcome Back to Nike
    </h1>
    <p className="text-sm text-center text-gray-400 mb-6">
      Sign in to access AI-powered performance gear and your personal dashboard.
    </p>


        {/* Toast Message */}
        {toastMessage && (
          <div
            className={`mb-4 px-4 py-2 rounded text-sm text-center font-medium transition-all duration-300 ${
              toastType === 'success' ? 'bg-green-600' : 'bg-red-600'
            } text-white`}
          >
            {toastMessage}
          </div>
        )}

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 mb-6 bg-white text-black rounded-md font-semibold shadow hover:bg-gray-100 transition duration-200"
        >
          <FcGoogle size={22} />
          Sign in with Google
        </button>

        {/* Divider */}
        <div className="flex items-center mb-4">
          <div className="flex-grow h-px bg-gray-600" />
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-600" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-blue-400 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Register Redirect */}
        <p className="mt-6 text-center text-sm text-gray-400">
          New to Nike AI?{' '}
          <a
            href="/register"
            className="text-blue-400 hover:underline font-medium"
          >
            Create an account
          </a>
        </p>
      </div>
    </section>
  );
}
