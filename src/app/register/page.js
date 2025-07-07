'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/firebase/config';

import { Eye, EyeOff, Mail, Lock, KeyRound } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://otp-backend-1-3aee.onrender.com';

  useEffect(() => {
    fetch(`${backendUrl}/`)
      .then((res) => res.json())
      .then((data) => console.log('📡 OTP Server:', data.message))
      .catch((err) => console.error('❌ OTP server down:', err));
  }, [backendUrl]);

  const sendOtp = async () => {
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('❌ Enter a valid email address');
      return;
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setErrorMsg('❌ Email is already registered. Try logging in.');
        return;
      }
    } catch (err) {
      setErrorMsg('❌ Error checking email status');
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setErrorMsg('');
        console.log('✅ OTP sent');
      } else {
        setErrorMsg(data.error || '❌ Failed to send OTP');
      }
    } catch (err) {
      setErrorMsg('❌ OTP server error: ' + err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password || !confirm || !otp) {
      setErrorMsg('❌ All fields (including OTP) are required');
      return;
    }

    if (password !== confirm) {
      setErrorMsg('❌ Passwords do not match');
      return;
    }

    // Verify OTP with backend
    try {
      const verifyRes = await fetch(`${backendUrl}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!verifyRes.ok) {
        throw new Error(`HTTP error ${verifyRes.status}`);
      }

      const verifyData = await verifyRes.json();

      if (!verifyData.verified) {
        setErrorMsg('❌ Incorrect OTP');
        return;
      }
    } catch (err) {
      setErrorMsg('❌ OTP verification failed: ' + err.message);
      return;
    }

    // Create Firebase user
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/home');
    } catch (err) {
      setErrorMsg('❌ Registration failed: ' + err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/home');
    } catch (err) {
      setErrorMsg('❌ Google sign-in failed');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-4">
      <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-md rounded-xl border border-gray-700 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center mb-4 tracking-tight leading-snug">
          Nike Awaits You
        </h1>
        <p className="text-sm text-center text-gray-400 mb-6">
          Create your Nike account and unlock next-gen gear powered by innovation.
        </p>

        {errorMsg && (
          <div className="mb-4 text-sm text-center text-red-500">{errorMsg}</div>
        )}

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 mb-6 bg-white text-black rounded-md font-semibold shadow hover:bg-gray-100 transition"
        >
          <FcGoogle size={22} />
          Sign up with Google
        </button>

        <div className="flex items-center mb-5">
          <div className="flex-grow h-px bg-gray-600" />
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-600" />
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm flex items-center gap-1">
              <Mail size={16} /> Email
            </label>
            <div className="flex gap-2 mt-1">
              <input
                type="email"
                required
                className="flex-1 px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="button"
                onClick={sendOtp}
                className="px-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold"
                disabled={otpSent}
                title={otpSent ? 'OTP already sent' : 'Send OTP'}
              >
                Send OTP
              </button>
            </div>
          </div>

          {/* OTP */}
          {otpSent && (
            <div>
              <label className="text-sm flex items-center gap-1">
                <KeyRound size={16} /> Enter OTP
              </label>
              <input
                type="text"
                required
                className="w-full mt-1 px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="text-sm flex items-center gap-1">
              <Lock size={16} /> Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm flex items-center gap-1">
              <Lock size={16} /> Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-md bg-blue-600 hover:bg-blue-700 font-semibold transition"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="text-blue-400 hover:underline">
            Log in here
          </a>
        </p>
      </div>
    </section>
  );
}
